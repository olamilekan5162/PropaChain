import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  Home,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { PropertyCard } from "../components/common/PropertyCard";
import { useMovementWallet } from "../hooks/useMovementWallet";
import { useFetchProperties } from "../hooks/useFetchProperties";
import { useEscrows } from "../hooks/useEscrows";
import { usePropertyOperations } from "../hooks/usePropertyOperations";
import { addressesEqual } from "../utils/helper";
import toast from "react-hot-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { walletAddress } = useMovementWallet();
  const { fetchPropertiesByOwner, fetchAllProperties } = useFetchProperties();
  const { fetchUserEscrows } = useEscrows();
  const { isDisputeRaised } = usePropertyOperations();

  const [loading, setLoading] = useState(true);
  const [myProperties, setMyProperties] = useState([]);
  const [activeTransactions, setActiveTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    inEscrow: 0,
    totalValue: 0,
    pendingConfirmations: 0,
  });

  useEffect(() => {
    if (walletAddress) {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load user's owned properties
      const owned = await fetchPropertiesByOwner(walletAddress);
      setMyProperties(owned.slice(0, 2)); // Show first 2

      // Load user escrows to find active transactions
      const escrows = await fetchUserEscrows(walletAddress);

      // Get all properties to match with escrows
      const allProperties = await fetchAllProperties();

      // Process active transactions (escrows that are not resolved)
      const activeEscrowPromises = escrows
        .filter((e) => !e.resolved)
        .slice(0, 5)
        .map(async (escrow) => {
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
            buyerAddress: escrow.buyer_renter,
            sellerAddress: escrow.seller_landlord,
            amount_paid: escrow.amount,
            listingType: escrow.listing_type === 1 ? "sale" : "rent",
            confirmationStatus: {
              buyer: escrow.buyer_renter_confirmed,
              seller: escrow.seller_landlord_confirmed,
            },
            hasDispute,
            isUserBuyer,
            property,
          };
        });

      const activeTransactionsData = await Promise.all(activeEscrowPromises);
      setActiveTransactions(activeTransactionsData);

      // Calculate stats
      const pendingConfirmations = activeTransactionsData.filter(
        (t) =>
          (t.confirmationStatus?.buyer === false &&
            addressesEqual(t.buyerAddress, walletAddress)) ||
          (t.confirmationStatus?.seller === false &&
            addressesEqual(t.sellerAddress, walletAddress))
      ).length;

      setStats({
        totalProperties: owned.length,
        inEscrow: owned.filter((p) => p.status === 2).length,
        totalValue: owned.reduce((sum, p) => sum + (p.price || 0), 0),
        pendingConfirmations,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, subtitle }) => (
    <div className="bg-white rounded-lg p-6 border border-zinc-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center">
          <Icon size={24} className="text-teal-700" />
        </div>
      </div>
      <p className="text-sm text-zinc-600 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-semibold text-zinc-900">{value}</h3>
        {subtitle && <span className="text-sm text-zinc-500">{subtitle}</span>}
      </div>
    </div>
  );

  const TransactionItem = ({ transaction }) => {
    const isUserBuyer = addressesEqual(transaction.buyerAddress, walletAddress);
    const needsAction =
      (isUserBuyer && !transaction.confirmationStatus?.buyer) ||
      (!isUserBuyer && !transaction.confirmationStatus?.seller);

    return (
      <button
        className="w-full p-4 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all text-left"
        onClick={() =>
          navigate(
            `/property/${transaction.property?.id || transaction.propertyId}`
          )
        }
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
            {transaction.property?.image ? (
              <img
                src={transaction.property.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 size={20} className="text-zinc-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-medium text-zinc-900 text-sm truncate">
                {transaction.property?.title ||
                  `Property #${transaction.propertyId}`}
              </p>
              {needsAction && (
                <span className="shrink-0 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-medium">
                  Action Required
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-600 mb-2">
              {isUserBuyer ? "Purchasing" : "Selling"}
            </p>
            <div className="flex items-center gap-4 text-xs">
              <span
                className={`flex items-center gap-1 ${
                  transaction.confirmationStatus?.buyer
                    ? "text-emerald-600"
                    : "text-zinc-400"
                }`}
              >
                {transaction.confirmationStatus?.buyer ? (
                  <CheckCircle2 size={12} />
                ) : (
                  <Clock size={12} />
                )}
                Buyer
              </span>
              <span
                className={`flex items-center gap-1 ${
                  transaction.confirmationStatus?.seller
                    ? "text-emerald-600"
                    : "text-zinc-400"
                }`}
              >
                {transaction.confirmationStatus?.seller ? (
                  <CheckCircle2 size={12} />
                ) : (
                  <Clock size={12} />
                )}
                Seller
              </span>
            </div>
          </div>
        </div>
      </button>
    );
  };

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6">
          <Wallet size={40} className="text-teal-700" />
        </div>
        <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
          Welcome to PropaChain
        </h2>
        <p className="text-zinc-600 mb-6">Connect your wallet to get started</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-teal-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 mb-2">Dashboard</h1>
        <p className="text-zinc-600">
          Welcome back! Here's your property overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Building2}
          label="My Properties"
          value={stats.totalProperties}
        />
        <StatCard icon={Clock} label="In Escrow" value={stats.inEscrow} />
        <StatCard
          icon={DollarSign}
          label="Total Value"
          value={`$${stats.totalValue.toFixed(0)}`}
          subtitle="MOVE"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Actions"
          value={stats.pendingConfirmations}
        />
      </div>

      {/* Alert Banner */}
      {stats.pendingConfirmations > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-900 mb-1">
                  {stats.pendingConfirmations} Transaction
                  {stats.pendingConfirmations !== 1 ? "s" : ""} Require Your
                  Attention
                </h3>
                <p className="text-sm text-amber-700">
                  Confirm your transactions to proceed with property transfer
                </p>
              </div>
            </div>
            <Button onClick={() => navigate("/app/transactions")} size="sm">
              Review Now
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Properties */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-zinc-900">
                My Properties
              </h2>
              <button
                onClick={() => navigate("/app/my-properties")}
                className="text-sm text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight size={16} />
              </button>
            </div>
            {myProperties.length === 0 ? (
              <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 size={32} className="text-zinc-400" />
                </div>
                <h3 className="text-lg font-medium text-zinc-900 mb-2">
                  No Properties Listed
                </h3>
                <p className="text-zinc-600 mb-6">
                  Start earning by listing your first property
                </p>
                <Button onClick={() => navigate("/app/upload")}>
                  List Property
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {myProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} showActions />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Transactions */}
          <section className="bg-white rounded-lg border border-zinc-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-zinc-900">
                Active Transactions
              </h2>
              <button
                onClick={() => navigate("/app/transactions")}
                className="text-xs text-teal-700 hover:text-teal-800 font-medium"
              >
                See All
              </button>
            </div>
            {activeTransactions.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={32} className="text-zinc-300 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm">No active transactions</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTransactions.map((tx, idx) => (
                  <TransactionItem key={idx} transaction={tx} />
                ))}
              </div>
            )}
          </section>

          {/* Quick Links */}
          <section className="bg-teal-50 border border-teal-100 rounded-lg p-6">
            <h3 className="font-semibold text-zinc-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/marketplace")}
                className="w-full text-left px-4 py-3 bg-white hover:bg-teal-50 rounded-lg transition-colors text-sm font-medium text-zinc-700 border border-zinc-200 hover:border-teal-200"
              >
                Browse Marketplace
              </button>
              <button
                onClick={() => navigate("/app/upload")}
                className="w-full text-left px-4 py-3 bg-white hover:bg-teal-50 rounded-lg transition-colors text-sm font-medium text-zinc-700 border border-zinc-200 hover:border-teal-200"
              >
                List New Property
              </button>
              <button
                onClick={() => navigate("/app/profile")}
                className="w-full text-left px-4 py-3 bg-white hover:bg-teal-50 rounded-lg transition-colors text-sm font-medium text-zinc-700 border border-zinc-200 hover:border-teal-200"
              >
                View Profile
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
