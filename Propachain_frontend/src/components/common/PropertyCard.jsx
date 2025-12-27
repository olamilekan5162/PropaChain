import {
  MapPin,
  Bed,
  Bath,
  Square,
  ArrowRight,
  Edit,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";
import { useMovementWallet } from "../../hooks/useMovementWallet";

export const PropertyCard = ({ property, showActions = false }) => {
  const { walletAddress } = useMovementWallet();
  const {
    id,
    title,
    location,
    price,
    image,
    beds,
    baths,
    sqft,
    status,
    owner,
  } = property;

  const isOwner =
    walletAddress &&
    owner &&
    walletAddress.toLowerCase() === owner.toLowerCase();

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <StatusBadge
            status={status}
            className="bg-white/90 backdrop-blur-sm shadow-sm"
          />
        </div>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center text-slate-500 text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              <span className="truncate">{location}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              ${price.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">MOVE</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 my-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Bed size={16} className="text-slate-400" />
            <span className="text-sm font-medium">
              {beds}{" "}
              <span className="text-xs text-slate-400 font-normal">Beds</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Bath size={16} className="text-slate-400" />
            <span className="text-sm font-medium">
              {baths}{" "}
              <span className="text-xs text-slate-400 font-normal">Baths</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Square size={16} className="text-slate-400" />
            <span className="text-sm font-medium">
              {sqft}{" "}
              <span className="text-xs text-slate-400 font-normal">sqft</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        {showActions && isOwner ? (
          <div className="flex gap-2">
            <Link to={`/app/property/${id}`} className="flex-1">
              <Button variant="secondary" className="w-full">
                <Eye size={16} className="mr-2" />
                View
              </Button>
            </Link>
            <Button
              variant="secondary"
              className="px-3"
              title="Edit Property"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Implement edit functionality
                alert("Edit functionality coming soon!");
              }}
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="secondary"
              className="px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              title="Delete Property"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Implement delete functionality
                if (confirm("Are you sure you want to delete this property?")) {
                  alert("Delete functionality coming soon!");
                }
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ) : (
          <Link to={`/app/property/${id}`}>
            <Button
              variant="secondary"
              className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary"
            >
              View Details
              <ArrowRight
                size={16}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
