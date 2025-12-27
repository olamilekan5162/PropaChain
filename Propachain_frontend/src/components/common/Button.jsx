import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  isLoading,
  icon: Icon,
  ...props
}) => {
  const variants = {
    primary:
      "bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900 border border-teal-700",
    secondary:
      "bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400",
    accent:
      "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 border border-amber-500",
    ghost:
      "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border border-transparent",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-600",
    outline:
      "bg-transparent text-teal-700 border border-teal-700 hover:bg-teal-50",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-10 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && Icon && <Icon size={18} className="mr-2" />}
      {children}
    </button>
  );
};
