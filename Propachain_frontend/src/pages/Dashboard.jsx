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
import { useReceipts } from "../hooks/useReceipts";
import { usePropertyOperations } from "../hooks/usePropertyOperations";
import toast from "react-hot-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { walletAddress } = useMovementWallet();
  const { fetchPropertiesByOwner, fetchAllProperties } = useFetchProperties();
  const { getUserReceipts } = useReceipts();
  const { getConfirmationStatus } = usePropertyOperations();

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
  }, [walletAddress]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load user's owned properties
      const owned = await fetchPropertiesByOwner(walletAddress);
      setMyProperties(owned.slice(0, 2)); // Show first 2

      // Load user receipts to find active transactions
      const receipts = await getUserReceipts(walletAddress);

      // Get all properties to match with receipts
      const allProperties = await fetchAllProperties();

      // Process active transactions (receipts with IN_ESCROW status)
      const activeReceiptPromises = receipts
        .filter((r) => r.escrowStatus === "IN_ESCROW")
        .slice(0, 5)
        .map(async (receipt) => {
          const property = allProperties.find(
            (p) => p.id === receipt.propertyId
          );
          const confirmationStatus = await getConfirmationStatus(
            receipt.escrowId
          );
          return {
            ...receipt,
            property,
            confirmationStatus,
          };
        });

      const activeTransactionsData = await Promise.all(activeReceiptPromises);
      setActiveTransactions(activeTransactionsData);

      // Calculate stats
      const pendingConfirmations = activeTransactionsData.filter(
        (t) =>
          (t.confirmationStatus?.buyer === false &&
            t.buyerAddress === walletAddress) ||
          (t.confirmationStatus?.seller === false &&
            t.sellerAddress === walletAddress)
      ).length;

      setStats({
        totalProperties: owned.length,
        inEscrow: owned.filter((p) => p.status === 2).length,
        totalValue:
          owned.reduce((sum, p) => sum + parseInt(p.price || 0), 0) /
          100_000_000,
        pendingConfirmations,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, subtitle, color }) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon size={24} />
        </div>
      </div>
      <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  );

  const TransactionItem = ({ transaction }) => {
    const isUserBuyer = transaction.buyerAddress === walletAddress;
    const needsAction =
      (isUserBuyer && !transaction.confirmationStatus?.buyer) ||
      (!isUserBuyer && !transaction.confirmationStatus?.seller);

    return (
      <div
        className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group"
        onClick={() =>
          navigate(
            `/app/property/${
              transaction.property?.id || transaction.propertyId
            }`
          )
        }
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
            {transaction.property?.image ? (
              <img
                src={transaction.property.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 size={20} className="text-slate-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                {transaction.property?.title ||
                  `Property #${transaction.propertyId}`}
              </p>
              {needsAction && (
                <span className="flex-shrink-0 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full font-medium">
                  Action Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-2">
              {isUserBuyer ? "You are buying" : "You are selling"}
            </p>
            <div className="flex items-center gap-4 text-xs">
              <span
                className={`flex items-center gap-1 ${
                  transaction.confirmationStatus?.buyer
                    ? "text-green-600"
                    : "text-slate-400"
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
                    ? "text-green-600"
                    : "text-slate-400"
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
      </div>
    );
  };

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
          <Wallet size={40} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Welcome to PropaChain
        </h2>
        <p className="text-slate-500 mb-6">
          Connect your wallet to get started
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">
          Welcome back! Here's your property overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Building2}
          label="My Properties"
          value={stats.totalProperties}
          color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        />
        <StatCard
          icon={Clock}
          label="In Escrow"
          value={stats.inEscrow}
          color="bg-gradient-to-br from-orange-500 to-orange-600 text-white"
        />
        <StatCard
          icon={DollarSign}
          label="Total Value"
          value={`${stats.totalValue.toFixed(1)}`}
          subtitle="MOVE"
          color="bg-gradient-to-br from-green-500 to-green-600 text-white"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Actions"
          value={stats.pendingConfirmations}
          color="bg-gradient-to-br from-red-500 to-red-600 text-white"
        />
      </div>

      {/* Quick Actions */}
      {stats.pendingConfirmations > 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">
                {stats.pendingConfirmations} Transaction
                {stats.pendingConfirmations !== 1 ? "s" : ""} Need Your
                Attention
              </h3>
              <p className="text-white/90 text-sm">
                Confirm your transactions to proceed with property transfer
              </p>
            </div>
            <Button
              onClick={() => navigate("/app/transactions")}
              className="bg-white text-orange-600 hover:bg-white/90"
            >
              Review Now
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Properties */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                My Properties
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/app/my-properties")}
              >
                View All
              </Button>
            </div>
            {myProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No Properties Listed
                </h3>
                <p className="text-slate-500 mb-6">
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
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Active Transactions
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/app/transactions")}
                className="text-xs"
              >
                See All
              </Button>
            </div>
            {activeTransactions.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No active transactions</p>
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
          <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/app/marketplace")}
                className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
              >
                Browse Marketplace
              </button>
              <button
                onClick={() => navigate("/app/upload")}
                className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
              >
                List New Property
              </button>
              <button
                onClick={() => navigate("/app/profile")}
                className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
              >
                View Receipts
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
