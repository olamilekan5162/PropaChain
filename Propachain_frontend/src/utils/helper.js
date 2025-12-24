import { PinataSDK } from "pinata";
import toast from "react-hot-toast";

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
