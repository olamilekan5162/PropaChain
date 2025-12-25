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

  const depositToEscrow = async (toastId, propertyId, amount) => {

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
            Number(propertyId),
            amountInOctas
          ],
        },
      };

      const result = await signAndSubmitTransaction(transaction);
      
      toast.dismiss(toastId);
      toast.success("Property Processed successfully!");
      console.log("Escrow deposit successful:", result);

      // Navigate to profile after successful upload
      setTimeout(() => navigate(`/app/property/${propertyId}`), 1500);

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

  return {
    loading,
    getPropertyById,
    getPropertyStatus,
    getPropertyOwner,
    getPropertyPrice,
    depositToEscrow,
  };
};
