import { MapPin, ArrowRight, Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";
import { useMovementWallet } from "../../hooks/useMovementWallet";
import { addressesEqual } from "../../utils/helper";

export const PropertyCard = ({ property, showActions = false }) => {
  const { walletAddress } = useMovementWallet();
  const {
    id,
    title,
    location,
    description,
    price,
    image,
    status,
    listing_type,
    owner,
  } = property;

  const isOwner =
    walletAddress && owner && addressesEqual(walletAddress, owner);

  return (
    <div className="group bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all duration-300">
      {/* Image Container */}
      <Link
        to={`/property/${id}`}
        className="relative block aspect-video overflow-hidden bg-zinc-100"
      >
        <div className="absolute top-3 left-3 z-10">
          <StatusBadge status={status} listingType={listing_type} />
        </div>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800";
          }}
        />
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <Link to={`/property/${id}`}>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1.5 group-hover:text-teal-700 transition-colors">
              {title}
            </h3>
          </Link>
          {description && (
            <p className="text-sm text-zinc-600 line-clamp-2 mb-2 leading-relaxed">
              {description}
            </p>
          )}
          <div className="flex items-center text-zinc-500 text-sm">
            <MapPin size={14} className="mr-1 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4 pb-3 border-b border-zinc-100">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-teal-700">
              {price.toLocaleString()}
            </span>
            <span className="text-sm text-zinc-500">MOVE</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && isOwner ? (
          <div className="flex gap-2">
            <Link to={`/property/${id}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                <Eye size={16} className="mr-1.5" />
                View
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="px-3"
              title="Edit Property"
              onClick={(e) => {
                e.preventDefault();
                alert("Edit functionality coming soon!");
              }}
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="px-3 hover:bg-red-50 hover:text-red-600"
              title="Delete Property"
              onClick={(e) => {
                e.preventDefault();
                if (confirm("Are you sure you want to delete this property?")) {
                  alert("Delete functionality coming soon!");
                }
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ) : (
          <Link to={`/property/${id}`}>
            <Button variant="outline" size="sm" className="w-full">
              View Details
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
