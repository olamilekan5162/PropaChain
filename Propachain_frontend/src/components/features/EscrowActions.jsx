import { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  FileText,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Button } from "../common/Button";
import { usePropertyOperations } from "../../hooks/usePropertyOperations";
import { useMovementWallet } from "../../hooks/useMovementWallet";
import { addressesEqual } from "../../utils/helper";
import toast from "react-hot-toast";

export const EscrowActions = ({ property, escrowId, onStatusChange }) => {
  const [confirmationStatus, setConfirmationStatus] = useState({
    buyerConfirmed: false,
    sellerConfirmed: false,
  });
  const [isDisputed, setIsDisputed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [disputeReason, setDisputeReason] = useState("");
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  const {
    buyerRenterConfirms,
    sellerLandlordConfirms,
    getConfirmationStatus,
    raiseDispute,
    isDisputeRaised,
    getEscrowDetails,
  } = usePropertyOperations();

  const { walletAddress } = useMovementWallet();

  const [escrowDetails, setEscrowDetails] = useState(null);

  useEffect(() => {
    loadEscrowStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escrowId]);

  const loadEscrowStatus = async () => {
    if (!escrowId) return;

    try {
      setLoading(true);

      // Get escrow details to determine buyer/seller
      const details = await getEscrowDetails(escrowId);
      setEscrowDetails(details);

      // Get confirmation status
      const status = await getConfirmationStatus(escrowId);
      setConfirmationStatus(status);

      // Check dispute status
      const disputed = await isDisputeRaised(escrowId);
      setIsDisputed(disputed);
    } catch (error) {
      console.error("Error loading escrow status:", error);
      toast.error("Failed to load escrow status");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyerConfirm = async () => {
    const success = await buyerRenterConfirms(escrowId);
    if (success) {
      await loadEscrowStatus();
      if (onStatusChange) onStatusChange();
    }
  };

  const handleSellerConfirm = async () => {
    const success = await sellerLandlordConfirms(escrowId);
    if (success) {
      await loadEscrowStatus();
      if (onStatusChange) onStatusChange();
    }
  };

  const handleRaiseDispute = async () => {
    if (!disputeReason.trim()) {
      toast.error("Please provide a reason for the dispute");
      return;
    }

    const success = await raiseDispute(escrowId, disputeReason);
    if (success) {
      setShowDisputeModal(false);
      setDisputeReason("");
      await loadEscrowStatus();
      if (onStatusChange) onStatusChange();
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-zinc-200">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!escrowDetails) {
    return null;
  }

  const isBuyer = addressesEqual(walletAddress, escrowDetails.buyer_renter);
  const isSeller = addressesEqual(walletAddress, escrowDetails.seller_landlord);

  const bothConfirmed =
    confirmationStatus.buyerConfirmed && confirmationStatus.sellerConfirmed;

  return (
    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-teal-50/50 px-6 py-5 border-b border-teal-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-teal-700 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 text-lg">
                Escrow Protection
              </h3>
              <p className="text-sm text-zinc-600">Transaction #{escrowId}</p>
            </div>
          </div>

          {isDisputed && (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
              <AlertTriangle size={16} />
              Disputed
            </span>
          )}

          {bothConfirmed && !isDisputed && (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold">
              <CheckCircle size={16} />
              Completed
            </span>
          )}

          {!bothConfirmed && !isDisputed && (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
              <Clock size={16} />
              In Progress
            </span>
          )}
        </div>
      </div>

      {/* Confirmation Status */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          {/* Buyer/Renter Confirmation */}
          <div className="group relative overflow-hidden bg-zinc-50 hover:bg-zinc-100 transition-colors rounded-lg border border-zinc-200">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                    confirmationStatus.buyerConfirmed
                      ? "bg-teal-700 text-white shadow-lg shadow-teal-700/30"
                      : "bg-zinc-200 text-zinc-500"
                  }`}
                >
                  {confirmationStatus.buyerConfirmed ? (
                    <CheckCircle size={22} strokeWidth={2.5} />
                  ) : (
                    <Clock size={22} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 text-base">
                    {property?.listingType === 1 ? "Buyer" : "Renter"}{" "}
                    Confirmation
                  </p>
                  <p className="text-sm text-zinc-600 mt-0.5">
                    {confirmationStatus.buyerConfirmed
                      ? "Confirmed successfully"
                      : "Awaiting confirmation"}
                  </p>
                </div>
              </div>
              {isBuyer && !confirmationStatus.buyerConfirmed && !isDisputed && (
                <Button
                  size="sm"
                  onClick={handleBuyerConfirm}
                  className="bg-teal-700 hover:bg-teal-800"
                >
                  <CheckCircle size={16} className="mr-1.5" />
                  Confirm
                </Button>
              )}
            </div>
          </div>

          {/* Seller/Landlord Confirmation */}
          <div className="group relative overflow-hidden bg-zinc-50 hover:bg-zinc-100 transition-colors rounded-lg border border-zinc-200">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                    confirmationStatus.sellerConfirmed
                      ? "bg-teal-700 text-white shadow-lg shadow-teal-700/30"
                      : "bg-zinc-200 text-zinc-500"
                  }`}
                >
                  {confirmationStatus.sellerConfirmed ? (
                    <CheckCircle size={22} strokeWidth={2.5} />
                  ) : (
                    <Clock size={22} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 text-base">
                    {property?.listingType === 1 ? "Seller" : "Landlord"}{" "}
                    Confirmation
                  </p>
                  <p className="text-sm text-zinc-600 mt-0.5">
                    {confirmationStatus.sellerConfirmed
                      ? "Confirmed successfully"
                      : "Awaiting confirmation"}
                  </p>
                </div>
              </div>
              {isSeller &&
                !confirmationStatus.sellerConfirmed &&
                !isDisputed && (
                  <Button
                    size="sm"
                    onClick={handleSellerConfirm}
                    className="bg-teal-700 hover:bg-teal-800"
                  >
                    <CheckCircle size={16} className="mr-1.5" />
                    Confirm
                  </Button>
                )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        {!bothConfirmed && !isDisputed && (
          <div className="p-5 bg-teal-50 rounded-lg border border-teal-200">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="text-white" size={18} />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-teal-900 mb-1.5">
                  Escrow Protection Active
                </p>
                <p className="text-teal-700 leading-relaxed">
                  Both parties must confirm to release funds. Once both
                  confirmations are received, the transaction will be completed
                  automatically and ownership will transfer.
                </p>
              </div>
            </div>
          </div>
        )}

        {bothConfirmed && (
          <div className="p-5 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle className="text-white" size={18} />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-emerald-900 mb-1.5">
                  Transaction Completed Successfully
                </p>
                <p className="text-emerald-700 leading-relaxed">
                  Both parties have confirmed. Funds have been released and
                  ownership has been transferred successfully.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dispute Button */}
        {!isDisputed && !bothConfirmed && (isBuyer || isSeller) && (
          <div className="pt-4 border-t border-zinc-200">
            <Button
              variant="ghost"
              className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
              onClick={() => setShowDisputeModal(true)}
            >
              <AlertTriangle size={18} className="mr-2" />
              Raise a Dispute
            </Button>
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-red-600" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    Raise a Dispute
                  </h3>
                  <p className="text-sm text-zinc-600 mt-0.5">
                    Provide details about the issue with this transaction
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Dispute Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Please describe the issue in detail. Include relevant facts, dates, and any supporting information..."
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 resize-none text-zinc-900 placeholder:text-zinc-400"
                rows={6}
              />

              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex gap-3">
                  <MessageSquare
                    className="text-amber-600 shrink-0 mt-0.5"
                    size={18}
                  />
                  <div className="text-xs text-amber-800 leading-relaxed">
                    <strong className="font-semibold">Important:</strong> Once a
                    dispute is raised, an admin will review your case
                    thoroughly. The transaction will be frozen and both parties
                    will be notified. Please provide accurate and complete
                    information to expedite the resolution process.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowDisputeModal(false);
                  setDisputeReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleRaiseDispute}
                disabled={!disputeReason.trim()}
              >
                <AlertTriangle size={16} className="mr-2" />
                Submit Dispute
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
