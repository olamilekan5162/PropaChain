import {
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "./Button";

export const ReceiptCard = ({ receipt, onViewDetails, onDownload }) => {
  // Determine status from receipt data
  const getStatus = () => {
    if (receipt.is_disputed) return "Dispute Raised";
    if (receipt.buyer_confirmed && receipt.seller_confirmed) return "Completed";
    if (receipt.buyer_confirmed || receipt.seller_confirmed)
      return "Partially Confirmed";
    return "Awaiting Confirmation";
  };

  const status = getStatus();

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-teal-50 border-teal-200 text-teal-900";
      case "Dispute Raised":
        return "bg-red-50 border-red-200 text-red-900";
      case "Partially Confirmed":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "Awaiting Confirmation":
        return "bg-amber-50 border-amber-200 text-amber-900";
      default:
        return "bg-zinc-50 border-zinc-200 text-zinc-900";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={16} />;
      case "Dispute Raised":
        return <AlertCircle size={16} />;
      case "Partially Confirmed":
        return <CheckCircle size={16} />;
      case "Awaiting Confirmation":
        return <Clock size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5 hover:shadow-md hover:border-teal-700 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-11 h-11 bg-teal-50 rounded-lg flex items-center justify-center text-teal-700 shrink-0">
            <FileText size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm truncate">
              {receipt.property_type} - {receipt.listingType}
            </h4>
            <p className="text-xs text-gray-500 truncate">
              {receipt.property_address}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className="font-bold text-gray-900">{receipt.formattedAmount}</p>
          <p className="text-xs text-gray-500">MOVE</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Escrow ID</span>
          <span
            className="text-gray-900 font-mono text-xs truncate max-w-37.5"
            title={receipt.escrow_id}
          >
            {String(receipt.escrow_id).substring(0, 16)}...
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Date</span>
          <span className="text-gray-900">{receipt.formattedDate}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Type</span>
          <span className="text-gray-900">{receipt.listingType}</span>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            status
          )}`}
        >
          {getStatusIcon(status)}
          {status}
        </span>
        <div className="flex gap-2">
          <button
            onClick={onViewDetails}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            View Details
            <ChevronRight size={14} />
          </button>
          {onDownload && (
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
              title="Download receipt"
            >
              <Download size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
