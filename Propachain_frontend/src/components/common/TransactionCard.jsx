import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export const TransactionCard = ({ transaction }) => {
  const {
    id,
    type, // 'buy' | 'rent' | 'income'
    propertyTitle,
    amount,
    date,
    status, // 'completed' | 'pending' | 'failed'
    hash,
  } = transaction;

  const isIncoming = type === "income";

  return (
    <div className="bg-white p-4 rounded-lg border border-zinc-200 flex items-center justify-between hover:border-teal-700 hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            isIncoming
              ? "bg-teal-50 text-teal-700"
              : "bg-zinc-100 text-zinc-600"
          )}
        >
          {isIncoming ? (
            <ArrowDownLeft size={22} />
          ) : (
            <ArrowUpRight size={22} />
          )}
        </div>

        <div>
          <h4 className="font-semibold text-zinc-900 mb-1">{propertyTitle}</h4>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="capitalize font-medium">{type}</span>
            <span className="text-zinc-300">•</span>
            <span>{date}</span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <p
          className={cn(
            "text-lg font-semibold mb-1",
            isIncoming ? "text-teal-700" : "text-zinc-900"
          )}
        >
          {isIncoming ? "+" : "-"}${amount.toLocaleString()}
        </p>
        <div className="flex items-center justify-end gap-1.5">
          {status === "completed" && (
            <CheckCircle size={14} className="text-teal-600" />
          )}
          {status === "pending" && (
            <Clock size={14} className="text-amber-500" />
          )}
          {status === "failed" && (
            <AlertCircle size={14} className="text-red-500" />
          )}
          <span
            className={cn(
              "text-xs font-medium capitalize",
              status === "completed" && "text-teal-600",
              status === "pending" && "text-amber-500",
              status === "failed" && "text-red-500"
            )}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};
