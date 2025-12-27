import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Building2,
  Loader2,
  Filter,
  Wallet,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { ReceiptModal } from "../components/features/ReceiptModal";
import { useMovementWallet } from "../hooks/useMovementWallet";
import { useEscrows } from "../hooks/useEscrows";
import { useFetchProperties } from "../hooks/useFetchProperties";
import { usePropertyOperations } from "../hooks/usePropertyOperations";
import { addressesEqual } from "../utils/helper";
import toast from "react-hot-toast";

const GATEWAY_URL = import.meta.env.VITE_PINATA_GATEWAY;

export default function Transactions() {
  const navigate = useNavigate();
  const { walletAddress } = useMovementWallet();
  const { fetchUserEscrows } = useEscrows();
  const { fetchAllProperties } = useFetchProperties();
  const { buyerRenterConfirms, sellerLandlordConfirms, isDisputeRaised } =
    usePropertyOperations();

  const [activeTab, setActiveTab] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      loadTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      // Fetch user's escrows (where user is buyer or seller)
      const escrows = await fetchUserEscrows(walletAddress);
      const allProperties = await fetchAllProperties();

      // Enrich escrows with property data and dispute status
      const enrichedTransactions = await Promise.all(
        escrows.map(async (escrow) => {
          const property = allProperties.find(
            (p) => p.id === escrow.property_id
          );
          const hasDispute = await isDisputeRaised(escrow.id);

          const isUserBuyer = addressesEqual(
            escrow.buyer_renter,
            walletAddress
          );

          return {
            escrowId: escrow.id,
            propertyId: escrow.property_id,
            listingType: escrow.listing_type === 1 ? "sale" : "rent",
            buyerAddress: escrow.buyer_renter,
            sellerAddress: escrow.seller_landlord,
            amount_paid: escrow.amount,
            buyerReceiptId: escrow.buyer_renter_receipt_id?.vec?.[0],
            sellerReceiptId: escrow.seller_landlord_receipt_id?.vec?.[0],
            confirmationStatus: {
              buyer: escrow.buyer_renter_confirmed,
              seller: escrow.seller_landlord_confirmed,
              buyerConfirmed: escrow.buyer_renter_confirmed,
              sellerConfirmed: escrow.seller_landlord_confirmed,
            },
            escrowStatus: escrow.resolved ? "COMPLETED" : "IN_ESCROW",
            hasDispute,
            isUserBuyer,
            property,
            createdAt: escrow.created_at,
          };
        })
      );

      setTransactions(enrichedTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (transaction) => {
    const isUserBuyer = addressesEqual(transaction.buyerAddress, walletAddress);

    try {
      setConfirmingId(transaction.escrowId);

      if (isUserBuyer) {
        await buyerRenterConfirms(transaction.escrowId);
        toast.success("Transaction confirmed successfully!");
      } else {
        await sellerLandlordConfirms(transaction.escrowId);
        toast.success("Transaction confirmed successfully!");
      }

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
    return true;
  });

  const TransactionCard = ({ transaction }) => {
    const isUserBuyer = transaction.isUserBuyer;
    const needsAction =
      (isUserBuyer && !transaction.confirmationStatus?.buyer) ||
      (!isUserBuyer && !transaction.confirmationStatus?.seller);
    const isConfirming = confirmingId === transaction.escrowId;

    const propertyImage =
      transaction.property?.image ||
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800";

    return (
      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:border-teal-700 hover:shadow-lg transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Property Image */}
            <div className="w-28 h-28 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
              {propertyImage ? (
                <img
                  src={propertyImage}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 size={32} className="text-zinc-400" />
                </div>
              )}
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                    {transaction.property?.title ||
                      `Property #${transaction.propertyId}`}
                  </h3>
                  <p className="text-sm text-zinc-500 flex items-center gap-1">
                    {transaction.property?.location || "Location unavailable"}
                  </p>
                </div>
                {transaction.hasDispute ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                    <AlertTriangle size={14} />
                    Disputed
                  </span>
                ) : needsAction ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                    <Clock size={14} />
                    Action Required
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium">
                    <CheckCircle2 size={14} />
                    Confirmed
                  </span>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-zinc-200">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Amount</p>
                  <p className="font-semibold text-zinc-900">
                    {(
                      parseInt(transaction.amount_paid || 0) / 100_000_000
                    ).toFixed(2)}{" "}
                    <span className="text-xs text-zinc-500">MOVE</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Type</p>
                  <p className="font-semibold text-zinc-900 capitalize">
                    {transaction.listingType || "Purchase"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Your Role</p>
                  <p className="font-semibold text-zinc-900">
                    {isUserBuyer ? "Buyer" : "Seller"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Status</p>
                  <p className="font-semibold text-zinc-900">
                    {transaction.escrowStatus || "In Escrow"}
                  </p>
                </div>
              </div>

              {/* Confirmation Progress */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  {transaction.confirmationStatus?.buyerConfirmed ? (
                    <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-teal-700" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-zinc-100 rounded-full flex items-center justify-center">
                      <Clock size={14} className="text-zinc-400" />
                    </div>
                  )}
                  <span
                    className={`text-sm ${
                      transaction.confirmationStatus?.buyerConfirmed
                        ? "text-teal-700 font-medium"
                        : "text-zinc-400"
                    }`}
                  >
                    Buyer Confirmed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {transaction.confirmationStatus?.sellerConfirmed ? (
                    <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-teal-700" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-zinc-100 rounded-full flex items-center justify-center">
                      <Clock size={14} className="text-zinc-400" />
                    </div>
                  )}
                  <span
                    className={`text-sm ${
                      transaction.confirmationStatus?.sellerConfirmed
                        ? "text-teal-700 font-medium"
                        : "text-zinc-400"
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
                    className="h-10"
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
                {(transaction.buyerReceiptId ||
                  transaction.sellerReceiptId) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const receiptId = transaction.isUserBuyer
                        ? transaction.buyerReceiptId
                        : transaction.sellerReceiptId;
                      if (receiptId) {
                        setSelectedReceiptId(receiptId);
                        setIsReceiptModalOpen(true);
                      }
                    }}
                    className="h-10"
                  >
                    <FileText size={16} className="mr-2" />
                    View Receipt
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate(
                      `/property/${
                        transaction.property?.id || transaction.propertyId
                      }`
                    )
                  }
                  className="h-10"
                >
                  <Eye size={16} className="mr-2" />
                  View Property
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-zinc-200 p-8 text-center">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet size={32} className="text-teal-700" />
          </div>
          <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-zinc-600 mb-6">
            Please connect your wallet to view your transactions
          </p>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-900 mb-2">
            Transaction History
          </h1>
          <p className="text-zinc-600">
            Track and manage all your property transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                <ArrowUpRight size={24} className="text-teal-700" />
              </div>
              <span className="text-xs text-zinc-500 font-medium">
                ALL TIME
              </span>
            </div>
            <p className="text-2xl font-semibold text-zinc-900 mb-1">
              {transactions.length}
            </p>
            <p className="text-sm text-zinc-600">Total Transactions</p>
          </div>

          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-amber-600" />
              </div>
              <span className="text-xs text-zinc-500 font-medium">PENDING</span>
            </div>
            <p className="text-2xl font-semibold text-zinc-900 mb-1">
              {
                transactions.filter(
                  (tx) =>
                    !tx.confirmationStatus?.buyer ||
                    !tx.confirmationStatus?.seller
                ).length
              }
            </p>
            <p className="text-sm text-zinc-600">Awaiting Confirmation</p>
          </div>

          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 size={24} className="text-teal-700" />
              </div>
              <span className="text-xs text-zinc-500 font-medium">
                COMPLETED
              </span>
            </div>
            <p className="text-2xl font-semibold text-zinc-900 mb-1">
              {
                transactions.filter(
                  (tx) =>
                    tx.confirmationStatus?.buyer &&
                    tx.confirmationStatus?.seller
                ).length
              }
            </p>
            <p className="text-sm text-zinc-600">Successfully Completed</p>
          </div>
        </div>

        {/* Tabs & Filter */}
        <div className="bg-white rounded-lg border border-zinc-200 mb-6">
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "all"
                    ? "bg-teal-700 text-white"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                All Transactions
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "pending"
                    ? "bg-teal-700 text-white"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "completed"
                    ? "bg-teal-700 text-white"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                Completed
              </button>
            </div>
            <button className="p-2.5 text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-teal-700 animate-spin" />
              <p className="text-zinc-600 font-medium">
                Loading transactions...
              </p>
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-zinc-200">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              No Transactions Found
            </h3>
            <p className="text-zinc-600 mb-6">
              {activeTab === "pending"
                ? "You don't have any pending transactions"
                : activeTab === "completed"
                ? "You haven't completed any transactions yet"
                : "Start by purchasing or listing a property"}
            </p>
            <Button onClick={() => navigate("/marketplace")}>
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

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setSelectedReceiptId(null);
        }}
        receiptId={selectedReceiptId}
      />
    </div>
  );
}
