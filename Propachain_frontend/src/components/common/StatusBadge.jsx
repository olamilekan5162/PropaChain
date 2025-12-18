import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const StatusBadge = ({ status, className }) => {
  const styles = {
    available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rented: 'bg-amber-50 text-amber-700 border-amber-200',
    escrow: 'bg-blue-50 text-blue-700 border-blue-200',
    sold: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const labels = {
    available: 'Available',
    rented: 'Rented',
    escrow: 'In Escrow',
    sold: 'Sold',
  };

  const normalizedStatus = status.toLowerCase();
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
      styles[normalizedStatus] || styles.sold,
      className
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        normalizedStatus === 'available' && "bg-emerald-500",
        normalizedStatus === 'rented' && "bg-amber-500",
        normalizedStatus === 'escrow' && "bg-blue-500",
        (!styles[normalizedStatus]) && "bg-slate-500"
      )} />
      {labels[normalizedStatus] || status}
    </span>
  );
};
