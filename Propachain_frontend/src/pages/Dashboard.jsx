import { Link } from "react-router-dom";
import { TrendingUp, Package, MessageSquare, Eye } from "lucide-react";
import { mockProperties } from "../data/mockData";
import PropertyCard from "../components/common/PropertyCard";

export default function Dashboard() {
  const stats = [
    {
      label: "Total Listings",
      value: "3",
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Views",
      value: "1,234",
      icon: Eye,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Messages",
      value: "12",
      icon: MessageSquare,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "This Month",
      value: "+15%",
      icon: TrendingUp,
      color: "bg-teal-100 text-teal-700",
    },
  ];

  const recentListings = mockProperties.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
      <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 md:py-4 mb-4 md:mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Welcome back! Here's your overview
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4 md:p-6"
              >
                <div
                  className={`w-10 md:w-12 h-10 md:h-12 ${stat.color} rounded-lg flex items-center justify-center mb-2 md:mb-3`}
                >
                  <Icon className="w-5 md:w-6 h-5 md:h-6" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Listings */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Recent Listings
            </h2>
            <Link
              to="/app/my-properties"
              className="text-teal-700 text-sm md:text-base font-medium hover:text-teal-800"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {recentListings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/app/upload"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-700 hover:bg-teal-50 transition-all text-center"
            >
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold text-gray-900">List Property</div>
              <div className="text-sm text-gray-600">Add a new listing</div>
            </Link>
            <Link
              to="/marketplace"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-700 hover:bg-teal-50 transition-all text-center"
            >
              <Eye className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold text-gray-900">
                Browse Properties
              </div>
              <div className="text-sm text-gray-600">
                Find properties to buy
              </div>
            </Link>
            <Link
              to="/app/transactions"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-700 hover:bg-teal-50 transition-all text-center"
            >
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold text-gray-900">Messages</div>
              <div className="text-sm text-gray-600">Check your messages</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
