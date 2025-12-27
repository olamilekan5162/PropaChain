import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Copy,
  Check,
  Wallet,
  Shield,
  Bell,
  Activity,
  ChevronRight,
} from "lucide-react";
import Jazzicon from "react-jazzicon";
import { useMovementWallet } from "../hooks/useMovementWallet";
import { useUserProfile } from "../hooks/useUserProfile";
import { useFetchProperties } from "../hooks/useFetchProperties";
import { useEscrows } from "../hooks/useEscrows";
import { Button } from "../components/common/Button";
import { aptos } from "../config/movement";
import { normalizeAddress, addressesEqual } from "../utils/helper";

export default function Profile() {
  const navigate = useNavigate();
  const { walletAddress, nativeAccount } = useMovementWallet();
  const { profile } = useUserProfile();
  const {
    properties,
    loading: loadingProperties,
    fetchAllProperties,
  } = useFetchProperties();
  const { escrows, loading: loadingEscrows, fetchAllEscrows } = useEscrows();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(null);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeTransactions: 0,
    completedDeals: 0,
  });

  // Fetch properties and escrows on mount
  useEffect(() => {
    if (walletAddress) {
      fetchAllProperties();
      fetchAllEscrows();
    }
  }, [walletAddress]);

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) return;
      try {
        const resources = await aptos.getAccountResources({
          accountAddress: walletAddress,
        });
        const coinResource = resources.find(
          (r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
        );
        if (coinResource) {
          const bal = coinResource.data.coin.value;
          setBalance((bal / 100000000).toFixed(2));
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchBalance();
  }, [walletAddress]);

  // Calculate stats
  useEffect(() => {
    if (!walletAddress || loadingProperties || loadingEscrows) return;

    console.log("Calculating stats for wallet:", walletAddress);
    console.log("Total properties:", properties.length);
    console.log("Total escrows:", escrows.length);

    // Normalize the wallet address once
    const normalizedWallet = normalizeAddress(walletAddress);

    // Count user's properties (where user is the owner)
    const userProperties = properties.filter((p) => {
      const ownerMatch = addressesEqual(p.owner, normalizedWallet);
      if (ownerMatch) {
        console.log("Found user property:", p.id);
      }
      return ownerMatch;
    });

    // Count active transactions (escrows where user is involved and not resolved)
    const activeEscrows = escrows.filter((e) => {
      const isBuyer = addressesEqual(e.buyer_renter, normalizedWallet);
      const isSeller = addressesEqual(e.seller_landlord, normalizedWallet);
      const isActive = !e.is_resolved;
      return isActive && (isBuyer || isSeller);
    });

    // Count completed deals (resolved escrows where user was involved)
    const completedEscrows = escrows.filter((e) => {
      const isBuyer = addressesEqual(e.buyer_renter, normalizedWallet);
      const isSeller = addressesEqual(e.seller_landlord, normalizedWallet);
      const isCompleted =
        e.is_resolved &&
        e.buyer_confirmed &&
        e.seller_confirmed &&
        !e.is_disputed;
      return isCompleted && (isBuyer || isSeller);
    });

    console.log("Stats calculated:", {
      totalListings: userProperties.length,
      activeTransactions: activeEscrows.length,
      completedDeals: completedEscrows.length,
    });

    setStats({
      totalListings: userProperties.length,
      activeTransactions: activeEscrows.length,
      completedDeals: completedEscrows.length,
    });
  }, [walletAddress, properties, escrows, loadingProperties, loadingEscrows]);

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-zinc-200 p-8 text-center">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet size={32} className="text-teal-700" />
          </div>
          <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
            Wallet Not Connected
          </h2>
          <p className="text-zinc-600 mb-6">
            Please connect your wallet to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Profile Card */}
        <div className="bg-white rounded-xl p-8 border border-zinc-200 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
              <div className="w-28 h-28 rounded-xl border-2 border-zinc-200 shadow-sm flex items-center justify-center bg-zinc-50 overflow-hidden">
                <Jazzicon
                  diameter={112}
                  seed={parseInt(walletAddress.slice(2, 10), 16)}
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-semibold text-zinc-900 mb-3">
                  {profile?.name ||
                    `User ${walletAddress.slice(0, 6)}...${walletAddress.slice(
                      -4
                    )}`}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-6">
                  <span className="px-3 py-1.5 bg-zinc-100 rounded-lg text-zinc-700 font-mono text-sm">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors"
                    title="Copy Address"
                  >
                    {copied ? (
                      <Check size={16} className="text-teal-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-teal-50 rounded-lg px-4 py-3 border border-teal-100">
                    <p className="text-xs text-teal-700 mb-1 font-medium">
                      Member Since
                    </p>
                    <p className="text-sm font-semibold text-teal-900">
                      {profile?.created_at
                        ? new Date(
                            profile.created_at / 1000
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : "Not Registered"}
                    </p>
                  </div>
                  <div className="bg-zinc-50 rounded-lg px-4 py-3 border border-zinc-200">
                    <p className="text-xs text-zinc-600 mb-1 font-medium">
                      Account Status
                    </p>
                    <p className="text-sm font-semibold text-zinc-900">
                      {profile ? "✓ Verified" : "Unregistered"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto">
                Edit Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full sm:w-auto text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Report Issue
              </Button>
            </div>
          </div>
        </div>

        {/* Account Settings Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* KYC Verification Status */}
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-teal-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">KYC Status</h3>
                  <p className="text-sm text-zinc-600">Identity Verification</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-sm text-zinc-600">Email</span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    profile?.email
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {profile?.email ? "✓ Verified" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-sm text-zinc-600">Phone</span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    profile?.phone_number
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {profile?.phone_number ? "✓ Verified" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-600">Identity</span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    profile?.government_id_number
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {profile?.government_id_number ? "✓ Verified" : "Pending"}
                </span>
              </div>
              {!profile && (
                <Button className="w-full mt-4">Complete Verification</Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Activity size={20} className="text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Quick Stats</h3>
                <p className="text-sm text-zinc-600">Account Overview</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-sm text-zinc-600">Properties Listed</span>
                <span className="text-lg font-semibold text-zinc-900">
                  {loadingProperties ? "..." : stats.totalListings}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-sm text-zinc-600">
                  Active Transactions
                </span>
                <span className="text-lg font-semibold text-zinc-900">
                  {loadingEscrows ? "..." : stats.activeTransactions}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-600">Completed Deals</span>
                <span className="text-lg font-semibold text-zinc-900">
                  {loadingEscrows ? "..." : stats.completedDeals}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate("/app/my-properties")}
                  className="flex-1 px-3 py-2 text-sm text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors font-medium"
                >
                  View Properties
                </button>
                <button
                  onClick={() => navigate("/app/transactions")}
                  className="flex-1 px-3 py-2 text-sm text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors font-medium"
                >
                  View History
                </button>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Wallet size={20} className="text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Wallet</h3>
                <p className="text-sm text-zinc-600">Connected Account</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="py-2 border-b border-zinc-100">
                <p className="text-xs text-zinc-600 mb-1">Wallet Address</p>
                <p className="text-xs font-mono text-zinc-900 break-all">
                  {walletAddress || "Not Connected"}
                </p>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-600">Balance</span>
                <span className="text-lg font-semibold text-zinc-900">
                  {balance ? `${balance} MOVE` : "..."}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  /* Add disconnect logic */
                }}
              >
                Disconnect Wallet
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Bell size={20} className="text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Notifications</h3>
                <p className="text-sm text-zinc-600">Manage your alerts</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    Email Notifications
                  </p>
                  <p className="text-xs text-zinc-600">
                    Receive updates via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-teal-700 rounded"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    Transaction Alerts
                  </p>
                  <p className="text-xs text-zinc-600">
                    Get notified on every transaction
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-teal-700 rounded"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    Price Alerts
                  </p>
                  <p className="text-xs text-zinc-600">
                    Notify on price changes
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-teal-700 rounded"
                />
              </div>
            </div>
          </div>

          {/* Security & Privacy */}
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">
                  Security & Privacy
                </h3>
                <p className="text-sm text-zinc-600">Account protection</p>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors text-left">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-zinc-600">
                    Add extra security layer
                  </p>
                </div>
                <ChevronRight size={18} className="text-zinc-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors text-left">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    Privacy Settings
                  </p>
                  <p className="text-xs text-zinc-600">Control your data</p>
                </div>
                <ChevronRight size={18} className="text-zinc-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors text-left">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    Connected Apps
                  </p>
                  <p className="text-xs text-zinc-600">Manage integrations</p>
                </div>
                <ChevronRight size={18} className="text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
