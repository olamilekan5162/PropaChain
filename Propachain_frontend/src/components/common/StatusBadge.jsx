import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export const StatusBadge = ({ status, listingType, className }) => {
  // Map numeric status codes to string status
  // Based on smart contract: STATUS_AVAILABLE = 1, STATUS_IN_ESCROW = 2, STATUS_COMPLETED = 3, STATUS_RENTED = 4
  const statusMap = {
    1: "available",
    2: "escrow",
    3: "sold",
    4: "rented",
  };

  const styles = {
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    sale: "bg-blue-50 text-blue-700 border-blue-200",
    rent: "bg-purple-50 text-purple-700 border-purple-200",
    rented: "bg-amber-50 text-amber-700 border-amber-200",
    escrow: "bg-amber-50 text-amber-700 border-amber-200",
    "in escrow": "bg-amber-50 text-amber-700 border-amber-200",
    sold: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  const labels = {
    available: "Available",
    sale: "For Sale",
    rent: "For Rent",
    rented: "Rented",
    escrow: "In Escrow",
    "in escrow": "In Escrow",
    sold: "Sold",
  };

  // Handle both numeric and string status
  let normalizedStatus;
  if (typeof status === "number") {
    normalizedStatus = statusMap[status] || "sold";
  } else if (typeof status === "string") {
    normalizedStatus = status.toLowerCase();
  } else {
    normalizedStatus = "sold";
  }

  // If property is available (status 1), show listing type instead
  let displayStatus = normalizedStatus;
  if (normalizedStatus === "available" && listingType) {
    // Handle both numeric and string listing types
    // 1 = Sale, 2 = Rent
    if (typeof listingType === "number") {
      displayStatus = listingType === 1 ? "sale" : "rent";
    } else if (typeof listingType === "string") {
      displayStatus = listingType.toLowerCase();
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border bg-white/90 backdrop-blur-sm",
        styles[displayStatus] || styles.sold,
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full mr-1.5",
          displayStatus === "available" && "bg-emerald-500",
          displayStatus === "sale" && "bg-blue-500",
          displayStatus === "rent" && "bg-purple-500",
          displayStatus === "rented" && "bg-amber-500",
          (displayStatus === "escrow" || displayStatus === "in escrow") &&
            "bg-amber-500",
          !styles[displayStatus] && "bg-zinc-500"
        )}
      />
      {labels[displayStatus] || status}
    </span>
  );
};
