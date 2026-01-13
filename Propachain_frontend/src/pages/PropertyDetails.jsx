import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  FileText,
  Video,
  Download,
  ExternalLink,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Play,
  Wallet,
  DollarSign,
  Calendar,
  User,
  Building,
} from "lucide-react";
import { mockProperties } from "../data/mockData";
import PropertyCard from "../components/common/PropertyCard";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = mockProperties.find((p) => p.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Mock blockchain data
  const escrowData = {
    isActive: true,
    amount: property?.price || 0,
    buyerDeposit: (property?.price || 0) * 0.1, // 10% deposit
    status: "pending_inspection",
    timeline: [
      { step: "Deposit Made", completed: true, date: "Jan 10, 2026" },
      { step: "Inspection Scheduled", completed: true, date: "Jan 12, 2026" },
      { step: "Inspection Approved", completed: false, date: "-" },
      { step: "Final Payment", completed: false, date: "-" },
      { step: "Transfer Complete", completed: false, date: "-" },
    ],
  };

  const documents = [
    {
      id: 1,
      name: "Certificate of Occupancy (C of O)",
      type: "PDF",
      size: "2.4 MB",
      verified: true,
    },
    { id: 2, name: "Survey Plan", type: "PDF", size: "1.8 MB", verified: true },
    {
      id: 3,
      name: "Building Approval",
      type: "PDF",
      size: "1.2 MB",
      verified: true,
    },
    {
      id: 4,
      name: "Land Registry",
      type: "PDF",
      size: "3.1 MB",
      verified: true,
    },
    {
      id: 5,
      name: "Property Tax Receipt",
      type: "PDF",
      size: "890 KB",
      verified: true,
    },
  ];

  const videos = [
    {
      id: 1,
      title: "Property Tour",
      thumbnail: property?.images[0],
      duration: "5:23",
    },
    {
      id: 2,
      title: "Neighborhood Overview",
      thumbnail: property?.images[1],
      duration: "3:45",
    },
    {
      id: 3,
      title: "Interior Walkthrough",
      thumbnail: property?.images[2],
      duration: "7:12",
    },
  ];

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h2>
          <Link
            to="/marketplace"
            className="text-teal-700 hover:text-teal-800 font-medium"
          >
            Browse All Properties
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (price >= 1000000) return `₦${(price / 1000000).toFixed(1)}M`;
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

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "escrow", label: "Escrow", badge: escrowData.isActive },
    { id: "documents", label: "Documents", count: documents.length },
    { id: "videos", label: "Videos", count: videos.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-2 md:py-3">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative bg-black group">
        {/* Check if current item is a video */}
        {currentImageIndex < property.images.length ? (
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-56 md:h-[500px] object-cover"
          />
        ) : (
          <div className="relative w-full h-56 md:h-[500px]">
            <video
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              controls
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-black bg-opacity-70 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm">
          {currentImageIndex + 1} /{" "}
          {property.images.length + (videos.length || 0)}
        </div>

        {/* Navigation Arrows */}
        {property.images.length + (videos.length || 0) > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-1.5 md:p-2 shadow-lg transition-all"
            >
              <ChevronLeft className="w-5 md:w-6 h-5 md:h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-1.5 md:p-2 shadow-lg transition-all"
            >
              <ChevronRight className="w-5 md:w-6 h-5 md:h-6" />
            </button>
          </>
        )}

        {/* Action Buttons - Only visible on hover */}
        <div className="absolute top-3 md:top-4 right-3 md:right-4 flex gap-1.5 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 md:p-2.5 shadow-lg transition-all">
            <Share2 className="w-4 md:w-5 h-4 md:h-5" />
          </button>
          <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 md:p-2.5 shadow-lg transition-all">
            <Heart className="w-4 md:w-5 h-4 md:h-5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-2 md:py-3 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-1.5 md:gap-2">
          {property.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-16 md:w-20 h-16 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                idx === currentImageIndex
                  ? "border-teal-700 opacity-100"
                  : "border-transparent opacity-60"
              }`}
            >
              <img
                src={img}
                alt={`View ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          {videos &&
            videos.map((video, idx) => (
              <button
                key={`video-${idx}`}
                onClick={() =>
                  setCurrentImageIndex(property.images.length + idx)
                }
                className={`relative w-16 md:w-20 h-16 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                  property.images.length + idx === currentImageIndex
                    ? "border-teal-700 opacity-100"
                    : "border-transparent opacity-60"
                }`}
              >
                <img
                  src={property.images[0]}
                  alt={`Video ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </button>
            ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Title & Price */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <div className="flex items-start justify-between gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="min-w-0">
                  <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 md:w-4 h-3.5 md:h-4 flex-shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 md:w-4 h-3.5 md:h-4 flex-shrink-0" />
                      <span>{property.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 md:w-4 h-3.5 md:h-4 flex-shrink-0" />
                      <span className="hidden sm:inline">
                        Listed {formatDate(property.listedDate)}
                      </span>
                      <span className="sm:hidden">
                        {formatDate(property.listedDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="px-2 md:px-3 py-1 md:py-1.5 bg-teal-100 text-teal-700 rounded-lg text-xs md:text-sm font-semibold uppercase flex-shrink-0">
                  {property.type}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3 md:pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-4xl font-bold text-teal-700">
                    {formatPrice(property.price)}
                  </span>
                  {property.type === "short-let" && (
                    <span className="text-lg text-gray-600">/night</span>
                  )}
                  {property.type === "rent" && (
                    <span className="text-lg text-gray-600">/year</span>
                  )}
                </div>
                {escrowData.isActive && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">
                      Protected by Blockchain Escrow
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Property Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
                Property Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {property.bedrooms && (
                  <div className="flex flex-col gap-2">
                    <Bed className="w-6 h-6 text-teal-700" />
                    <div>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {property.bedrooms}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Bedrooms</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex flex-col gap-2">
                    <Bath className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {property.bathrooms}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Bathrooms</p>
                    </div>
                  </div>
                )}
                {property.area && (
                  <div className="flex flex-col gap-2">
                    <Maximize className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {property.area}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">sqm</p>
                    </div>
                  </div>
                )}
                {property.type && (
                  <div className="flex flex-col gap-2">
                    <Building className="w-6 h-6 text-gray-700" />
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-gray-900 capitalize">
                        {property.type}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Type</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 overflow-x-auto">
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-medium whitespace-nowrap transition-colors relative ${
                        activeTab === tab.id
                          ? "text-teal-700 border-b-2 border-teal-700"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 md:gap-2">
                        {tab.label}
                        {tab.badge && (
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                        {tab.count && (
                          <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
                            {tab.count}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 md:p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {property.description}
                      </p>
                    </div>

                    {property.features && property.features.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          Features & Amenities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {property.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Escrow Tab */}
                {activeTab === "escrow" && (
                  <div className="space-y-6">
                    {escrowData.isActive ? (
                      <>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-green-900 mb-1">
                                Escrow Active
                              </h4>
                              <p className="text-sm text-green-700">
                                This transaction is protected by
                                blockchain-based smart contract escrow. Funds
                                are secure until all conditions are met.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div className="border border-gray-200 rounded-lg p-3 md:p-4">
                            <p className="text-xs md:text-sm text-gray-600 mb-1">
                              Total Amount
                            </p>
                            <p className="text-xl md:text-2xl font-bold text-gray-900">
                              {formatPrice(escrowData.amount)}
                            </p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-3 md:p-4">
                            <p className="text-xs md:text-sm text-gray-600 mb-1">
                              Deposited
                            </p>
                            <p className="text-xl md:text-2xl font-bold text-teal-700">
                              {formatPrice(escrowData.buyerDeposit)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">
                            Transaction Timeline
                          </h4>
                          <div className="space-y-4">
                            {escrowData.timeline.map((item, idx) => (
                              <div key={idx} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      item.completed
                                        ? "bg-green-600"
                                        : "bg-gray-300"
                                    }`}
                                  >
                                    {item.completed ? (
                                      <Check className="w-5 h-5 text-white" />
                                    ) : (
                                      <div className="w-3 h-3 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                  {idx < escrowData.timeline.length - 1 && (
                                    <div
                                      className={`w-0.5 h-12 ${
                                        item.completed
                                          ? "bg-green-600"
                                          : "bg-gray-300"
                                      }`}
                                    ></div>
                                  )}
                                </div>
                                <div className="flex-1 pb-8">
                                  <p
                                    className={`font-medium ${
                                      item.completed
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {item.step}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {item.date}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button className="flex-1 px-4 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors">
                            Continue Transaction
                          </button>
                          <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            View Contract
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Lock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          No Active Escrow
                        </h4>
                        <p className="text-gray-600 mb-6">
                          Start a secure transaction with blockchain-based
                          escrow protection
                        </p>
                        <button className="px-6 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors">
                          Initiate Escrow
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === "documents" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">
                            All Documents Verified
                          </h4>
                          <p className="text-sm text-blue-700">
                            Property documents have been verified and stored on
                            the blockchain for transparency
                          </p>
                        </div>
                      </div>
                    </div>

                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 md:w-12 h-10 md:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 md:w-6 h-5 md:h-6 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm md:text-base text-gray-900 truncate">
                              {doc.name}
                            </p>
                            {doc.verified && (
                              <CheckCircle className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs md:text-sm text-gray-500">
                            {doc.type} • {doc.size}
                          </p>
                        </div>
                        <div className="flex gap-1 md:gap-2 flex-shrink-0">
                          <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
                          </button>
                          <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
                          </button>
                          <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
                            <ExternalLink className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Videos Tab */}
                {activeTab === "videos" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="relative group cursor-pointer rounded-lg overflow-hidden"
                        onClick={() => setShowVideoModal(true)}
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-teal-700 ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                          <p className="text-white font-medium mb-1">
                            {video.title}
                          </p>
                          <p className="text-white text-sm">{video.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Seller Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 lg:sticky lg:top-4">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                Listed By
              </h3>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-700 font-bold text-base md:text-lg">
                    {property.seller?.name?.charAt(0) || "S"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">
                    {property.seller?.name || "Property Owner"}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Verified Seller</span>
                  </div>
                </div>
              </div>

              {!showContact ? (
                <button
                  onClick={() => setShowContact(true)}
                  className="w-full px-4 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  <Phone className="w-5 h-5" />
                  <span>Show Contact</span>
                </button>
              ) : (
                <div className="space-y-3 mb-3">
                  <a
                    href="tel:+2348012345678"
                    className="w-full px-4 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Seller</span>
                  </a>
                  <a
                    href="mailto:seller@example.com"
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Email</span>
                  </a>
                </div>
              )}

              <button
                onClick={() => navigate("/app/transactions")}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Send Message</span>
              </button>

              {!escrowData.isActive && (
                <>
                  <div className="my-4 border-t border-gray-200"></div>
                  <button
                    onClick={() => navigate("/app/wallet")}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Buy with Escrow</span>
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Protected by blockchain smart contract
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Similar Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
