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
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!escrowDetails) {
    return null;
  }

  const isBuyer =
    walletAddress?.toLowerCase() === escrowDetails.buyer_renter?.toLowerCase();
  const isSeller =
    walletAddress?.toLowerCase() ===
    escrowDetails.seller_landlord?.toLowerCase();

  const bothConfirmed =
    confirmationStatus.buyerConfirmed && confirmationStatus.sellerConfirmed;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Escrow Status</h3>
              <p className="text-sm text-slate-500">ID: #{escrowId}</p>
            </div>
          </div>

          {isDisputed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              <AlertTriangle size={14} />
              Disputed
            </span>
          )}

          {bothConfirmed && !isDisputed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <CheckCircle size={14} />
              Completed
            </span>
          )}

          {!bothConfirmed && !isDisputed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              <Clock size={14} />
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Confirmation Status */}
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  confirmationStatus.buyerConfirmed
                    ? "bg-green-100 text-green-600"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {confirmationStatus.buyerConfirmed ? (
                  <CheckCircle size={16} />
                ) : (
                  <Clock size={16} />
                )}
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {property?.listingType === 1 ? "Buyer" : "Renter"}{" "}
                  Confirmation
                </p>
                <p className="text-xs text-slate-500">
                  {confirmationStatus.buyerConfirmed
                    ? "Confirmed"
                    : "Awaiting confirmation"}
                </p>
              </div>
            </div>
            {isBuyer && !confirmationStatus.buyerConfirmed && !isDisputed && (
              <Button size="sm" onClick={handleBuyerConfirm}>
                Confirm
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  confirmationStatus.sellerConfirmed
                    ? "bg-green-100 text-green-600"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {confirmationStatus.sellerConfirmed ? (
                  <CheckCircle size={16} />
                ) : (
                  <Clock size={16} />
                )}
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {property?.listingType === 1 ? "Seller" : "Landlord"}{" "}
                  Confirmation
                </p>
                <p className="text-xs text-slate-500">
                  {confirmationStatus.sellerConfirmed
                    ? "Confirmed"
                    : "Awaiting confirmation"}
                </p>
              </div>
            </div>
            {isSeller && !confirmationStatus.sellerConfirmed && !isDisputed && (
              <Button size="sm" onClick={handleSellerConfirm}>
                Confirm
              </Button>
            )}
          </div>
        </div>

        {/* Info Box */}
        {!bothConfirmed && !isDisputed && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex gap-3">
              <FileText
                className="text-blue-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-1">
                  Escrow Protection Active
                </p>
                <p className="text-blue-700">
                  Both parties must confirm to release funds. Once both parties
                  confirm, the transaction will be completed automatically.
                </p>
              </div>
            </div>
          </div>
        )}

        {bothConfirmed && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="flex gap-3">
              <CheckCircle
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <div className="text-sm">
                <p className="font-semibold text-green-900 mb-1">
                  Transaction Completed
                </p>
                <p className="text-green-700">
                  Both parties have confirmed. Funds have been released and
                  ownership has been transferred.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dispute Button */}
        {!isDisputed && !bothConfirmed && (isBuyer || isSeller) && (
          <Button
            variant="ghost"
            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setShowDisputeModal(true)}
          >
            <AlertTriangle size={16} className="mr-2" />
            Raise Dispute
          </Button>
        )}
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Raise a Dispute
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Please provide a detailed reason for raising this dispute.
              </p>
            </div>

            <div className="p-6">
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Describe the issue with this transaction..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                rows={5}
              />

              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> Once a dispute is raised, an admin will
                  review the case. The transaction will be frozen until the
                  dispute is resolved.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
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
              >
                Submit Dispute
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
