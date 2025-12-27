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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        totalValue: owned.reduce((sum, p) => sum + (p.price || 0), 0),
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
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6">
          <Building2 size={40} className="text-teal-700" />
        </div>
        <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-zinc-600">
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
          <h1 className="text-3xl font-semibold text-zinc-900 mb-2">
            My Properties
          </h1>
          <p className="text-zinc-600">
            Manage and monitor your property listings
          </p>
        </div>
        <Button onClick={() => navigate("/app/upload")}>
          <Plus size={20} className="mr-2" />
          List New Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border border-zinc-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-teal-700" />
            </div>
          </div>
          <p className="text-sm text-zinc-600 mb-1">Total Properties</p>
          <p className="text-2xl font-semibold text-zinc-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-zinc-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Home size={20} className="text-emerald-700" />
            </div>
          </div>
          <p className="text-sm text-zinc-600 mb-1">Available</p>
          <p className="text-2xl font-semibold text-zinc-900">
            {stats.available}
          </p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-zinc-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-amber-700" />
            </div>
          </div>
          <p className="text-sm text-zinc-600 mb-1">In Escrow</p>
          <p className="text-2xl font-semibold text-zinc-900">
            {stats.inEscrow}
          </p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-zinc-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-teal-700" />
            </div>
          </div>
          <p className="text-sm text-zinc-600 mb-1">Total Value</p>
          <p className="text-2xl font-semibold text-zinc-900">
            ${stats.totalValue.toFixed(0)}
            <span className="text-sm font-normal text-zinc-500 ml-1">MOVE</span>
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-teal-700 animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-zinc-200">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 size={40} className="text-zinc-400" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-2">
            No Properties Listed
          </h3>
          <p className="text-zinc-600 mb-6">
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
