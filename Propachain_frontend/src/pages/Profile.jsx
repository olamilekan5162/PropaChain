import { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Wallet,
  Building2,
  History as HistoryIcon,
  User,
} from "lucide-react";
import Jazzicon from "react-jazzicon";
import { useMovementWallet } from "../hooks/useMovementWallet";
import { useReceipts } from "../hooks/useReceipts";
import { useFetchProperties } from "../hooks/useFetchProperties";
import { Button } from "../components/common/Button";
import { PropertyCard } from "../components/common/PropertyCard";
import { ReceiptCard } from "../components/common/ReceiptCard";

const GATEWAY_URL = import.meta.env.VITE_PINATA_GATEWAY;

export default function Profile() {
  const { walletAddress } = useMovementWallet();
  const { receipts, loading, error, getUserReceipts } = useReceipts();
  const { fetchPropertiesByOwner } = useFetchProperties();
  const [activeTab, setActiveTab] = useState("listings");
  const [copied, setCopied] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  // Fetch receipts and properties when component mounts or wallet address changes
  useEffect(() => {
    if (walletAddress) {
      getUserReceipts();
      loadMyProperties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const loadMyProperties = async () => {
    try {
      setLoadingProperties(true);
      const props = await fetchPropertiesByOwner(walletAddress);
      const formatted = props.map((p) => ({
        id: p.id,
        title: p.description
          ? p.description.substring(0, 50) +
            (p.description.length > 50 ? "..." : "")
          : `Property #${p.id}`,
        location: p.property_address || "Location not specified",
        price: parseInt(p.price || 0) / 100_000_000,
        image:
          p.images_cids && p.images_cids.length > 0
            ? `https://${GATEWAY_URL}/ipfs/${p.images_cids[0]}`
            : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        beds: 3,
        baths: 2,
        sqft: 2200,
        status:
          p.status === 1
            ? "Available"
            : p.status === 2
            ? "In Escrow"
            : p.status === 3
            ? "Sold"
            : "Rented",
      }));
      setMyListings(formatted);
    } catch (error) {
      console.error("Failed to load properties:", error);
      setMyListings([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleViewDetails = (receipt) => {
    setSelectedReceipt(receipt);
  };

  const handleDownload = (receipt) => {
    // Determine status
    const getStatus = () => {
      if (receipt.is_disputed) return "Dispute Raised";
      if (receipt.buyer_confirmed && receipt.seller_confirmed)
        return "Completed";
      if (receipt.buyer_confirmed || receipt.seller_confirmed)
        return "Partially Confirmed";
      return "Awaiting Confirmation";
    };

    // Generate receipt data as JSON
    const receiptData = {
      receiptId: receipt.id,
      escrowId: receipt.escrowId,
      property: {
        id: receipt.property_id,
        address: receipt.property_address,
        type: receipt.property_type,
        listingType: receipt.listingType,
      },
      transaction: {
        amount: receipt.formattedAmount,
        currency: "MOVE",
        date: receipt.formattedDate,
      },
      parties: {
        buyerRenter: receipt.buyer_renter_address,
        sellerLandlord: receipt.seller_landlord_address,
      },
      status: getStatus(),
      confirmations: {
        buyer: receipt.buyer_confirmed || false,
        seller: receipt.seller_confirmed || false,
      },
      disputed: receipt.is_disputed || false,
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${receipt.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Wallet size={40} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Wallet Not Connected
        </h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Please connect your wallet to view your profile, listings, and
          transaction history.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-slate-100 overflow-hidden">
            <Jazzicon
              diameter={128}
              seed={parseInt(walletAddress.slice(2, 10), 16)}
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              User {walletAddress.slice(0, 6)}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 font-mono text-sm">
                {walletAddress}
              </span>
              <button
                onClick={handleCopyAddress}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                title="Copy Address"
              >
                {copied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-6 py-3 bg-slate-900 rounded-2xl text-white min-w-[160px]">
                <p className="text-sm text-slate-400 mb-1">Total Balance</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-2xl font-bold">2,450</h3>
                  <span className="text-sm font-medium text-slate-500 mb-1">
                    MOVE
                  </span>
                </div>
              </div>
              <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl min-w-[140px]">
                <p className="text-sm text-slate-500 mb-1">Properties</p>
                <h3 className="text-2xl font-bold text-slate-900">3</h3>
              </div>
              <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl min-w-[140px]">
                <p className="text-sm text-slate-500 mb-1">Total Income</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  450{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    MOVE
                  </span>
                </h3>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="secondary" className="w-full md:w-auto">
              Edit Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full md:w-auto text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              Report Issue
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 space-y-1">
            <button
              onClick={() => setActiveTab("listings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === "listings"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Building2 size={18} /> My Properties
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === "history"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <HistoryIcon size={18} /> Transaction History
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === "settings"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <User size={18} /> Account Settings
            </button>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === "listings" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">
                My Properties
              </h3>
              {loadingProperties ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : myListings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <Building2
                    size={48}
                    className="text-slate-300 mx-auto mb-4"
                  />
                  <p className="text-slate-500 mb-4">
                    No properties listed yet
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/app/upload")}
                  >
                    Create Your First Listing
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {myListings.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">
                Transaction History
              </h3>
              {loading && (
                <div className="text-center py-8 text-slate-500">
                  Loading your receipts...
                </div>
              )}
              {error && (
                <div className="text-center py-8 text-red-500">{error}</div>
              )}
              {!loading && !error && receipts.length > 0 && (
                <div className="space-y-4">
                  {receipts.map((receipt) => (
                    <ReceiptCard
                      key={receipt.escrow_id}
                      receipt={receipt}
                      onViewDetails={() => handleViewDetails(receipt)}
                      onDownload={() => handleDownload(receipt)}
                    />
                  ))}
                </div>
              )}
              {!loading && !error && receipts.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  No transactions found.
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
              Settings module coming soon.
            </div>
          )}
        </div>
      </div>

      {/* Receipt Detail Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Receipt Details
              </h2>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Property Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900 text-sm">
                  Property Information
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3 text-sm">
                  <div>
                    <p className="text-slate-600">Address</p>
                    <p className="text-slate-900 font-medium">
                      {selectedReceipt.property_address}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Property Type</p>
                    <p className="text-slate-900 font-medium">
                      {selectedReceipt.property_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Listing Type</p>
                    <p className="text-slate-900 font-medium">
                      {selectedReceipt.listingType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900 text-sm">
                  Transaction Information
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3 text-sm">
                  <div>
                    <p className="text-slate-600">Escrow ID</p>
                    <p className="text-slate-900 font-mono text-xs break-all">
                      {selectedReceipt.escrow_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Amount</p>
                    <p className="text-slate-900 font-bold">
                      {selectedReceipt.formattedAmount} MOVE
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Date</p>
                    <p className="text-slate-900 font-medium">
                      {selectedReceipt.formattedDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parties Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900 text-sm">
                  Transaction Parties
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3 text-sm">
                  <div>
                    <p className="text-slate-600">
                      {selectedReceipt.listingType === "Sale"
                        ? "Buyer"
                        : "Renter"}
                    </p>
                    <p className="text-slate-900 font-mono text-xs break-all">
                      {selectedReceipt.buyer_renter_address}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">
                      {selectedReceipt.listingType === "Sale"
                        ? "Seller"
                        : "Landlord"}
                    </p>
                    <p className="text-slate-900 font-mono text-xs break-all">
                      {selectedReceipt.seller_landlord_address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900 text-sm">Status</h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                  <p className="text-slate-600">Current Status</p>
                  <div
                    className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium border ${
                      selectedReceipt.is_disputed
                        ? "bg-red-100 border-red-200 text-red-800"
                        : selectedReceipt.buyer_confirmed &&
                          selectedReceipt.seller_confirmed
                        ? "bg-green-100 border-green-200 text-green-800"
                        : selectedReceipt.buyer_confirmed ||
                          selectedReceipt.seller_confirmed
                        ? "bg-blue-100 border-blue-200 text-blue-800"
                        : "bg-yellow-100 border-yellow-200 text-yellow-800"
                    }`}
                  >
                    {selectedReceipt.is_disputed
                      ? "Dispute Raised"
                      : selectedReceipt.buyer_confirmed &&
                        selectedReceipt.seller_confirmed
                      ? "Completed"
                      : selectedReceipt.buyer_confirmed ||
                        selectedReceipt.seller_confirmed
                      ? "Partially Confirmed"
                      : "Awaiting Confirmation"}
                  </div>

                  {selectedReceipt.escrowId && (
                    <div className="mt-3">
                      <p className="text-slate-600 mb-1">Escrow ID</p>
                      <p className="font-mono text-xs text-slate-900 break-all">
                        {selectedReceipt.escrowId}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-600">
                        {selectedReceipt.listingType === "Sale"
                          ? "Buyer"
                          : "Renter"}{" "}
                        Confirmed
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          selectedReceipt.buyer_confirmed
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {selectedReceipt.buyer_confirmed
                          ? "✓ Yes"
                          : "⧖ Pending"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-slate-600">
                        {selectedReceipt.listingType === "Sale"
                          ? "Seller"
                          : "Landlord"}{" "}
                        Confirmed
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          selectedReceipt.seller_confirmed
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {selectedReceipt.seller_confirmed
                          ? "✓ Yes"
                          : "⧖ Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex gap-3">
              <button
                onClick={() => handleDownload(selectedReceipt)}
                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Download Receipt
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-900 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
