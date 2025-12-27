import { useState } from "react";
import { aptos } from "../config/movement";
import { MOVEMENT_CONTRACT_ADDRESS } from "../config/constants";
import { useMovementWallet } from "./useMovementWallet";
import toast from "react-hot-toast";

export const usePropertyOperations = () => {
  const [loading, setLoading] = useState(false);
  const { isConnected, signAndSubmitTransaction, walletAddress } =
    useMovementWallet();

  const getPropertyById = async (propertyId) => {
    try {
      setLoading(true);
      const property = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_property`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, propertyId.toString()],
          typeArguments: [],
        },
      });

      return property[0];
    } catch (err) {
      console.error(`Error fetching property ${propertyId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPropertyStatus = async (propertyId) => {
    try {
      const status = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_property_status`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, propertyId.toString()],
          typeArguments: [],
        },
      });

      return status[0];
    } catch (err) {
      console.error(`Error fetching property status:`, err);
      throw err;
    }
  };

  const getPropertyOwner = async (propertyId) => {
    try {
      const owner = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_property_owner`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, propertyId.toString()],
          typeArguments: [],
        },
      });

      return owner[0];
    } catch (err) {
      console.error(`Error fetching property owner:`, err);
      throw err;
    }
  };

  const getPropertyPrice = async (propertyId) => {
    try {
      const price = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_property_price`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, propertyId.toString()],
          typeArguments: [],
        },
      });

      return price[0];
    } catch (err) {
      console.error(`Error fetching property price:`, err);
      throw err;
    }
  };

  const getEscrowDetails = async (escrowId) => {
    try {
      const escrow = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_escrow`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, escrowId.toString()],
          typeArguments: [],
        },
      });

      return escrow[0];
    } catch (err) {
      console.error(`Error fetching escrow details:`, err);
      throw err;
    }
  };

  const isEscrowResolved = async (escrowId) => {
    try {
      const resolved = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::is_escrow_resolved`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, escrowId.toString()],
          typeArguments: [],
        },
      });

      return resolved[0];
    } catch (err) {
      console.error(`Error checking escrow resolution:`, err);
      throw err;
    }
  };

  const depositToEscrow = async (toastId, propertyId, amount, documentCid) => {
    if (!isConnected) {
      const errorMsg = "Please connect your wallet first";
      toast.error(errorMsg, { id: toastId });
      console.warn(errorMsg, { isConnected });
      return false;
    }

    if (!walletAddress) {
      const errorMsg = "Wallet address not available";
      toast.error(errorMsg, { id: toastId });
      console.warn(errorMsg, { walletAddress });
      return false;
    }

    try {
      setLoading(true);
      console.log("Depositing to escrow:", { propertyId, amount });

      const amountInOctas = Number(amount);

      const transaction = {
        data: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::deposit_to_escrow`,
          typeArguments: [],
          functionArguments: [
            MOVEMENT_CONTRACT_ADDRESS, // store_addr
            MOVEMENT_CONTRACT_ADDRESS, // escrow_store_addr
            MOVEMENT_CONTRACT_ADDRESS, // receipt_store_addr
            Number(propertyId),
            amountInOctas,
            documentCid || "",
          ],
        },
      };

      const result = await signAndSubmitTransaction(transaction);

      toast.dismiss(toastId);
      toast.success("Property Processed successfully!");
      console.log("Escrow deposit successful:", result);

      return true;
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage = error?.message || "An unexpected error occurred";
      toast.error(`Property purchase failed: ${errorMessage}`);
      console.error("purchase error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const buyerRenterConfirms = async (escrowId) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return false;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Confirming transaction...");

      const transaction = {
        data: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::buyer_renter_confirms`,
          typeArguments: [],
          functionArguments: [
            MOVEMENT_CONTRACT_ADDRESS, // escrow_store_addr
            MOVEMENT_CONTRACT_ADDRESS, // property_store_addr
            Number(escrowId),
          ],
        },
      };

      const result = await signAndSubmitTransaction(transaction);

      toast.dismiss(toastId);
      toast.success("Transaction confirmed successfully!");
      console.log("Buyer confirmation successful:", result);
      return true;
    } catch (error) {
      const errorMessage = error?.message || "Confirmation failed";
      toast.error(`Confirmation failed: ${errorMessage}`);
      console.error("Buyer confirmation error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sellerLandlordConfirms = async (escrowId) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return false;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Confirming transaction...");

      const transaction = {
        data: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::seller_landlord_confirms`,
          typeArguments: [],
          functionArguments: [
            MOVEMENT_CONTRACT_ADDRESS, // escrow_store_addr
            MOVEMENT_CONTRACT_ADDRESS, // property_store_addr
            Number(escrowId),
          ],
        },
      };

      const result = await signAndSubmitTransaction(transaction);

      toast.dismiss(toastId);
      toast.success("Transaction confirmed successfully!");
      console.log("Seller confirmation successful:", result);
      return true;
    } catch (error) {
      const errorMessage = error?.message || "Confirmation failed";
      toast.error(`Confirmation failed: ${errorMessage}`);
      console.error("Seller confirmation error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getConfirmationStatus = async (escrowId) => {
    try {
      if (!escrowId) {
        return {
          buyerConfirmed: false,
          sellerConfirmed: false,
        };
      }

      const status = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_confirmation_status`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, escrowId.toString()],
          typeArguments: [],
        },
      });

      return {
        buyerConfirmed: status[0],
        sellerConfirmed: status[1],
      };
    } catch (err) {
      console.error(`Error fetching confirmation status:`, err);
      throw err;
    }
  };

  const raiseDispute = async (escrowId, reason) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return false;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Raising dispute...");

      const transaction = {
        data: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::raise_dispute`,
          typeArguments: [],
          functionArguments: [
            MOVEMENT_CONTRACT_ADDRESS, // escrow_store_addr
            Number(escrowId),
            reason,
          ],
        },
      };

      const result = await signAndSubmitTransaction(transaction);

      toast.dismiss(toastId);
      toast.success("Dispute raised successfully!");
      console.log("Dispute raised:", result);
      return true;
    } catch (error) {
      const errorMessage = error?.message || "Failed to raise dispute";
      toast.error(`Dispute failed: ${errorMessage}`);
      console.error("Dispute error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isDisputeRaised = async (escrowId) => {
    try {
      const disputed = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::is_dispute_raised`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, escrowId.toString()],
          typeArguments: [],
        },
      });

      return disputed[0];
    } catch (err) {
      console.error(`Error checking dispute status:`, err);
      throw err;
    }
  };

  const checkRentalExpiration = async (escrowId) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return false;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Checking rental expiration...");

      const transaction = {
        data: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::check_rental_expiration`,
          typeArguments: [],
          functionArguments: [
            MOVEMENT_CONTRACT_ADDRESS, // escrow_store_addr
            MOVEMENT_CONTRACT_ADDRESS, // property_store_addr
            Number(escrowId),
          ],
        },
      };

      const result = await signAndSubmitTransaction(transaction);

      toast.dismiss(toastId);
      toast.success("Rental expiration processed successfully!");
      console.log("Rental expiration check successful:", result);
      return true;
    } catch (error) {
      const errorMessage =
        error?.message || "Failed to check rental expiration";
      toast.error(errorMessage);
      console.error("Rental expiration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getPropertyById,
    getPropertyStatus,
    getPropertyOwner,
    getPropertyPrice,
    getEscrowDetails,
    isEscrowResolved,
    depositToEscrow,
    buyerRenterConfirms,
    sellerLandlordConfirms,
    getConfirmationStatus,
    raiseDispute,
    isDisputeRaised,
    checkRentalExpiration,
  };
};
