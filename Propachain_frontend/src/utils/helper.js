import { PinataSDK } from "pinata";
import toast from "react-hot-toast";

/**
 * Normalize Aptos address to standard format
 * Converts addresses like 0x01, 0x001, etc. to 0x0000...0001
 * @param {string} address - The address to normalize
 * @returns {string} - Normalized address with proper padding
 */
export const normalizeAddress = (address) => {
  if (!address) return "";

  // Remove 0x prefix
  let addr = address.toLowerCase().replace(/^0x/, "");

  // Pad to 64 characters (32 bytes)
  addr = addr.padStart(64, "0");

  // Add back 0x prefix
  return `0x${addr}`;
};

/**
 * Compare two Aptos addresses for equality
 * @param {string} addr1 - First address
 * @param {string} addr2 - Second address
 * @returns {boolean} - True if addresses match
 */
export const addressesEqual = (addr1, addr2) => {
  if (!addr1 || !addr2) return false;
  return normalizeAddress(addr1) === normalizeAddress(addr2);
};

export const trimAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
});

export const uploadImageVideoFile = async (
  e,
  imageFile,
  videoFile,
  documentFile = ""
) => {
  e.preventDefault();
  let documentCid = null;
  try {
    const ImageUpload = await pinata.upload.public.file(imageFile);
    const imageCid = ImageUpload.cid;

    const videoUpload = await pinata.upload.public.file(videoFile);
    const videoCid = videoUpload.cid;

    if (documentFile) {
      const documentUpload = await pinata.upload.public.file(documentFile);
      documentCid = documentUpload.cid;
    }

    console.log("files uploaded successfully");
    toast.success("files uploaded successfully, creating transaction", {
      duration: 5000,
    });

    return {
      imageCid: imageCid,
      videoCid: videoCid,
      documentCid: documentCid,
    };
  } catch (e) {
    console.error(e);
    toast.error("failed to upload files", {
      duration: 5000,
    });
  }
};

const GATEWAY_URL = import.meta.env.VITE_PINATA_GATEWAY;

/**
 * Format raw blockchain property data for UI consumption
 * @param {Object} rawProperty - Raw property data from blockchain
 * @returns {Object} - Formatted property object
 */
export const formatPropertyData = (rawProperty) => {
  if (!rawProperty) return null;

  // Convert price from octas (10^8) to MOVE
  const priceInMove = parseInt(rawProperty.price || 0) / 100_000_000;

  // Format images from IPFS CIDs
  const images =
    rawProperty.images_cids && rawProperty.images_cids.length > 0
      ? rawProperty.images_cids.map(
          (cid) => `https://${GATEWAY_URL}/ipfs/${cid}`
        )
      : [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
        ];

  // Use property type as title
  const title = rawProperty.property_type || "Property";

  return {
    id: rawProperty.id,
    title,
    location: rawProperty.property_address || "Location not specified",
    description: rawProperty.description || "",
    price: priceInMove,
    image: images[0], // Primary image
    images, // All images
    status: rawProperty.status,
    owner: rawProperty.owner,
    propertyType: rawProperty.property_type || "Residential",
    listing_type: rawProperty.listing_type,
    monthlyRent: rawProperty.monthly_rent
      ? parseInt(rawProperty.monthly_rent.vec[0]) / 100_000_000
      : null,
    rentalPeriodMonths: rawProperty.rental_period_months || null,
    depositRequired: rawProperty.deposit_required
      ? parseInt(rawProperty.deposit_required.vec[0]) / 100_000_000
      : null,
    documentsCid:
      rawProperty.documents_cid?.vec?.[0] || rawProperty.documents_cid || null,
    videoCid: rawProperty.video_cid?.vec?.[0] || rawProperty.video_cid || null,
    escrowId: rawProperty.escrow_id?.vec?.[0] || null,
    createdAt: rawProperty.created_at,
    rentalStartDate: rawProperty.rental_start_date,
    rentalEndDate: rawProperty.rental_end_date,
  };
};
