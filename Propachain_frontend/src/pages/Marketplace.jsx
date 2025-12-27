import { Search, SlidersHorizontal, Map, Loader } from "lucide-react";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { PropertyCard } from "../components/common/PropertyCard";
import { useState, useEffect } from "react";
import { useFetchProperties } from "../hooks/useFetchProperties";
import toast from "react-hot-toast";

const GATEWAY_URL = import.meta.env.VITE_PINATA_GATEWAY;

export default function Marketplace() {
  const { fetchAllProperties } = useFetchProperties();
  const [properties, setProperties] = useState([]);
  const [displayedProperties, setDisplayedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all"); // all, buy (sale), rent
  const [searchLocation, setSearchLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const props = await fetchAllProperties();

      // Transform blockchain data to UI format
      const formattedProps = props
        .filter((p) => p.status === 1 || p.status === 2) // Available or In Escrow
        .map((p) => ({
          id: p.id,
          title: p.description
            ? p.description.substring(0, 50) +
              (p.description.length > 50 ? "..." : "")
            : `Property #${p.id}`,
          location: p.property_address || "Location not specified",
          price: parseInt(p.price || 0) / 100_000_000,
          rentPrice: p.monthly_rent
            ? parseInt(p.monthly_rent) / 100_000_000
            : 0,
          image:
            p.images_cids && p.images_cids.length > 0
              ? `https://${GATEWAY_URL}/ipfs/${p.images_cids[0]}`
              : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
          beds: 3,
          baths: 2,
          sqft: 2200,
          status:
            p.status === 1
              ? "Available"
              : p.status === 2
              ? "In Escrow"
              : p.status === 3
              ? "Sold"
              : "Rented",
          listingType: p.listing_type,
          propertyType: p.property_type,
          owner: p.owner,
        }));

      setProperties(formattedProps);
      setDisplayedProperties(formattedProps);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      toast.error("Failed to load properties");
      setProperties([]);
      setDisplayedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Transform blockchain property data to match PropertyCard format
  const transformedProperties = displayedProperties.map((prop) => ({
    id: prop.id,
    title: prop.description?.substring(0, 50) || "Property",
    location: prop.property_address || "Unknown Location",
    price: parseInt(prop.price) / 100_000_000, // Convert from octas
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800", // Placeholder
    beds: 3, // Would need to parse from description
    baths: 2,
    sqft: 2200,
    status: prop.listing_type === 1 ? "For Sale" : "For Rent",
    monthlyRent:
      prop.listing_type === 2
        ? parseInt(prop.monthly_rent || 0) / 100_000_000
        : null,
  }));

  // Apply filters
  const filteredProperties = transformedProperties.filter((prop) => {
    // Filter by listing type
    if (filterType === "sale" && prop.status !== "For Sale") return false;
    if (filterType === "rent" && prop.status !== "For Rent") return false;

    // Filter by location (case-insensitive)
    if (
      searchLocation &&
      !prop.location.toLowerCase().includes(searchLocation.toLowerCase())
    ) {
      return false;
    }

    // Filter by price range
    if (minPrice && prop.price < parseFloat(minPrice)) return false;
    if (maxPrice && prop.price > parseFloat(maxPrice)) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketplace</h1>
          <p className="text-slate-500">
            Discover and trade real estate on Movement.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filterType === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("buy")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filterType === "buy"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setFilterType("rent")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filterType === "rent"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Rent
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 h-fit">
          <div className="flex items-center gap-2 text-slate-900 font-semibold pb-4 border-b border-slate-100">
            <SlidersHorizontal size={20} />
            Filters
          </div>

          <div className="space-y-4">
            <Input
              label="Search Location"
              placeholder="City, Address..."
              icon={Search}
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Price Range (MOVE)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="w-full"
              onClick={loadProperties}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh Properties"}
            </Button>
          </div>
        </div>

        {/* Property Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-primary" size={32} />
            </div>
          ) : displayedProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No properties found</p>
              <p className="text-slate-400 text-sm mt-2">
                Try adjusting your filters or list a new property
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>

              <div className="mt-8 text-center text-sm text-slate-500">
                Showing {displayedProperties.length} of {properties.length}{" "}
                properties
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
