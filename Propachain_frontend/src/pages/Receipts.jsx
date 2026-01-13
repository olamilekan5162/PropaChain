import { useState } from "react";
import {
  FileText,
  Eye,
  Calendar,
  DollarSign,
  Home as HomeIcon,
  ShoppingBag,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const orders = [
    {
      id: 1,
      propertyTitle: "5 Bedroom Duplex in Lekki Phase 1",
      propertyImage:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
      amount: "85,000,000",
      date: "Jan 10, 2026",
      transactionHash: "0x8f7d...3a2c",
      type: "bought",
      status: "completed",
      buyer: "You",
      seller: "Jane Smith",
      escrowStatus: null,
    },
    {
      id: 2,
      propertyTitle: "3 Bedroom Flat in Victoria Island",
      propertyImage:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
      amount: "50,000,000",
      date: "Jan 5, 2026",
      transactionHash: "0x2b4e...9f1a",
      type: "bought",
      status: "escrow",
      buyer: "You",
      seller: "Mike Johnson",
      escrowStatus: "awaiting-confirmation",
    },
    {
      id: 3,
      propertyTitle: "2 Bedroom Apartment in Ikeja",
      propertyImage:
        "https://images.unsplash.com/photo-1502672260066-6bc35f0ce77c?w=400",
      amount: "25,000,000",
      date: "Dec 28, 2025",
      transactionHash: "0x5c3d...7e8b",
      type: "sold",
      status: "completed",
      buyer: "Sarah Williams",
      seller: "You",
    },
    {
      id: 4,
      propertyTitle: "Luxury Apartment in Ikoyi",
      propertyImage:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
      amount: "120,000,000",
      date: "Jan 8, 2026",
      transactionHash: "0x9a2f...4b6c",
      type: "sold",
      status: "escrow",
      buyer: "David Brown",
      seller: "You",
      escrowStatus: "awaiting-confirmation",
    },
    {
      id: 5,
      propertyTitle: "4 Bedroom House in Ajah",
      propertyImage:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400",
      amount: "3,500,000",
      rentalPeriod: "annually",
      date: "Jan 1, 2026",
      rentEndDate: "Dec 31, 2026",
      transactionHash: "0x3e7a...8d1f",
      type: "rented-out",
      status: "active",
      tenant: "Michael Chen",
      landlord: "You",
      daysRemaining: 352,
    },
    {
      id: 6,
      propertyTitle: "Office Space in Lagos Island",
      propertyImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
      amount: "2,000,000",
      rentalPeriod: "monthly",
      date: "Dec 20, 2025",
      transactionHash: "0x6c4b...2a9e",
      type: "bought",
      status: "escrow",
      buyer: "You",
      seller: "Property Corp Ltd",
      escrowStatus: "disputed",
    },
  ];

  const getFilteredOrders = () => {
    if (activeTab === "all") return orders;
    if (activeTab === "bought")
      return orders.filter((o) => o.type === "bought");
    if (activeTab === "sold") return orders.filter((o) => o.type === "sold");
    if (activeTab === "rented")
      return orders.filter((o) => o.type === "rented-out");
    if (activeTab === "escrow")
      return orders.filter((o) => o.status === "escrow");
    return orders;
  };

  const filteredOrders = getFilteredOrders();

  const getStatusBadge = (order) => {
    if (order.status === "completed") {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Completed
        </span>
      );
    }
    if (order.status === "escrow") {
      if (order.escrowStatus === "disputed") {
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Disputed
          </span>
        );
      }
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" /> In Escrow
        </span>
      );
    }
    if (order.status === "active") {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" /> Active Rental
        </span>
      );
    }
  };

  const handleCompleteTransaction = (orderId) => {
    console.log("Completing transaction:", orderId);
    // Blockchain transaction logic here
  };

  const handleRaiseDispute = (orderId) => {
    console.log("Raising dispute for:", orderId);
    // Dispute logic here
  };

  const viewReceipt = (order) => {
    setSelectedReceipt(order);
  };

  const tabs = [
    { id: "all", label: "All Orders", icon: Package, count: orders.length },
    {
      id: "bought",
      label: "Bought",
      icon: ShoppingBag,
      count: orders.filter((o) => o.type === "bought").length,
    },
    {
      id: "sold",
      label: "Sold",
      icon: DollarSign,
      count: orders.filter((o) => o.type === "sold").length,
    },
    {
      id: "rented",
      label: "Rented Out",
      icon: HomeIcon,
      count: orders.filter((o) => o.type === "rented-out").length,
    },
    {
      id: "escrow",
      label: "In Escrow",
      icon: Clock,
      count: orders.filter((o) => o.status === "escrow").length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
      <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 md:py-4 mb-4 md:mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            Orders
          </h1>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            View and manage all your property transactions
          </p>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-teal-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs ${
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

      <div className="max-w-7xl mx-auto px-3 md:px-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12 text-center">
            <Package className="w-12 md:w-16 h-12 md:h-16 mx-auto text-gray-400 mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
              Your property transactions will appear here
            </p>
            <Link
              to="/marketplace"
              className="inline-block px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base min-h-[44px] md:min-h-12 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-3 md:p-6">
                  <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
                    {/* Property Image */}
                    <img
                      src={order.propertyImage}
                      alt={order.propertyTitle}
                      className="w-full md:w-24 h-40 md:h-24 rounded-lg object-cover flex-shrink-0"
                    />

                    {/* Order Details */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4 mb-2 md:mb-3">
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-1 line-clamp-2">
                            {order.propertyTitle}
                          </h3>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {getStatusBadge(order)}
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium capitalize">
                              {order.type.replace("-", " ")}
                            </span>
                            {order.daysRemaining && (
                              <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                                {order.daysRemaining} days left
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-xl md:text-2xl font-bold text-teal-700">
                            ₦{order.amount}
                          </p>
                          {order.rentalPeriod && (
                            <p className="text-xs text-gray-500">
                              per {order.rentalPeriod}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4 text-xs md:text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                          <span>{order.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                          <code className="font-mono text-xs truncate">
                            {order.transactionHash}
                          </code>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                        {order.buyer && (
                          <div>
                            <span className="text-gray-500">Buyer:</span>
                            <span className="font-medium text-gray-900 ml-1">
                              {order.buyer}
                            </span>
                          </div>
                        )}
                        {order.seller && (
                          <div>
                            <span className="text-gray-500">Seller:</span>
                            <span className="font-medium text-gray-900 ml-1">
                              {order.seller}
                            </span>
                          </div>
                        )}
                        {order.tenant && (
                          <div>
                            <span className="text-gray-500">Tenant:</span>
                            <span className="font-medium text-gray-900 ml-1">
                              {order.tenant}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
                        {order.status === "escrow" &&
                          order.escrowStatus !== "disputed" && (
                            <>
                              <button
                                onClick={() =>
                                  handleCompleteTransaction(order.id)
                                }
                                className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors"
                              >
                                <CheckCircle className="w-3 md:w-4 h-3 md:h-4" />
                                <span>Complete Transaction</span>
                              </button>
                              <button
                                onClick={() => handleRaiseDispute(order.id)}
                                className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
                              >
                                <AlertTriangle className="w-3 md:w-4 h-3 md:h-4" />
                                <span>Raise Dispute</span>
                              </button>
                            </>
                          )}
                        {order.status === "completed" && (
                          <button
                            onClick={() => viewReceipt(order)}
                            className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors"
                          >
                            <FileText className="w-3 md:w-4 h-3 md:h-4" />
                            <span>View Receipt</span>
                          </button>
                        )}
                        <Link
                          to={`/property/${order.id}`}
                          className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          <HomeIcon className="w-3 md:w-4 h-3 md:h-4" />
                          <span>View Property</span>
                        </Link>
                        <a
                          href={`https://explorer.movementnetwork.xyz/tx/${order.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-3 md:w-4 h-3 md:h-4" />
                          <span className="hidden sm:inline">
                            View on Explorer
                          </span>
                          <span className="sm:hidden">Explorer</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                Transaction Receipt
              </h3>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 md:p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Transaction Completed
                </h4>
                <p className="text-gray-600">{selectedReceipt.date}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Property</span>
                  <span className="font-medium text-gray-900 text-right">
                    {selectedReceipt.propertyTitle}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-teal-700 text-xl">
                    ₦{selectedReceipt.amount}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Transaction Hash</span>
                  <code className="font-mono text-sm text-gray-900">
                    {selectedReceipt.transactionHash}
                  </code>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Buyer</span>
                  <span className="font-medium text-gray-900">
                    {selectedReceipt.buyer}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Seller</span>
                  <span className="font-medium text-gray-900">
                    {selectedReceipt.seller}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Completed
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-600 text-center">
                  This receipt is stored on the blockchain and cannot be
                  modified. You can verify this transaction on the Movement
                  Network Explorer.
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href={`https://explorer.movementnetwork.xyz/tx/${selectedReceipt.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View on Explorer</span>
                </a>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="flex-1 px-4 py-2.5 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
