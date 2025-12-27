import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Building2,
  Loader2,
  FileX,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { useMovementWallet } from "../hooks/useMovementWallet";
import { useReceipts } from "../hooks/useReceipts";
import { useFetchProperties } from "../hooks/useFetchProperties";
import { usePropertyOperations } from "../hooks/usePropertyOperations";
import toast from "react-hot-toast";

export default function Transactions() {
  const navigate = useNavigate();
  const { walletAddress } = useMovementWallet();
  const { getUserReceipts } = useReceipts();
  const { fetchAllProperties } = useFetchProperties();
  const {
    getConfirmationStatus,
    buyerRenterConfirms,
    sellerLandlordConfirms,
    isDisputeRaised,
  } = usePropertyOperations();

  const [activeTab, setActiveTab] = useState("all"); // all, pending, completed
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    if (walletAddress) {
      loadTransactions();
    }
  }, [walletAddress]);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      // Get user's receipts
      const receipts = await getUserReceipts(walletAddress);

      console.log("receipts", receipts);

      // Get all properties to match with receipts
      const allProperties = await fetchAllProperties();

      console.log("All prop:", allProperties);

      // Enrich receipts with property data and confirmation status
      const enrichedTransactions = await Promise.all(
        receipts.map(async (receipt) => {
          const property = allProperties.find(
            (p) => p.id === receipt.property_id
          );
          const confirmationStatus = await getConfirmationStatus(
            receipt.escrowId
          );
          const hasDispute = await isDisputeRaised(receipt.escrowId);

          return {
            ...receipt,
            property,
            confirmationStatus,
            hasDispute,
          };
        })
      );

      console.log(enrichedTransactions);

      setTransactions(enrichedTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (transaction) => {
    const isUserBuyer = transaction.buyerAddress === walletAddress;

    try {
      setConfirmingId(transaction.escrowId);

      if (isUserBuyer) {
        await buyerRenterConfirms(transaction.escrowId);
        toast.success("Transaction confirmed successfully!");
      } else {
        await sellerLandlordConfirms(transaction.escrowId);
        toast.success("Transaction confirmed successfully!");
      }

      // Reload transactions to update status
      await loadTransactions();
    } catch (error) {
      console.error("Error confirming transaction:", error);
      toast.error("Failed to confirm transaction");
    } finally {
      setConfirmingId(null);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === "pending") {
      return (
        tx.escrowStatus === "IN_ESCROW" &&
        (!tx.confirmationStatus?.buyer || !tx.confirmationStatus?.seller)
      );
    }
    if (activeTab === "completed") {
      return (
        tx.confirmationStatus?.buyer &&
        tx.confirmationStatus?.seller &&
        !tx.hasDispute
      );
    }
    return true; // all
  });

  const TransactionCard = ({ transaction }) => {
    const isUserBuyer = transaction.buyerAddress === walletAddress;
    const needsAction =
      (isUserBuyer && !transaction.confirmationStatus?.buyer) ||
      (!isUserBuyer && !transaction.confirmationStatus?.seller);
    const isConfirming = confirmingId === transaction.escrowId;

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
        <div className="flex items-start gap-4">
          {/* Property Image */}
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
            {transaction.property?.image ? (
              <img
                src={transaction.property.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 size={32} className="text-slate-400" />
              </div>
            )}
          </div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  {transaction.property?.property_type ||
                    `Property #${transaction.propertyId}`}
                </h3>
                <p className="text-sm text-slate-500">
                  {transaction.property?.property_address ||
                    "Location unavailable"}
                </p>
              </div>
              {transaction.isDisputed ? (
                <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                  <AlertTriangle size={14} />
                  Disputed
                </span>
              ) : needsAction ? (
                <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                  <Clock size={14} />
                  Action Needed
                </span>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                  <CheckCircle2 size={14} />
                  Confirmed
                </span>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4 text-sm">
              <div>
                <p className="text-slate-500">Amount</p>
                <p className="font-semibold text-slate-900">
                  {(
                    parseInt(transaction.amount_paid || 0) / 100_000_000
                  ).toFixed(2)}{" "}
                  MOVE
                </p>
              </div>
              <div>
                <p className="text-slate-500">Type</p>
                <p className="font-semibold text-slate-900 capitalize">
                  {transaction.listingType || "Purchase"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Your Role</p>
                <p className="font-semibold text-slate-900">
                  {isUserBuyer ? "Buyer" : "Seller"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <p className="font-semibold text-slate-900">
                  {transaction.escrowStatus || "In Escrow"}
                </p>
              </div>
            </div>

            {/* Confirmation Status */}
            <div className="flex items-center gap-6 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {transaction.confirmationStatus?.buyerConfirmed ? (
                  <CheckCircle2 size={18} className="text-green-600" />
                ) : (
                  <Clock size={18} className="text-slate-300" />
                )}
                <span
                  className={`text-sm ${
                    transaction.confirmationStatus?.buyerConfirmed
                      ? "text-green-600 font-medium"
                      : "text-slate-400"
                  }`}
                >
                  Buyer Confirmed
                </span>
              </div>
              <div className="flex items-center gap-2">
                {transaction.confirmationStatus?.sellerConfirmed ? (
                  <CheckCircle2 size={18} className="text-green-600" />
                ) : (
                  <Clock size={18} className="text-slate-300" />
                )}
                <span
                  className={`text-sm ${
                    transaction.confirmationStatus?.sellerConfirmed
                      ? "text-green-600 font-medium"
                      : "text-slate-400"
                  }`}
                >
                  Seller Confirmed
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {needsAction && !transaction.hasDispute && (
                <Button
                  onClick={() => handleConfirm(transaction)}
                  disabled={isConfirming}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isConfirming ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} className="mr-2" />
                      Confirm Transaction
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() =>
                  navigate(
                    `/app/property/${
                      transaction.property?.id || transaction.propertyId
                    }`
                  )
                }
              >
                <Eye size={16} className="mr-2" />
                View Property
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
          <ArrowLeftRight size={40} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-slate-500">
          Please connect your wallet to view transactions
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Transactions</h1>
        <p className="text-slate-600">
          Manage and track all your property transactions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-3 font-medium transition-all relative ${
            activeTab === "all"
              ? "text-blue-600"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          All Transactions
          {activeTab === "all" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-3 font-medium transition-all relative ${
            activeTab === "pending"
              ? "text-blue-600"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Pending
          {activeTab === "pending" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-6 py-3 font-medium transition-all relative ${
            activeTab === "completed"
              ? "text-blue-600"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Completed
          {activeTab === "completed" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileX size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No Transactions Found
          </h3>
          <p className="text-slate-500 mb-6">
            {activeTab === "pending"
              ? "You don't have any pending transactions"
              : activeTab === "completed"
              ? "You haven't completed any transactions yet"
              : "Start by purchasing or listing a property"}
          </p>
          <Button onClick={() => navigate("/app/marketplace")}>
            Browse Properties
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((tx, idx) => (
            <TransactionCard key={`${tx.escrowId}-${idx}`} transaction={tx} />
          ))}
        </div>
      )}
    </div>
  );
}
