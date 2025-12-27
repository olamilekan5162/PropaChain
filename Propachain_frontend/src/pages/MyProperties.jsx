import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  DollarSign,
  Users,
  Home,
  Loader2,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { PropertyCard } from "../components/common/PropertyCard";
import { useMovementWallet } from "../hooks/useMovementWallet";
import { useFetchProperties } from "../hooks/useFetchProperties";
import toast from "react-hot-toast";

export default function MyProperties() {
  const navigate = useNavigate();
  const { walletAddress } = useMovementWallet();
  const { fetchPropertiesByOwner } = useFetchProperties();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    inEscrow: 0,
    sold: 0,
    totalValue: 0,
  });

  useEffect(() => {
    if (walletAddress) {
      loadMyProperties();
    }
  }, [walletAddress]);

  const loadMyProperties = async () => {
    try {
      setLoading(true);
      const owned = await fetchPropertiesByOwner(walletAddress);
      setProperties(owned);

      // Calculate stats
      const stats = {
        total: owned.length,
        available: owned.filter((p) => p.status === 1).length,
        inEscrow: owned.filter((p) => p.status === 2).length,
        sold: owned.filter((p) => p.status === 3).length,
        totalValue: owned.reduce(
          (sum, p) => sum + parseInt(p.price || 0) / 100_000_000,
          0
        ),
      };
      setStats(stats);
    } catch (error) {
      console.error("Error loading properties:", error);
      toast.error("Failed to load your properties");
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
          <Building2 size={40} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-slate-500">
          Please connect your wallet to view your properties
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            My Properties
          </h1>
          <p className="text-slate-600">
            Manage and monitor your property listings
          </p>
        </div>
        <Button
          onClick={() => navigate("/app/upload")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus size={20} className="mr-2" />
          List New Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Building2 size={24} />
            </div>
            <TrendingUp size={20} className="opacity-70" />
          </div>
          <p className="text-blue-100 text-sm mb-1">Total Properties</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Home size={24} />
            </div>
          </div>
          <p className="text-green-100 text-sm mb-1">Available</p>
          <p className="text-3xl font-bold">{stats.available}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Users size={24} />
            </div>
          </div>
          <p className="text-yellow-100 text-sm mb-1">In Escrow</p>
          <p className="text-3xl font-bold">{stats.inEscrow}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-purple-100 text-sm mb-1">Total Value</p>
          <p className="text-3xl font-bold">
            {stats.totalValue.toFixed(2)}
            <span className="text-lg font-normal ml-1">MOVE</span>
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No Properties Listed
          </h3>
          <p className="text-slate-500 mb-6">
            Start earning by listing your first property
          </p>
          <Button onClick={() => navigate("/app/upload")}>
            <Plus size={20} className="mr-2" />
            List Your First Property
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} showActions />
          ))}
        </div>
      )}
    </div>
  );
}
