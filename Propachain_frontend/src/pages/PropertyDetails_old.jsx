import { useParams } from "react-router-dom";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Share2,
  Heart,
  FileText,
  ShieldCheck,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { StatusBadge } from "../components/common/StatusBadge";
import { CountdownTimer } from "../components/common/CountdownTimer";
import { PurchaseModal } from "../components/features/PurchaseModal";
import { EscrowActions } from "../components/features/EscrowActions";
import { useState, useEffect } from "react";
import { useFetchProperties } from "../hooks/useFetchProperties";
import { usePropertyOperations } from "../hooks/usePropertyOperations";

const GATEWAY_URL = import.meta.env.VITE_PINATA_GATEWAY;

export default function PropertyDetails() {
  const { id } = useParams();
  const { fetchPropertyById } = useFetchProperties();
  const { getPropertyStatus } = usePropertyOperations();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [escrowId, setEscrowId] = useState(null);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        const data = await fetchPropertyById(id);
        if (data) {
          // Verify if data.images exists and is an array, otherwise fallback
          // Assuming the contract returns CIDs in 'images' field which might be a vector<string>
          const images =
            data.images_cids && data.images_cids.length > 0
              ? data.images_cids.map(
                  (cid) => `https://${GATEWAY_URL}/ipfs/${cid}`
                )
              : [
                  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
                ]; // Fallback

          // Transform blockchain data to UI format
          const formattedProperty = {
            id: id,
            title: data.description
              ? data.description.substring(0, 50) +
                (data.description.length > 50 ? "..." : "")
              : "Property #" + id,
            description: data.description || "No description available.",
            location: data.property_address || "Unknown Location",
            price: parseInt(data.price || 0) / 100_000_000,
            rentPrice: data.monthly_rent
              ? parseInt(data.monthly_rent) / 100_000_000
              : 0,
            rentalPeriod: data.rental_period_months || 0,
            depositRequired: data.deposit_required
              ? parseInt(data.deposit_required) / 100_000_000
              : 0,
            images: images,
            beds: 3,
            baths: 2,
            sqft: 2200,
            status: data.listing_type === 1 ? "For Sale" : "For Rent",
            propertyType: data.property_type || "Residential",
            features: data.property_type
              ? [
                  data.property_type,
                  "Blockchain Verified",
                  "Smart Contract Protected",
                ]
              : ["Blockchain Verified", "Smart Contract Protected"],
            documents: data.documents_cid
              ? [
                  {
                    name: "Property Documents",
                    size: "View on IPFS",
                    cid: data.documents_cid,
                  },
                ]
              : [],
            listingType: data.listing_type,
            escrowId: data.escrow_id?.vec?.[0],
            propertyStatus: data.status,
            owner: data.owner,
            createdAt: data.created_at,
          };
          setProperty(formattedProperty);

          // Set escrow ID if property is in escrow
          if (formattedProperty.escrowId) {
            setEscrowId(formattedProperty.escrowId);
          }
        } else {
          setError("Property not found on chain.");
        }
      } catch (err) {
        console.error("Error loading property:", err);
        setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProperty();
    }
  }, [id]);

  const handleStatusChange = () => {
    // Reload property data when escrow status changes
    // window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Property Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          {error || "The property you are looking for does not exist."}
        </p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {property.title}
          </h1>
          <div className="flex items-center text-gray-500">
            <MapPin size={18} className="mr-1" />
            {property.location}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="bg-white">
            <Share2 size={18} />
          </Button>
          <Button variant="secondary" className="bg-white">
            <Heart size={18} />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Gallery & Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-sm bg-gray-100">
              <img
                src={property.images[activeImage]}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800";
                }}
              />
            </div>
            {property.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent opacity-70 hover:opacity-100"
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

          {/* Key Features */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Property Features
            </h3>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-50 rounded-xl text-gray-500">
                  <Bed size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-semibold text-gray-900">{property.beds}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-50 rounded-xl text-gray-500">
                  <Bath size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-semibold text-gray-900">
                    {property.baths}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-50 rounded-xl text-gray-500">
                  <Square size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Square Area</p>
                  <p className="font-semibold text-gray-900">
                    {property.sqft} sqft
                  </p>
                </div>
              </div>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">
              {property.description}
            </p>

            <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Documents */}
          {property.documents.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Property Documents (IPFS)
              </h3>
              <div className="space-y-3">
                {property.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={`${GATEWAY_URL}${doc.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group cursor-pointer text-decoration-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Action Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg shadow-gray-200/50 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <StatusBadge status={property.status} />
              <span className="text-xs font-mono text-gray-400">
                ID: #{property.id.toString().padStart(4, "0")}
              </span>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-1">
                {property.listingType === 2 ? "Monthly Rent" : "Buy Price"}
              </p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-primary">
                  {property.listingType === 2
                    ? property.rentPrice.toLocaleString()
                    : property.price.toLocaleString()}
                </span>
                <span className="text-sm font-medium text-gray-400 mb-1">
                  MOVE
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {property.propertyStatus === 1 ? (
                // Property is available - show buy/rent button
                property.listingType === 1 ? (
                  <Button
                    className="w-full text-lg h-12"
                    onClick={() => setIsPurchaseModalOpen(true)}
                  >
                    Buy Property Now
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full text-lg h-12"
                    onClick={() => setIsPurchaseModalOpen(true)}
                  >
                    Rent for {property.rentPrice} MOVE/mo
                  </Button>
                )
              ) : (
                // Property is not available
                <div className="p-3 bg-gray-100 rounded-lg text-center">
                  <p className="text-sm text-gray-600 font-medium">
                    {property.propertyStatus === 2 && "Property in Escrow"}
                    {property.propertyStatus === 3 && "Property Sold"}
                    {property.propertyStatus === 4 && "Property Rented"}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  className="text-emerald-500 shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Protected by Escrow
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Funds are held in a smart contract until all conditions are
                    met and ownership is transferred.
                  </p>
                </div>
              </div>
            </div>

            {/* Example Countdown for Rental (Hidden if not relevant, showing for demo) */}
            {property.listingType === 2 && property.propertyStatus === 1 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3 text-gray-900 font-medium">
                  <Clock size={16} /> Auction / Rental Ends
                </div>
                <CountdownTimer
                  targetDate={new Date(Date.now() + 86400000 * 3)}
                  className="justify-between"
                />
              </div>
            )}
          </div>

          {/* Escrow Actions - Show if property is in escrow */}
          {escrowId && property.propertyStatus === 2 && (
            <EscrowActions
              property={property}
              escrowId={escrowId}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>

      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        property={property}
      />
    </div>
  );
}
