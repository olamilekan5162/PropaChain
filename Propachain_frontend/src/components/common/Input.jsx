import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export const Input = ({
  label,
  error,
  className,
  wrapperClassName,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      {label && (
        <label className="text-sm font-medium text-zinc-700">{label}</label>
      )}
      <input
        className={cn(
          "flex h-10 w-full rounded-lg border bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-50 transition-all duration-200",
          error ? "border-red-500 focus:ring-red-500" : "border-zinc-300",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
