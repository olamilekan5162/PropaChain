/* src/hooks/useMovementWallet.jsx */
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useSignRawHash, useCreateWallet } from "@privy-io/react-auth/extended-chains";
import { useState, useEffect, useRef } from "react";
import { aptos } from "../config/movement";
import {
  AccountAuthenticatorEd25519,
  Ed25519PublicKey,
  Ed25519Signature,
  generateSigningMessageForTransaction,
} from "@aptos-labs/ts-sdk";

/**
 * Custom hook to manage wallet state across both Privy and native wallets
 * @returns {Object} Unified wallet state and utilities
 */
export function useMovementWallet() {
  const { authenticated, user, logout } = usePrivy();
  const { createWallet } = useCreateWallet();
  const { wallets } = useWallets();
  const { signRawHash } = useSignRawHash();
  const {
    account,
    connected,
    disconnect,
    signAndSubmitTransaction: nativeSignAndSubmit,
  } = useWallet();
  const [walletAddress, setWalletAddress] = useState("");
  const creationAttempted = useRef(false);

  // Helper to distinguish Aptos (32 bytes) from EVM (20 bytes) addresses
  const isValidAptosAddress = (address) => {
    // Aptos addresses are long (66 chars typically: 0x + 64 hex).
    // EVM addresses are short (42 chars: 0x + 40 hex).
    // SDK error requires at least 60 hex chars.
    return address && address.toString().startsWith("0x") && address.toString().length > 50;
  };

  // Determine wallet address
  useEffect(() => {
    const initWallet = async () => {
      if (authenticated && user) {
        console.log("Privy User:", user);
        console.log("Linked Accounts Dump:", JSON.stringify(user.linkedAccounts, null, 2));
        console.log("Active Wallets:", wallets);
        
        // 1. Check Active Wallets (Best source for multi-chain)
        const aptosActiveWallet = wallets.find(
            w => w.walletClientType === 'privy' && w.chainType === 'aptos'
        );
        if (aptosActiveWallet && isValidAptosAddress(aptosActiveWallet.address)) {
             console.log("Found active Aptos wallet:", aptosActiveWallet.address);
             setWalletAddress(aptosActiveWallet.address);
             return;
        }

        // 2. Try Primary Wallet (Only if it's Aptos)
        if (user.wallet?.address && isValidAptosAddress(user.wallet.address)) {
          console.log("Using primary wallet (Aptos):", user.wallet.address);
          setWalletAddress(user.wallet.address);
          return;
        }

        // 3. Try Aptos-specific wallet in linked accounts
        const aptosLink = user.linkedAccounts?.find(
          (acc) => acc.type === "wallet" && acc.chainType === "aptos"
        );

        if (aptosLink?.address) {
          console.log("Using Aptos linked wallet:", aptosLink.address);
          setWalletAddress(aptosLink.address);
          return;
        }
        
        // 4. Try getting address from ANY Privy wallet if valid
         const anyAptosWallet = user.linkedAccounts?.find(
          (acc) => acc.type === "wallet" && isValidAptosAddress(acc.address)
        );
        if (anyAptosWallet?.address) {
          console.log("Using fallback Aptos wallet:", anyAptosWallet.address);
          setWalletAddress(anyAptosWallet.address);
          return;
        }

        // 5. Critical: If no valid Aptos wallet exists, create one!
        if (!creationAttempted.current) {
          console.log("No valid Aptos wallet found. Attempting to create one...");
          creationAttempted.current = true;
          try {
            const newWallet = await createWallet({ chainType: "aptos" });
            console.log("Created new Aptos wallet:", newWallet);
            if (newWallet?.address) {
              setWalletAddress(newWallet.address);
            }
          } catch (err) {
            console.error("Failed to auto-create wallet:", err);
            // Check if error is "User already has an embedded wallet"
            if (err?.message?.includes("already has") || err?.toString().includes("already has")) {
                 console.warn("User has embedded wallet but no Aptos address found. Suggesting logout.");
                 // Force logout could be aggressive, maybe just toast or rely on UI
                 // But for this user debugging, disconnecting might help refresh metadata
            }
          }
        } else {
           console.warn("Authenticated but no valid Aptos wallet address found (creation already attempted).");
        }

      } else if (connected && account) {
        setWalletAddress(account.address.toString());
      } else {
        setWalletAddress("");
      }
    };

    initWallet();
  }, [authenticated, user, connected, account, createWallet, wallets]);

  // Determine wallet type
  const isPrivyWallet = authenticated;
  const isNativeWallet = connected && !authenticated;
  const isConnected = authenticated || connected;

  // Unified disconnect function
  const disconnectWallet = async () => {
    try {
      if (authenticated) {
        creationAttempted.current = false;
        await logout();
      } else if (connected) {
        await disconnect();
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
      throw error;
    }
  };

  // Get Movement wallet for Privy
  // Must match the logic used for walletAddress to ensure consistency
  const movementWallet = isPrivyWallet
    ? (
        // 0. Active Wallet (Best)
        wallets.find(w => w.walletClientType === 'privy' && w.chainType === 'aptos' && isValidAptosAddress(w.address)) ||
        // 1. Linked Aptos wallet
        user?.linkedAccounts?.find((acc) => acc.type === "wallet" && acc.chainType === "aptos") ||
        // 2. User wallet if it matches our Aptos check
        (user?.wallet && isValidAptosAddress(user.wallet.address) ? { ...user.wallet, publicKey: user.wallet.address } : null) ||
        // 3. Any linked wallet that passes the check
        user?.linkedAccounts?.find((acc) => acc.type === "wallet" && isValidAptosAddress(acc.address))
      )
    : null;

  // Unified transaction signing function
  const signAndSubmitTransaction = async (transactionPayload) => {
    try {
      if (isPrivyWallet && movementWallet) {
        console.log("Signing with Privy Aptos wallet:", movementWallet.address);

        if (!isValidAptosAddress(movementWallet.address)) {
             throw new Error(`Invalid Aptos address detected: ${movementWallet.address}. Please ensure you have an Aptos wallet.`);
        }

        // Build the transaction
        const rawTxn = await aptos.transaction.build.simple({
          sender: movementWallet.address,
          data: transactionPayload.data,
        });

        console.log("[Privy] Transaction built successfully");

        // Generate signing message
        const message = generateSigningMessageForTransaction(rawTxn);
        console.log("[Privy] Signing message generated");

        // Convert message to hex
        const toHex = (buffer) => {
          return Array.from(buffer)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        };

        // Sign with Privy wallet
        const { signature: rawSignature } = await signRawHash({
          address: movementWallet.address,
          chainType: "aptos",
          hash: `0x${toHex(message)}`,
        });

        console.log("[Privy] Transaction signed successfully");

        // Clean public key
        let cleanPublicKey = movementWallet.publicKey.startsWith("0x")
          ? movementWallet.publicKey.slice(2)
          : movementWallet.publicKey;

        if (cleanPublicKey.length > 64) {
           // Ensure we aren't truncating incorrectly, but usually keys with prefixes need cleaning
           // Standard Ed25519 is 32 bytes (64 hex). 
           // If we have 66 (0x prefix), slice 2. 
           // If we have more, might be prefix issue. 
           // Assuming standard behavior here as per reference code.
           cleanPublicKey = cleanPublicKey.slice(-64); // Take last 64 chars? Or slice prefix?
           // Reference implementation used slice(2) on length 66.
           // Let's stick to safe defaults or what we had if valid.
        }
        
        // Re-applying original logic but careful about lengths
        if (cleanPublicKey.length === 66 && cleanPublicKey.startsWith("00")) {
             cleanPublicKey = cleanPublicKey.slice(2);
        }

        // Create authenticator
        const senderAuthenticator = new AccountAuthenticatorEd25519(
          new Ed25519PublicKey(cleanPublicKey),
          new Ed25519Signature(
            rawSignature.startsWith("0x") ? rawSignature.slice(2) : rawSignature
          )
        );

        console.log("[Privy] Submitting transaction to blockchain");

        // Submit the signed transaction
        const committedTransaction = await aptos.transaction.submit.simple({
          transaction: rawTxn,
          senderAuthenticator,
        });

        console.log(
          "[Privy] Transaction submitted:",
          committedTransaction.hash
        );

        // Wait for confirmation
        const executed = await aptos.waitForTransaction({
          transactionHash: committedTransaction.hash,
        });

        if (!executed.success) {
          throw new Error("Transaction failed");
        }

        console.log("[Privy] Transaction confirmed successfully");
        return { hash: committedTransaction.hash };

      } else if (isNativeWallet && nativeSignAndSubmit) {
        console.log("Signing with native wallet:", account?.address);

        const transaction = {
          sender: account.address,
          data: transactionPayload.data,
        };

        const result = await nativeSignAndSubmit(transaction);
        console.log("Native wallet transaction result:", result);
        return result;
      } else {
        throw new Error("No wallet connected for transaction signing");
      }
    } catch (error) {
      console.error("Transaction signing error:", error);
      throw error;
    }
  };

  return {
    isConnected,
    isPrivyWallet,
    isNativeWallet,
    walletAddress,
    privyUser: user,
    nativeAccount: account,
    movementWallet,
    signAndSubmitTransaction,
    disconnectWallet,
    authenticated,
    connected,
  };
}
