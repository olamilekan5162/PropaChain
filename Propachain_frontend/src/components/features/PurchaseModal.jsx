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
  const [escrowId, setEscrowId] = useState(null);
  const { depositToEscrow } = usePropertyOperations();
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

      const success = await depositToEscrow(
        toastId,
        property.id,
        rawPrice,
        property.documents_cid?.vec[0]
      );

      if (success) {
        // Transaction successful - escrow created and receipts minted automatically
        toast.dismiss(toastId);
        toast.success("Purchase successful!");

        // Extract escrow ID from success response if available
        if (success && success.escrow_id) {
          setEscrowId(success.escrow_id);
        }

        setStep(STEPS.SUCCESS);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 flex justify-between items-center bg-gradient-to-r from-teal-50 to-teal-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {step === STEPS.SUCCESS
                ? "Purchase Confirmed"
                : "Complete Purchase"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-6">
            {[0, 1].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-teal-700" : "bg-zinc-200"
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
                className="space-y-5"
              >
                {/* Property Card */}
                <div className="flex gap-4 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <img
                    src={property.images[0]}
                    alt=""
                    className="w-24 h-24 object-cover rounded-lg shrink-0"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-zinc-900 text-base mb-1 truncate">
                      {property.title}
                    </h3>
                    <p className="text-sm text-zinc-600 truncate">
                      {property.location}
                    </p>
                    <p className="text-teal-700 font-bold text-lg mt-2">
                      {property.price.toLocaleString()} MOVE
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4 space-y-3">
                  <h4 className="font-semibold text-zinc-900 text-sm">
                    Price Breakdown
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-zinc-700">
                      <span>Property Price</span>
                      <span className="font-medium">
                        {property.price.toLocaleString()} MOVE
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-700">
                      <span>Platform Fee</span>
                      <span className="font-medium text-teal-700">
                        FREE (0%)
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-700">
                      <span>Network Fee (est.)</span>
                      <span className="font-medium">~0.001 MOVE</span>
                    </div>
                    <div className="pt-3 border-t border-zinc-300 flex justify-between font-semibold text-zinc-900">
                      <span>Total Amount</span>
                      <span className="text-teal-700">
                        {property.price.toLocaleString()} MOVE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Escrow Info */}
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="flex gap-3 mb-3">
                    <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center shrink-0">
                      <ShieldCheck className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-teal-900 text-sm">
                        Secure Escrow Protection
                      </p>
                    </div>
                  </div>
                  <ul className="text-xs text-teal-800 space-y-1.5 pl-11">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="mt-0.5 shrink-0" />
                      <span>Funds locked in secure smart contract</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="mt-0.5 shrink-0" />
                      <span>Ownership NFT minted upon confirmation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="mt-0.5 shrink-0" />
                      <span>Both parties must confirm to complete</span>
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full bg-teal-700 hover:bg-teal-800"
                  onClick={handleCreateEscrow}
                  isLoading={isProcessing}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={18} />
                      Processing Transaction...
                    </>
                  ) : (
                    <>
                      Confirm Purchase
                      <ArrowRight className="ml-2" size={18} />
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {step === STEPS.SUCCESS && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-5"
              >
                {/* Success Icon */}
                <div className="w-20 h-20 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-teal-700/20">
                  <CheckCircle size={40} strokeWidth={2.5} />
                </div>

                {/* Success Message */}
                <div>
                  <h3 className="text-2xl font-semibold text-zinc-900 mb-2">
                    Purchase Successful!
                  </h3>
                  <p className="text-zinc-600 leading-relaxed">
                    Your escrow transaction has been initiated successfully.
                    <br />
                    Both parties will need to confirm to complete the transfer.
                  </p>
                </div>

                {/* Transaction Details */}
                <div className="bg-zinc-50 p-5 rounded-lg border border-zinc-200 text-left">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-200">
                    <div className="w-9 h-9 bg-teal-700 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="text-white" size={18} />
                    </div>
                    <span className="font-semibold text-zinc-900">
                      Escrow Created
                    </span>
                  </div>

                  <div className="space-y-2.5 text-sm">
                    {escrowId && (
                      <div className="flex justify-between">
                        <span className="text-zinc-600">Escrow ID</span>
                        <span className="font-mono text-zinc-900 text-xs bg-zinc-100 px-2 py-1 rounded">
                          #{escrowId}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Amount</span>
                      <span className="font-semibold text-teal-700">
                        {property.price.toLocaleString()} MOVE
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Property</span>
                      <span className="text-zinc-900 font-medium">
                        {property.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Type</span>
                      <span className="text-zinc-900 font-medium">
                        {property.listingType === 1 ? "Sale" : "Rent"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Status</span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700">
                        In Escrow
                      </span>
                    </div>
                  </div>
                </div>

                {/* Receipt NFT Info */}
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
                      <FileText className="text-white" size={16} />
                    </div>
                    <span className="font-semibold text-teal-900">
                      Receipt NFT Minted
                    </span>
                  </div>
                  <p className="text-xs text-teal-700 leading-relaxed pl-11">
                    Your transaction receipt NFT has been automatically minted
                    and is available in your profile.
                  </p>
                </div>

                {/* Next Steps */}
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-left">
                  <p className="font-semibold text-amber-900 text-sm mb-2">
                    Next Steps
                  </p>
                  <ul className="text-xs text-amber-800 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <ArrowRight size={14} className="mt-0.5 shrink-0" />
                      <span>Seller will confirm receipt of payment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight size={14} className="mt-0.5 shrink-0" />
                      <span>Once confirmed, ownership transfers to you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight size={14} className="mt-0.5 shrink-0" />
                      <span>
                        Track transaction status in your Transactions page
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <Button
                    className="w-full bg-teal-700 hover:bg-teal-800"
                    onClick={onClose}
                  >
                    Done
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
