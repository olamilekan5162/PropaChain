import { useState, useEffect } from "react";
import { useMovementWallet } from "./useMovementWallet";

const CONTRACT_ADDRESS =
  "0x51bc1ceb0077177745b3de049c63bcfbb189c7a436829c6d1391b116cdc2fac5";

// Dummy backend public key for testing (32 bytes)
const DUMMY_PUBLIC_KEY = new Array(32).fill(0);

export const useInitializeContract = () => {
  const [initialized, setInitialized] = useState(false);
  const [checking, setChecking] = useState(true);
  const { signAndExecuteTransaction, walletAddress } = useMovementWallet();

  useEffect(() => {
    checkInitialization();
  }, [walletAddress]);

  const checkInitialization = async () => {
    if (!walletAddress) {
      setChecking(false);
      return;
    }

    try {
      // Check if NFTRegistry exists at contract address
      const response = await fetch(
        `https://testnet.movementnetwork.xyz/v1/accounts/${CONTRACT_ADDRESS}/resource/${CONTRACT_ADDRESS}::propachain::ProfileRegistry`
      );

      if (response.ok) {
        setInitialized(true);
        console.log("Contract already initialized");
      } else {
        setInitialized(false);
        console.log("Contract not initialized");
      }
    } catch (error) {
      console.error("Error checking initialization:", error);
      setInitialized(false);
    } finally {
      setChecking(false);
    }
  };

  const initialize = async () => {
    if (!walletAddress) {
      throw new Error("No wallet connected");
    }

    try {
      console.log("Initializing contract with address:", walletAddress);

      const payload = {
        data: {
          function: `${CONTRACT_ADDRESS}::propachain::initialize`,
          typeArguments: [],
          functionArguments: [DUMMY_PUBLIC_KEY],
        },
      };

      const result = await signAndExecuteTransaction(payload);
      console.log("Contract initialized successfully:", result);

      setInitialized(true);
      return result;
    } catch (error) {
      console.error("Failed to initialize contract:", error);
      throw error;
    }
  };

  return {
    initialized,
    checking,
    initialize,
    checkInitialization,
  };
};
