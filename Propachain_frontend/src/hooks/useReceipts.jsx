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

      // If user has receipt IDs, fetch each receipt with escrow details
      if (receiptIds && receiptIds[0] && receiptIds[0].length > 0) {
        for (const receiptId of receiptIds[0]) {
          try {
            const receiptData = await getReceiptWithEscrow(receiptId);
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
      escrow_id: receipt.id, // Map NFT id to escrow_id for UI compatibility
      formattedAmount: (parseInt(receipt.amount_paid) / 100_000_000).toFixed(2),
      formattedDate: new Date(
        parseInt(receipt.timestamp) * 1000
      ).toLocaleDateString(),
      listingType: parseInt(receipt.listing_type) === 1 ? "Sale" : "Rent",
    };
  };

  /**
   * Get receipt status with color coding
   */
  const getReceiptStatus = (receipt) => {
    // Determine status based on confirmations and dispute
    if (receipt.is_disputed) {
      return {
        status: "Dispute Raised",
        color: "bg-red-100 text-red-800",
      };
    }

    if (receipt.buyer_confirmed && receipt.seller_confirmed) {
      return {
        status: "Completed",
        color: "bg-green-100 text-green-800",
      };
    }

    if (receipt.buyer_confirmed || receipt.seller_confirmed) {
      return {
        status: "Partially Confirmed",
        color: "bg-blue-100 text-blue-800",
      };
    }

    return {
      status: "Awaiting Confirmation",
      color: "bg-yellow-100 text-yellow-800",
    };
  };

  /**
   * Get receipt with escrow details
   */
  const getReceiptWithEscrow = async (receiptId) => {
    try {
      const receiptData = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::propachain::get_receipt`,
          functionArguments: [CONTRACT_ADDRESS, receiptId.toString()],
          typeArguments: [],
        },
      });

      if (receiptData && receiptData[0]) {
        const receipt = receiptData[0];

        // Get property details to find escrow ID
        const propertyData = await aptos.view({
          payload: {
            function: `${CONTRACT_ADDRESS}::propachain::get_property`,
            functionArguments: [
              CONTRACT_ADDRESS,
              receipt.property_id.toString(),
            ],
            typeArguments: [],
          },
        });

        console.log("PropData:", propertyData);

        const escrowId = propertyData[0]?.escrow_id?.vec?.[0];

        // If there's an escrow, get confirmation status
        let confirmationStatus = {
          buyerConfirmed: false,
          sellerConfirmed: false,
        };
        let isDisputed = false;

        if (escrowId) {
          try {
            const status = await aptos.view({
              payload: {
                function: `${CONTRACT_ADDRESS}::propachain::get_confirmation_status`,
                functionArguments: [CONTRACT_ADDRESS, escrowId.toString()],
                typeArguments: [],
              },
            });
            confirmationStatus = {
              buyerConfirmed: status[0],
              sellerConfirmed: status[1],
            };

            const disputeStatus = await aptos.view({
              payload: {
                function: `${CONTRACT_ADDRESS}::propachain::is_dispute_raised`,
                functionArguments: [CONTRACT_ADDRESS, escrowId.toString()],
                typeArguments: [],
              },
            });
            isDisputed = disputeStatus[0];
          } catch (err) {
            console.error("Error fetching escrow status:", err);
          }
        }

        return {
          ...formatReceipt(receipt),
          escrowId,
          buyer_confirmed: confirmationStatus.buyerConfirmed,
          seller_confirmed: confirmationStatus.sellerConfirmed,
          is_disputed: isDisputed,
        };
      }
    } catch (err) {
      console.error(`Error fetching receipt with escrow:`, err);
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
    getReceiptWithEscrow,
  };
};
