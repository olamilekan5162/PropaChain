import { useState } from "react";
import { mockProperties } from "../data/mockData";
import PropertyCard from "../components/common/PropertyCard";
import { Plus, ShoppingBag, Home, Upload, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyProperties() {
  const [activeTab, setActiveTab] = useState("uploaded");

  // Mock data for property management
  const uploadedForSale = [
    { ...mockProperties[0], status: "available" },
    { ...mockProperties[1], status: "available" },
    { ...mockProperties[2], status: "sold", soldDate: "2024-01-15" },
  ];

  const uploadedForRent = [
    { ...mockProperties[3], status: "available", rentDuration: null },
  ];

  const boughtProperties = [
    { ...mockProperties[4], purchasedDate: "2023-12-20" },
  ];

  const rentedProperties = [
    {
      ...mockProperties[5],
      rentStartDate: "2024-01-01",
      rentEndDate: "2024-12-31",
    },
  ];

  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const PropertyCardWithStatus = ({ property, type }) => {
    const isSold = property.status === "sold";
    const daysRemaining =
      type === "rented" ? calculateDaysRemaining(property.rentEndDate) : null;

    return (
      <Link to={`/property/${property.id}`} className="block">
        <div
          className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all ${
            isSold ? "opacity-75" : ""
          }`}
        >
          <div className="relative">
            <img
              src={property.images[0]}
              alt={property.title}
              className={`w-full h-48 object-cover ${
                isSold ? "grayscale" : ""
              }`}
            />
            {isSold && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="bg-red-600 text-white px-6 py-3 rounded-lg text-xl font-bold">
                  SOLD
                </div>
              </div>
            )}
            {daysRemaining !== null && (
              <div className="absolute top-3 right-3 bg-teal-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {daysRemaining} days left
              </div>
            )}
            <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-medium text-teal-700">
              {property.category}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {property.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
              <span>{property.location}</span>
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-teal-700">
                  {property.price.toLocaleString()} MOVE
                </p>
                {property.priceUSD && (
                  <p className="text-sm text-gray-500">
                    \u2248 ${property.priceUSD.toLocaleString()}
                  </p>
                )}
              </div>
              {property.bedrooms && (
                <div className="text-sm text-gray-600">
                  {property.bedrooms} bed \u2022 {property.bathrooms} bath
                </div>
              )}
            </div>
            {property.soldDate && (
              <p className="text-xs text-gray-500 mt-2">
                Sold on {new Date(property.soldDate).toLocaleDateString()}
              </p>
            )}
            {property.purchasedDate && (
              <p className="text-xs text-gray-500 mt-2">
                Purchased on{" "}
                {new Date(property.purchasedDate).toLocaleDateString()}
              </p>
            )}
            {property.rentStartDate && (
              <p className="text-xs text-gray-500 mt-2">
                Rented from{" "}
                {new Date(property.rentStartDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  };

  const tabs = [
    {
      id: "uploaded",
      label: "Uploaded for Sale",
      icon: Upload,
      count: uploadedForSale.length,
    },
    {
      id: "rent",
      label: "Uploaded for Rent",
      icon: Home,
      count: uploadedForRent.length,
    },
    {
      id: "bought",
      label: "Bought Properties",
      icon: ShoppingBag,
      count: boughtProperties.length,
    },
    {
      id: "rented",
      label: "Rented Properties",
      icon: Clock,
      count: rentedProperties.length,
    },
  ];

  const getProperties = () => {
    switch (activeTab) {
      case "uploaded":
        return uploadedForSale;
      case "rent":
        return uploadedForRent;
      case "bought":
        return boughtProperties;
      case "rented":
        return rentedProperties;
      default:
        return [];
    }
  };

  const properties = getProperties();

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
      <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 md:py-4 mb-4 md:mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                My Properties
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Manage all your properties
              </p>
            </div>
            <Link
              to="/app/upload"
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base min-h-[40px] md:min-h-[44px] bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors flex-shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 md:w-5 h-4 md:h-5" />
              <span className="hidden sm:inline">Add Listing</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-teal-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? "bg-white text-teal-700"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {properties.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Home className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties yet
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "uploaded"
                ? "Start selling by creating your first property listing"
                : activeTab === "rent"
                ? "Upload properties for rent"
                : activeTab === "bought"
                ? "You haven't purchased any properties yet"
                : "You haven't rented any properties yet"}
            </p>
            {(activeTab === "uploaded" || activeTab === "rent") && (
              <Link
                to="/app/upload"
                className="inline-block px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base min-h-[40px] md:min-h-[44px] bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors"
              >
                Create Listing
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <PropertyCardWithStatus
                key={property.id}
                property={property}
                type={activeTab}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
