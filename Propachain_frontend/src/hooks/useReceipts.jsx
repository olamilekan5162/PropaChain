import { useState } from "react";
import { useMovementWallet } from "./useMovementWallet";
import { aptos } from "../config/movement";
import toast from "react-hot-toast";
import { CONTRACT_ADDRESS } from "../config/movement";

export const useReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { walletAddress } = useMovementWallet();

  /**
   * Get all receipts for the current user (as buyer or seller)
   */
  const getUserReceipts = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!walletAddress) {
        const err = "Wallet not connected";
        setError(err);
        throw new Error(err);
      }

      const userReceipts = [];

      // Get all receipt IDs for the user using the view function
      const receiptIds = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::propachain::get_user_receipts`,
          functionArguments: [walletAddress],
          typeArguments: [],
        },
      });

      console.log("User receipt IDs:", receiptIds);

      // If user has receipt IDs, fetch each receipt
      if (receiptIds && receiptIds[0] && receiptIds[0].length > 0) {
        for (const receiptId of receiptIds[0]) {
          try {
            const receiptData = await getReceipt(receiptId);
            if (receiptData) {
              userReceipts.push(receiptData);
            }
          } catch (err) {
            console.error(`Error fetching receipt ${receiptId}:`, err);
            // Continue with other receipts even if one fails
          }
        }
      }

      // Sort receipts by timestamp (newest first)
      userReceipts.sort((a, b) => b.timestamp - a.timestamp);

      setReceipts(userReceipts);
      return userReceipts;
    } catch (err) {
      const errorMessage = `Failed to fetch user receipts: ${err.message}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate a receipt after successful escrow deposit
   * Called immediately after deposit_to_escrow transaction succeeds
   * This will trigger a refetch of getUserReceipts
   */
  const generateReceiptAfterDeposit = async () => {
    try {
      // Simply refetch receipts - the NFT will be in the user's account
      await getUserReceipts();
    } catch (err) {
      const errorMessage = "Failed to fetch receipt";
      console.error(errorMessage, err);
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Format receipt for display
   * Takes PropertyReceipt NFT data and formats it for UI
   */
  const formatReceipt = (receipt) => {
    // PropertyReceipt NFT structure from smart contract:
    // id, listing_type, timestamp, property_id, property_address, property_type,
    // buyer_renter_address, seller_landlord_address, amount_paid,
    // rental_start_date, rental_end_date, rental_period_months, monthly_rent, metadata_uri

    return {
      ...receipt,
      id: receipt.id,
      formattedAmount: (parseInt(receipt.amount_paid) / 100_000_000).toFixed(2),
      formattedDate: new Date(
        parseInt(receipt.timestamp) * 1000
      ).toLocaleDateString(),
      listingType: parseInt(receipt.listing_type) === 1 ? "Sale" : "Rent",
    };
  };

  /**
   * Get receipt status - Receipts are NFTs, they don't have confirmations
   * Status is based on the receipt data itself
   */
  const getReceiptStatus = (receipt) => {
    // Receipt NFTs are minted when transaction is created
    // They represent proof of transaction
    return {
      status: "Minted",
      color: "bg-teal-100 text-teal-800",
    };
  };

  /**
   * Get a single receipt by ID
   */
  const getReceipt = async (receiptId) => {
    try {
      const receiptData = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::propachain::get_receipt`,
          functionArguments: [CONTRACT_ADDRESS, receiptId.toString()],
          typeArguments: [],
        },
      });

      if (receiptData && receiptData[0]) {
        return formatReceipt(receiptData[0]);
      }
      return null;
    } catch (err) {
      console.error(`Error fetching receipt ${receiptId}:`, err);
      throw err;
    }
  };

  return {
    receipts,
    loading,
    error,
    getUserReceipts,
    generateReceiptAfterDeposit,
    formatReceipt,
    getReceiptStatus,
    getReceipt,
  };
};
