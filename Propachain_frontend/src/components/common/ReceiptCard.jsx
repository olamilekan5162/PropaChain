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
        return "bg-green-50 border-green-200 text-green-900";
      case "Dispute Raised":
        return "bg-red-50 border-red-200 text-red-900";
      case "Partially Confirmed":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "Awaiting Confirmation":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      default:
        return "bg-slate-50 border-slate-200 text-slate-900";
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
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 flex-shrink-0">
            <FileText size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 text-sm truncate">
              {receipt.property_type} - {receipt.listingType}
            </h4>
            <p className="text-xs text-slate-500 truncate">
              {receipt.property_address}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="font-bold text-slate-900">{receipt.formattedAmount}</p>
          <p className="text-xs text-slate-500">MOVE</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 pb-4 border-b border-slate-100">
        <div className="flex justify-between text-xs">
          <span className="text-slate-600">Escrow ID</span>
          <span
            className="text-slate-900 font-mono text-xs truncate max-w-[150px]"
            title={receipt.escrow_id}
          >
            {String(receipt.escrow_id).substring(0, 16)}...
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-600">Date</span>
          <span className="text-slate-900">{receipt.formattedDate}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-600">Type</span>
          <span className="text-slate-900">{receipt.listingType}</span>
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
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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
