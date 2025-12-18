import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const TransactionCard = ({ transaction }) => {
  const {
    id,
    type, // 'buy' | 'rent' | 'income'
    propertyTitle,
    amount,
    date,
    status, // 'completed' | 'pending' | 'failed'
    hash
  } = transaction;

  const isIncoming = type === 'income';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          isIncoming ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
        )}>
          {isIncoming ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        
        <div>
          <h4 className="font-semibold text-slate-900">{propertyTitle}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="capitalize">{type}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <p className={cn(
          "font-bold",
          isIncoming ? "text-emerald-600" : "text-slate-900"
        )}>
          {isIncoming ? '+' : '-'}${amount.toLocaleString()}
        </p>
        <div className="flex items-center justify-end gap-1 mt-1">
          {status === 'completed' && <CheckCircle size={12} className="text-emerald-500" />}
          {status === 'pending' && <Clock size={12} className="text-amber-500" />}
          {status === 'failed' && <AlertCircle size={12} className="text-red-500" />}
          <span className={cn(
            "text-xs font-medium capitalize",
            status === 'completed' && "text-emerald-500",
            status === 'pending' && "text-amber-500",
            status === 'failed' && "text-red-500",
          )}>{status}</span>
        </div>
      </div>
    </div>
  );
};
