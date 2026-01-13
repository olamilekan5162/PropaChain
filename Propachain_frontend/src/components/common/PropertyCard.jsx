import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize, Clock, Eye } from "lucide-react";

export default function PropertyCard({ property, compact = false }) {
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (compact) {
    return (
      <Link
        to={`/property/${property.id}`}
        className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="flex">
          <div className="w-20 md:w-24 h-20 md:h-24 flex-shrink-0">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-2 md:p-3">
            <h3 className="font-semibold text-xs md:text-sm text-gray-900 line-clamp-2 mb-1">
              {property.title}
            </h3>
            <p className="text-teal-700 font-bold text-sm md:text-base mb-1">
              {formatPrice(property.price)}
            </p>
            <p className="text-xs text-gray-500 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {property.location}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/property/${property.id}`}
      className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-40 md:h-48 object-cover"
        />
        {property.type && (
          <span className="absolute top-2 left-2 bg-teal-700 text-white px-1.5 md:px-2 py-0.5 md:py-1 rounded text-xs font-semibold uppercase">
            {property.type}
          </span>
        )}
        <span className="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded text-xs flex items-center">
          <Eye className="w-3 h-3 mr-1" />
          {property.views}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-base text-gray-900 line-clamp-2 mb-2">
          {property.title}
        </h3>

        <p className="text-teal-700 font-bold text-xl mb-3">
          {formatPrice(property.price)}
          {property.type === "short-let" && (
            <span className="text-sm text-gray-600 font-normal"> /night</span>
          )}
          {property.type === "rent" && (
            <span className="text-sm text-gray-600 font-normal"> /year</span>
          )}
        </p>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Property details */}
        {property.bedrooms && (
          <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
            {property.bedrooms && (
              <span className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                {property.bathrooms} Baths
              </span>
            )}
            {property.area && (
              <span className="flex items-center">
                <Maximize className="w-4 h-4 mr-1" />
                {property.area}m²
              </span>
            )}
          </div>
        )}

        {/* Seller info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs font-semibold text-gray-600">
                {property.seller?.name?.charAt(0) || "S"}
              </span>
            </div>
            <span className="text-sm text-gray-700">
              {property.seller?.name || "Seller"}
            </span>
            {property.seller?.verified && (
              <svg
                className="w-4 h-4 ml-1 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span className="text-xs text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatDate(property.postedDate)}
          </span>
        </div>
      </div>
    </Link>
  );
}
