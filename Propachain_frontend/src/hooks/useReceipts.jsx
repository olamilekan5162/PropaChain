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

      // Query account resources to find PropertyReceipt NFTs
      const resources = await aptos.getAccountResources({
        accountAddress: walletAddress,
        resouresourceType: `${CONTRACT_ADDRESS}::propachain::PropertyReceipt`,
      });

      // Filter for PropertyReceipt resources
      // PropertyReceipt NFTs are stored with the resource type:
      // {MOVEMENT_CONTRACT_ADDRESS}::propachain::PropertyReceipt
      const receiptResourceType = `${CONTRACT_ADDRESS}::propachain::PropertyReceipt`;

      resources.forEach((resource) => {
        if (resource.type === receiptResourceType) {
          const receipt = resource.data;
          const formattedReceipt = formatReceipt(receipt);
          userReceipts.push(formattedReceipt);
        }
      });

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
      escrow_id: receipt.id, // Map NFT id to escrow_id for UI compatibility
      formattedAmount: (receipt.amount_paid / 100_000_000).toFixed(2),
      formattedDate: new Date(receipt.timestamp * 1000).toLocaleDateString(),
      listingType: receipt.listing_type === 1 ? "Sale" : "Rent",
      status: "Completed", // NFT receipts are only created after completion
    };
  };

  return {
    receipts,
    loading,
    error,
    getUserReceipts,
    generateReceiptAfterDeposit,
    formatReceipt,
  };
};
