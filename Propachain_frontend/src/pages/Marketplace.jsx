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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters whenever filter criteria changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, searchLocation, minPrice, maxPrice, properties]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const props = await fetchAllProperties();

      // Filter to show only available properties (status 1)
      const availableProps = props.filter((p) => p.status === 1);

      setProperties(availableProps);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      toast.error("Failed to load properties");
      setProperties([]);
      setDisplayedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    // Filter by listing type (sale/rent)
    // listing_type: 1 = Sale, 2 = Rent
    if (filterType === "buy") {
      filtered = filtered.filter((p) => p.listing_type === 1);
    } else if (filterType === "rent") {
      filtered = filtered.filter((p) => p.listing_type === 2);
    }

    // Filter by location
    if (searchLocation.trim()) {
      const searchTerm = searchLocation.toLowerCase();
      filtered = filtered.filter((p) =>
        p.location?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    setDisplayedProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900">
              Marketplace
            </h1>
            <p className="text-zinc-600">
              Discover and trade real estate on Movement blockchain
            </p>
          </div>
          <div className="inline-flex bg-white border border-zinc-200 rounded-lg p-1">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterType === "all"
                  ? "bg-teal-700 text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("buy")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterType === "buy"
                  ? "bg-teal-700 text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setFilterType("rent")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterType === "rent"
                  ? "bg-teal-700 text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              For Rent
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72 space-y-6 bg-white p-6 rounded-lg border border-zinc-200 h-fit">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold">
              <SlidersHorizontal size={20} />
              <span>Filters</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700 mb-2 block">
                  Search Location
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="City, Address..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 mb-2 block">
                  Price Range (MOVE)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="px-3 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="px-3 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  />
                </div>
              </div>

              <Button
                className="w-full"
                onClick={loadProperties}
                disabled={loading}
                size="sm"
              >
                {loading ? "Refreshing..." : "Refresh Properties"}
              </Button>
            </div>
          </div>

          {/* Property Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="animate-spin text-teal-700" size={32} />
              </div>
            ) : displayedProperties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-zinc-200">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-zinc-400" />
                </div>
                <h3 className="text-lg font-medium text-zinc-900 mb-2">
                  No properties found
                </h3>
                <p className="text-zinc-600 text-sm">
                  Try adjusting your filters or check back later
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedProperties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-zinc-600">
                    Showing{" "}
                    <span className="font-medium text-zinc-900">
                      {displayedProperties.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-zinc-900">
                      {properties.length}
                    </span>{" "}
                    properties
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
