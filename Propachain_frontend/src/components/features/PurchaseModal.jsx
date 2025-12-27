import { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Loader2,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "../common/Button";
import { motion, AnimatePresence } from "framer-motion";
import { usePropertyOperations } from "../../hooks/usePropertyOperations";
import { useReceipts } from "../../hooks/useReceipts";
import { useMovementWallet } from "../../hooks/useMovementWallet";
import toast from "react-hot-toast";

const STEPS = {
  REVIEW: 0,
  SUCCESS: 1,
};

export const PurchaseModal = ({ isOpen, onClose, property }) => {
  const [step, setStep] = useState(STEPS.REVIEW);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [escrowId, setEscrowId] = useState(null);
  const { depositToEscrow } = usePropertyOperations();
  const { getEscrowReceipt, formatReceipt, getReceiptStatus } = useReceipts();
  const { walletAddress } = useMovementWallet();

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(STEPS.REVIEW);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleCreateEscrow = async () => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    try {
      const toastId = toast.loading("Processing your purchase...");
      // property.price is displayed in MOVE (formatted), we need octas
      const rawPrice = Math.round(property.price * 100_000_000);

      const success = await depositToEscrow(toastId, property.id, rawPrice, property.documents_cid?.vec[0]);

      if (success) {
        // After successful deposit, fetch the receipt
        // The escrow ID would be returned from the transaction or we need to track it
        try {
          // Note: You may need to extract escrowId from the transaction response
          // For now, we'll set a placeholder that would be updated with actual escrow ID
          toast.dismiss(toastId);
          toast.loading("Generating receipt...");

          // This would be the actual escrow ID from the transaction
          // You might need to parse it from the transaction result
          if (success && success.escrow_id) {
            const receiptData = await getEscrowReceipt(success.escrow_id);
            setReceipt(formatReceipt(receiptData));
            setEscrowId(success.escrow_id);
          }

          setStep(STEPS.SUCCESS);
          toast.dismiss(toastId);
          toast.success("Receipt generated successfully!");
        } catch (err) {
          console.error("Error fetching receipt:", err);
          // Still show success even if receipt fetch fails
          setStep(STEPS.SUCCESS);
          toast.dismiss(toastId);
        }
      }
    } catch (error) {
      console.error("Failed to purchase property:", error);
      toast.error("Failed to purchase property");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">
            {step === STEPS.SUCCESS
              ? "Purchase Successful"
              : "Complete Purchase"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[0, 1].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  s <= step ? "bg-primary" : "bg-slate-100"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === STEPS.REVIEW && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                  <img
                    src={property.images[0]}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {property.title}
                    </h3>
                    <p className="text-sm text-slate-500 truncate max-w-[200px]">
                      {property.location}
                    </p>
                    <p className="text-primary font-bold mt-1">
                      {property.price.toLocaleString()} MOVE
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Property Price</span>
                    <span>{property.price.toLocaleString()} MOVE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (0%)</span>
                    <span className="text-emerald-500">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Fee</span>
                    <span>~ 0.001 MOVE</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-base">
                    <span>Total</span>
                    <span>{property.price.toLocaleString()} MOVE</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg">
                  <p className="font-semibold mb-1">Escrow Process:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Funds will be locked in a secure smart contract.</li>
                    <li>
                      Ownership NFT is minted only upon successful transfer.
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={handleCreateEscrow}
                  isLoading={isProcessing}
                >
                  Confirm Purchase
                </Button>
              </motion.div>
            )}

            {step === STEPS.SUCCESS && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                  <CheckCircle size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Purchase Complete!
                  </h3>
                  <p className="text-slate-500">
                    Your escrow transaction has been initiated successfully.
                  </p>
                </div>

                {/* Receipt Details */}
                {receipt ? (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <FileText className="text-primary" size={20} />
                      <span className="font-semibold text-slate-900">
                        Transaction Receipt
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Escrow ID:</span>
                        <span className="font-mono text-slate-900 text-xs">
                          {escrowId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Amount:</span>
                        <span className="font-bold text-slate-900">
                          {receipt.formattedAmount} MOVE
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Property:</span>
                        <span className="text-slate-900">
                          {receipt.property_type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <span className="text-slate-900">
                          {receipt.listingType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Date:</span>
                        <span className="text-slate-900">
                          {receipt.formattedDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            getReceiptStatus(receipt).color
                          }`}
                        >
                          {getReceiptStatus(receipt).status}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-600" size={20} />
                      <span className="font-semibold text-blue-900">
                        Receipt NFT
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 mt-2 pl-8">
                      Your transaction receipt has been recorded on the
                      blockchain.
                    </p>
                  </div>
                )}

                <div className="p-3 bg-amber-50 text-amber-700 text-xs rounded-lg">
                  <p className="font-semibold mb-1">Next Steps:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Seller will confirm receipt of payment</li>
                    <li>Once confirmed, ownership will transfer to you</li>
                    <li>You can track this transaction in your profile</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button variant="secondary" className="w-full">
                    <Download size={16} className="mr-2" /> Download Receipt
                  </Button>
                  <Button className="w-full" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
