import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Share2,
  Heart,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  Eye,
  Clock,
  Shield,
} from "lucide-react";
import { mockProperties } from "../data/mockData";
import PropertyCard from "../components/common/PropertyCard";

export default function PropertyDetails() {
  const { id } = useParams();
  const property = mockProperties.find((p) => p.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h2>
          <Link
            to="/marketplace"
            className="text-teal-700 hover:text-teal-800 font-medium flex-shrink-0"
          >
            Browse All Properties
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const relatedProperties = mockProperties
    .filter((p) => p.id !== property.id && p.category === property.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Image Gallery */}
      <div className="relative bg-black">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-64 md:h-96 object-contain"
        />
        
        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white bg-opacity-50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white bg-opacity-90 hover:bg-white rounded-full p-2 shadow-lg">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="bg-white bg-opacity-90 hover:bg-white rounded-full p-2 shadow-lg">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Gallery - Desktop */}
      <div className="hidden md:block bg-gray-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
          {property.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? "border-teal-700 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`View ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {property.title}
                </h1>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-2">
                  Available
                </span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.location}</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-teal-700">
                  {formatPrice(property.price)}
                </span>
                {property.type === "short-let" && (
                  <span className="text-lg text-gray-600"> /night</span>
                )}
                {property.type === "rent" && (
                  <span className="text-lg text-gray-600"> /year</span>
                )}
              </div>
            </div>

            {/* Key Details */}
            {property.bedrooms && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Property Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600">Bedrooms</div>
                        <div className="font-semibold">{property.bedrooms}</div>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600">Bathrooms</div>
                        <div className="font-semibold">{property.bathrooms}</div>
                      </div>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center gap-2">
                      <Maximize className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600">Area</div>
                        <div className="font-semibold">{property.area}m²</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">Views</div>
                      <div className="font-semibold">{property.views}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posted Date */}
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              Posted on {formatDate(property.postedDate)}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Seller Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-teal-700 font-bold text-lg">
                      {property.seller.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 flex items-center">
                      {property.seller.name}
                      {property.seller.verified && (
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
                    <div className="text-sm text-gray-600">
                      {property.seller.totalListings} listings
                    </div>
                  </div>
                </div>

                {property.seller.rating && (
                  <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(property.seller.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {property.seller.rating.toFixed(1)}
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  {!showContact ? (
                    <button
                      onClick={() => setShowContact(true)}
                      className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Show Contact
                    </button>
                  ) : (
                    <>
                      <a
                        href={`tel:${property.seller.phone}`}
                        className="w-full bg-teal-700 text-white px-4 py-3 min-h-[48px] rounded-lg font-semibold hover:bg-teal-800 transition-colors flex items-center justify-center gap-2 flex-shrink-0"
                      >
                        <Phone className="w-5 h-5" />
                        {property.seller.phone}
                      </a>
                      <button className="w-full bg-white border-2 border-teal-700 text-teal-700 px-4 py-3 min-h-[48px] rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 flex-shrink-0">
                        <MessageCircle className="w-5 h-5" />
                        Send Message
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Safety Tips
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Meet seller at a safe public location</li>
                      <li>• Check the property before payment</li>
                      <li>• Pay only after thorough inspection</li>
                      <li>• Never send payment in advance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Similar Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
