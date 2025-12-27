import { useMovementWallet } from "./useMovementWallet";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MOVEMENT_CONTRACT_ADDRESS } from "../config/constants";

export const usePropertyUpload = () => {
  const navigate = useNavigate();
  const { isConnected, signAndSubmitTransaction, walletAddress } =
    useMovementWallet();

  const uploadProperty = async (
    toastId,
    listingType,
    propertyAddress,
    propertyType,
    description,
    price,
    imagesCids,
    videoCid,
    documentsCid = null,
    monthlyRent = null,
    rentalPeriodMonths = null,
    depositRequired = null,
    registryAddr
  ) => {
    console.log("uploadProperty called with:", {
      isConnected,
      walletAddress,
      listingType,
      price,
    });

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
      // Validate required fields
      if (
        listingType === null ||
        listingType === undefined ||
        !propertyAddress ||
        !propertyType ||
        !description ||
        price === null ||
        price === undefined
      ) {
        toast.error("Missing required property fields", { id: toastId });
        return false;
      }

      if (!imagesCids || imagesCids.length === 0) {
        toast.error("At least one image is required", { id: toastId });
        return false;
      }

      if (!videoCid) {
        toast.error("Video is required", { id: toastId });
        return false;
      }

      // Validate listing type
      const LISTING_TYPE_SALE = 1;
      const LISTING_TYPE_RENT = 2;

      if (
        listingType !== LISTING_TYPE_SALE &&
        listingType !== LISTING_TYPE_RENT
      ) {
        toast.error("Invalid listing type", { id: toastId });
        return false;
      }

      // Convert price to octas (Movement uses 8 decimals)
      const priceInOctas = Math.floor(price * 100_000_000);

      // Convert optional rent parameters
      const monthlyRentInOctas = monthlyRent
        ? Math.floor(monthlyRent * 100_000_000)
        : 0;

      console.log("Transaction arguments:", {
        listingType,
        price: priceInOctas,
        propertyAddress,
        propertyType,
        description,
        imagesCids,
        videoCid,
        documentsCid,
        monthlyRent: monthlyRentInOctas,
        rentalPeriodMonths,
        depositRequired,
      });

      const transaction = {
        data: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::list_property`,
          typeArguments: [],
          functionArguments: [
            MOVEMENT_CONTRACT_ADDRESS, // registry address
            listingType, // u8
            priceInOctas, // u64 - convert to string
            propertyAddress, // String
            propertyType, // String
            description, // String
            imagesCids, // vector<String>
            videoCid, // String
            // Option<String> for documents_cid
            documentsCid ? documentsCid : "",
            // Option<u64> for monthly_rent
            monthlyRent ? monthlyRentInOctas : 0,
            // Option<u64> for rental_period_months
            rentalPeriodMonths ? rentalPeriodMonths : 0,
            // Option<u64> for deposit_required
            depositRequired ? Math.floor(depositRequired * 100_000_000) : 0,
          ],
        },
      };

      const result = await signAndSubmitTransaction(transaction);

      toast.dismiss(toastId);
      toast.success("Property listed successfully!");
      console.log("Upload successful:", result);

      // Navigate to profile after successful upload
      setTimeout(() => navigate(`/profile`), 1500);

      return true;
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage = error?.message || "An unexpected error occurred";
      toast.error(`Property listing failed: ${errorMessage}`);
      console.error("Upload error:", error);
      return false;
    }
  };

  const updateProperty = async (toastId, propertyId, updates, registryAddr) => {
    if (!isConnected) {
      toast.error("Please connect your wallet", { id: toastId });
      return false;
    }

    try {
      // Note: Smart contract would need update functions similar to updateMusic
      // For now, we'll provide the structure but you'll need to implement
      // the update functions in the smart contract (e.g., update_property_metadata, etc)

      const transactions = [];

      // Update basic metadata if provided
      if (
        updates.propertyAddress ||
        updates.propertyType ||
        updates.description
      ) {
        // This would require an update_property_metadata function in the contract
        // transactions.push({...});
      }

      // Update images/video if provided
      if (updates.imagesCids || updates.videoCid) {
        // This would require an update_property_media function in the contract
        // transactions.push({...});
      }

      // Update price if provided
      if (updates.price) {
        // This would require an update_property_price function in the contract
        // transactions.push({...});
      }

      if (transactions.length === 0) {
        toast.error("No updates provided", { id: toastId });
        return false;
      }

      // Execute all transactions
      for (const tx of transactions) {
        await signAndSubmitTransaction(tx);
      }

      toast.dismiss(toastId);
      toast.success("Property updated successfully!");

      return true;
    } catch (error) {
      toast.dismiss(toastId);
      const errorMessage = error?.message || "An unexpected error occurred";
      toast.error(`Update failed: ${errorMessage}`);
      console.error("Update error:", error);
      return false;
    }
  };

  return { uploadProperty, updateProperty };
};
