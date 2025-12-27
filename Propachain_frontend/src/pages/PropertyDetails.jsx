import { useParams } from "react-router-dom";
import {
  MapPin,
  Share2,
  Heart,
  FileText,
  ShieldCheck,
  Clock,
  Loader2,
  Home,
  X,
  Eye,
  Lock,
  Video,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { StatusBadge } from "../components/common/StatusBadge";
import { CountdownTimer } from "../components/common/CountdownTimer";
import { PurchaseModal } from "../components/features/PurchaseModal";
import { EscrowActions } from "../components/features/EscrowActions";
import { useState, useEffect } from "react";
import { useFetchProperties } from "../hooks/useFetchProperties";
import { useEscrows } from "../hooks/useEscrows";
import { useMovementWallet } from "../hooks/useMovementWallet";
import { addressesEqual } from "../utils/helper";

const GATEWAY_URL = import.meta.env.VITE_PINATA_GATEWAY;

export default function PropertyDetails() {
  const { id } = useParams();
  const { fetchPropertyById } = useFetchProperties();
  const { fetchEscrowById } = useEscrows();
  const { walletAddress } = useMovementWallet();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [escrowId, setEscrowId] = useState(null);
  const [escrowData, setEscrowData] = useState(null);
  const [canViewDocuments, setCanViewDocuments] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showVideoViewer, setShowVideoViewer] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        const formattedProperty = await fetchPropertyById(id);

        if (formattedProperty) {
          // Add extra fields needed for details page that aren't in the standard format
          formattedProperty.rentPrice = formattedProperty.monthlyRent || 0;
          formattedProperty.rentalPeriod =
            formattedProperty.rentalPeriodMonths || 0;
          formattedProperty.features = formattedProperty.propertyType
            ? [
                formattedProperty.propertyType,
                "Blockchain Verified",
                "Smart Contract Protected",
              ]
            : ["Blockchain Verified", "Smart Contract Protected"];
          formattedProperty.documents = formattedProperty.documentsCid
            ? [
                {
                  name: "Property Documents",
                  size: "View on IPFS",
                  cid: formattedProperty.documentsCid,
                },
              ]
            : [];
          formattedProperty.propertyStatus = formattedProperty.status;

          setProperty(formattedProperty);

          if (formattedProperty.escrowId) {
            setEscrowId(formattedProperty.escrowId);

            // Fetch escrow data
            try {
              const escrow = await fetchEscrowById(formattedProperty.escrowId);
              setEscrowData(escrow);
            } catch (error) {
              console.error("Error fetching escrow:", error);
            }
          }
        } else {
          setError("Property not found");
        }
      } catch (err) {
        console.error("Error loading property:", err);
        setError(err.message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProperty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Separate effect to check document access when wallet connects
  useEffect(() => {
    if (property && walletAddress && property.owner) {
      console.log("Document access check (wallet effect):", {
        rawWallet: walletAddress,
        rawOwner: property.owner,
        match: addressesEqual(walletAddress, property.owner),
      });

      // Use addressesEqual directly - it handles normalization internally
      if (addressesEqual(walletAddress, property.owner)) {
        console.log("✅ Access granted - user is property owner");
        setCanViewDocuments(true);
      } else {
        console.log("❌ Access denied - user is not property owner");
        setCanViewDocuments(false);
      }
    } else {
      console.log("Wallet effect - Missing data:", {
        hasProperty: !!property,
        hasWallet: !!walletAddress,
        hasOwner: !!property?.owner,
      });
      setCanViewDocuments(false);
    }
  }, [property, walletAddress]);

  const handleStatusChange = () => {
    // window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-teal-700" size={48} />
          <p className="text-zinc-600 font-medium">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-zinc-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">
            Error Loading Property
          </h2>
          <p className="text-zinc-600 mb-6">{error}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-zinc-200 p-8 text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-zinc-600 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => (window.location.href = "/marketplace")}>
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-semibold text-zinc-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <MapPin size={18} className="text-teal-700" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                    <Heart size={20} className="text-zinc-600" />
                  </button>
                  <button className="p-2.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                    <Share2 size={20} className="text-zinc-600" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge
                  status={property.propertyStatus}
                  listingType={property.listing_type}
                />
                <span className="text-sm text-zinc-500">
                  Property ID: #{property.id.toString().padStart(4, "0")}
                </span>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              <div className="aspect-video relative bg-zinc-100">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[activeImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-400">
                    <Home size={64} />
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {property.images && property.images.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto">
                  {property.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === i
                          ? "border-teal-700 ring-2 ring-teal-700/20"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Stats */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-6">
                Property Details
              </h3>

              <div className="border-t border-zinc-200 pt-6">
                <h4 className="font-semibold text-zinc-900 mb-3">
                  About This Property
                </h4>
                <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>

              <div className="border-t border-zinc-200 pt-6 mt-6">
                <h4 className="font-semibold text-zinc-900 mb-3">
                  Features & Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Inspection Video */}
            {property.videoCid && (
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                  Property Inspection Video
                </h3>
                <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-50 text-purple-700 rounded-lg">
                      <Video size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">
                        Property Walkthrough
                      </p>
                      <p className="text-xs text-zinc-500">
                        Available for all viewers
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVideoViewer(true)}
                    className="flex items-center gap-2"
                  >
                    <Eye size={16} />
                    Watch Video
                  </Button>
                </div>
              </div>
            )}

            {/* Documents - Only for sale properties */}
            {property.listing_type === 1 && property.documents.length > 0 && (
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                  Property Documents
                </h3>
                {canViewDocuments ? (
                  <div className="space-y-3">
                    {property.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 bg-zinc-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-lg">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-zinc-900">
                              {doc.name}
                            </p>
                            <p className="text-xs text-teal-600">
                              ✓ Access Granted
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDocumentViewer(true)}
                          className="flex items-center gap-2"
                        >
                          <Eye size={16} />
                          View Document
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-zinc-50 rounded-lg border border-zinc-200">
                    <div className="w-12 h-12 bg-zinc-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Lock size={20} className="text-zinc-500" />
                    </div>
                    <p className="text-sm font-medium text-zinc-900 mb-1">
                      Documents Locked
                    </p>
                    <p className="text-xs text-zinc-600">
                      Property documents are only accessible to the property
                      owner
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Action Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-zinc-200 p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-zinc-500 mb-2">
                  {property.listing_type === 2 ? "Monthly Rent" : "Sale Price"}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold text-teal-700">
                    {property.listing_type === 2
                      ? (property.monthlyRent || 0).toLocaleString()
                      : property.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-zinc-500">MOVE</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {property.propertyStatus === 1 ? (
                  property.listing_type === 1 ? (
                    <Button
                      className="w-full h-12 text-base"
                      onClick={() => setIsPurchaseModalOpen(true)}
                    >
                      Purchase Property
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      className="w-full h-12 text-base"
                      onClick={() => setIsPurchaseModalOpen(true)}
                    >
                      Rent Property
                    </Button>
                  )
                ) : (
                  <div className="p-4 bg-zinc-100 rounded-lg text-center">
                    <p className="text-sm text-zinc-700 font-medium">
                      {property.propertyStatus === 2 && "In Escrow Process"}
                      {property.propertyStatus === 3 && "Sold"}
                      {property.propertyStatus === 4 && "Currently Rented"}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    className="text-teal-700 shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 mb-1">
                      Escrow Protected
                    </p>
                    <p className="text-xs text-zinc-600">
                      Your funds are secured in a smart contract until ownership
                      transfer is completed.
                    </p>
                  </div>
                </div>
              </div>

              {property.listing_type === 2 &&
                property.propertyStatus === 4 &&
                property.rentalEndDate &&
                escrowData &&
                walletAddress &&
                addressesEqual(walletAddress, escrowData.buyer_renter) && (
                  <div className="mt-6 pt-6 border-t border-zinc-200">
                    <div className="flex items-center gap-2 mb-3 text-zinc-900 font-medium text-sm">
                      <Clock size={16} className="text-teal-700" /> Rental
                      Period Ends
                    </div>
                    <CountdownTimer
                      targetDate={
                        new Date(parseInt(property.rentalEndDate) * 1000)
                      }
                      className="justify-between"
                    />
                  </div>
                )}
            </div>

            {/* Escrow Actions */}
            {escrowId && property.propertyStatus === 2 && (
              <EscrowActions
                property={property}
                escrowId={escrowId}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </div>
      </div>

      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        property={property}
      />

      {/* Document Viewer Modal */}
      {showDocumentViewer && property.documents.length > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-teal-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">
                    {property.documents[0].name}
                  </h3>
                  <p className="text-xs text-zinc-500">Stored on IPFS</p>
                </div>
              </div>
              <button
                onClick={() => setShowDocumentViewer(false)}
                className="w-9 h-9 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-zinc-600" />
              </button>
            </div>

            {/* Document Viewer */}
            <div className="flex-1 overflow-hidden bg-zinc-100">
              <iframe
                src={`https://${GATEWAY_URL}/ipfs/${property.documents[0].cid}`}
                className="w-full h-full border-0"
                title="Property Documents"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <p className="text-xs text-zinc-600">
                Document CID:{" "}
                <span className="font-mono text-zinc-900">
                  {typeof property.documents[0].cid === "object"
                    ? property.documents[0].cid?.vec?.[0] || "N/A"
                    : property.documents[0].cid || "N/A"}
                </span>
              </p>
              <Button onClick={() => setShowDocumentViewer(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Video Viewer Modal */}
      {showVideoViewer && property.videoCid && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Video size={20} className="text-purple-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">
                    Property Inspection Video
                  </h3>
                  <p className="text-xs text-zinc-500">Stored on IPFS</p>
                </div>
              </div>
              <button
                onClick={() => setShowVideoViewer(false)}
                className="w-9 h-9 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-zinc-600" />
              </button>
            </div>

            {/* Video Player */}
            <div className="flex-1 overflow-hidden bg-black flex items-center justify-center">
              <video
                src={`https://${GATEWAY_URL}/ipfs/${property.videoCid}`}
                controls
                className="max-w-full max-h-full"
                playsInline
                preload="metadata"
                onError={(e) => {
                  console.error("Video failed to load:", e);
                  console.log(
                    "Video URL:",
                    `${GATEWAY_URL}${property.videoCid}`
                  );
                }}
              >
                <source
                  src={`${GATEWAY_URL}${property.videoCid}`}
                  type="video/mp4"
                />
                <source
                  src={`${GATEWAY_URL}${property.videoCid}`}
                  type="video/webm"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <p className="text-xs text-zinc-600">
                Video CID:{" "}
                <span className="font-mono text-zinc-900">
                  {property.videoCid}
                </span>
              </p>
              <Button onClick={() => setShowVideoViewer(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
