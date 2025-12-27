import {
  X,
  FileText,
  Calendar,
  DollarSign,
  MapPin,
  User,
  Building2,
  CheckCircle,
} from "lucide-react";
import { Button } from "../common/Button";
import { useEffect, useState } from "react";
import { aptos } from "../../config/movement";
import { MOVEMENT_CONTRACT_ADDRESS } from "../../config/constants";

export const ReceiptModal = ({ isOpen, onClose, receiptId }) => {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && receiptId) {
      fetchReceipt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, receiptId]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      const result = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_receipt`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, receiptId],
          typeArguments: [],
        },
      });

      if (result && result[0]) {
        setReceipt(result[0]);
      }
    } catch (error) {
      console.error("Error fetching receipt:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-700 to-teal-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Property Transaction Receipt
              </h2>
              <p className="text-sm text-teal-50">NFT Receipt #{receiptId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-700 border-t-transparent" />
          </div>
        ) : receipt ? (
          <div className="p-6 space-y-5">
            {/* Status Banner */}
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-200 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-teal-900">
                  Transaction Successfully Completed
                </p>
                <p className="text-xs text-teal-700 mt-0.5">
                  This receipt is an immutable NFT stored on Movement Blockchain
                </p>
              </div>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  receipt.listing_type === 1
                    ? "bg-blue-500 text-white"
                    : "bg-purple-500 text-white"
                }`}
              >
                {receipt.listing_type === 1 ? "PURCHASE" : "RENTAL"}
              </span>
            </div>

            {/* Key Transaction Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200">
                <p className="text-xs text-zinc-500 mb-1">Amount Paid</p>
                <p className="text-2xl font-bold text-teal-700">
                  {(parseInt(receipt.amount_paid || 0) / 100_000_000).toFixed(
                    2
                  )}
                  <span className="text-sm text-zinc-600 ml-1 font-medium">
                    MOVE
                  </span>
                </p>
              </div>
              <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200">
                <p className="text-xs text-zinc-500 mb-1">Transaction Date</p>
                <p className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                  <Calendar size={16} className="text-zinc-400" />
                  {new Date(
                    parseInt(receipt.timestamp) * 1000
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Property Details */}
            <div className="border border-zinc-200 rounded-lg overflow-hidden">
              <div className="bg-zinc-100 px-4 py-3 border-b border-zinc-200">
                <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
                  <Building2 size={18} className="text-teal-700" />
                  Property Information
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1.5">Property ID</p>
                    <p className="font-mono text-sm font-medium text-zinc-900 bg-zinc-100 px-3 py-1.5 rounded">
                      #{receipt.property_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1.5">
                      Property Type
                    </p>
                    <p className="text-sm font-medium text-zinc-900">
                      {receipt.property_type || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1.5">Location</p>
                  <p className="text-sm font-medium text-zinc-900 flex items-center gap-1.5">
                    <MapPin size={14} className="text-teal-600" />
                    {receipt.property_address || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Parties */}
            <div className="border border-zinc-200 rounded-lg overflow-hidden">
              <div className="bg-zinc-100 px-4 py-3 border-b border-zinc-200">
                <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
                  <User size={18} className="text-teal-700" />
                  Transaction Parties
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs text-zinc-500 mb-2 font-medium">
                    {receipt.listing_type === 1 ? "BUYER" : "RENTER"}
                  </p>
                  <p className="font-mono text-xs text-zinc-900 bg-zinc-50 px-3 py-2.5 rounded border border-zinc-200 break-all">
                    {receipt.buyer_renter_address}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-2 font-medium">
                    {receipt.listing_type === 1 ? "SELLER" : "LANDLORD"}
                  </p>
                  <p className="font-mono text-xs text-zinc-900 bg-zinc-50 px-3 py-2.5 rounded border border-zinc-200 break-all">
                    {receipt.seller_landlord_address}
                  </p>
                </div>
              </div>
            </div>

            {/* Rental Details (if applicable) */}
            {receipt.listing_type === 2 &&
              receipt.rental_start_date?.vec?.[0] && (
                <div className="border border-purple-200 rounded-lg overflow-hidden bg-purple-50">
                  <div className="bg-purple-100 px-4 py-3 border-b border-purple-200">
                    <h3 className="font-semibold text-purple-900 flex items-center gap-2">
                      <Calendar size={18} className="text-purple-700" />
                      Rental Period Details
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-purple-700 mb-1.5 font-medium">
                          Start Date
                        </p>
                        <p className="text-sm font-semibold text-purple-900">
                          {new Date(
                            parseInt(receipt.rental_start_date.vec[0]) * 1000
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-700 mb-1.5 font-medium">
                          End Date
                        </p>
                        <p className="text-sm font-semibold text-purple-900">
                          {new Date(
                            parseInt(receipt.rental_end_date.vec[0]) * 1000
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-700 mb-1.5 font-medium">
                          Monthly Rent
                        </p>
                        <p className="text-sm font-semibold text-purple-900">
                          {(
                            parseInt(receipt.monthly_rent?.vec?.[0] || 0) /
                            100_000_000
                          ).toFixed(2)}{" "}
                          MOVE
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-700 mb-1.5 font-medium">
                          Duration
                        </p>
                        <p className="text-sm font-semibold text-purple-900">
                          {receipt.rental_period_months?.vec?.[0] || 0} months
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-zinc-600">Receipt not found</p>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-50 border-t border-zinc-200 px-6 py-4 flex justify-between items-center">
          <p className="text-xs text-zinc-500">
            Receipt ID:{" "}
            <span className="font-mono font-medium text-zinc-700">
              #{receiptId}
            </span>
          </p>
          <Button onClick={onClose} className="min-w-[120px]">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
