import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Home,
  TrendingUp,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { PropertyCard } from "../components/common/PropertyCard";
import { useState, useEffect } from "react";
import WalletModal from "../components/wallet/WalletModal";
import { useMovementWallet } from "../hooks/useMovementWallet";
import { useFetchProperties } from "../hooks/useFetchProperties";

const GATEWAY_URL = import.meta.env.VITE_PINATA_GATEWAY;

export default function LandingPage() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { walletAddress } = useMovementWallet();
  const { fetchAllProperties } = useFetchProperties();
  const [featuredProperties, setFeaturedProperties] = useState([]);

  const loadFeaturedProperties = async () => {
    try {
      const props = await fetchAllProperties();
      // Properties are already formatted by formatPropertyData()
      const availableProps = props.filter((p) => p.status === 1).slice(0, 3);
      setFeaturedProperties(availableProps);
    } catch (error) {
      console.error("Failed to load featured properties:", error);
      setFeaturedProperties([]);
    }
  };

  useEffect(() => {
    loadFeaturedProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-20 lg:pt-28 lg:pb-28 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Live on Movement Blockchain
            </div>

            <h1 className="text-5xl md:text-6xl font-semibold text-zinc-900 mb-6 tracking-tight">
              Modern Real Estate Trading Platform
            </h1>

            <p className="text-xl text-zinc-600 mb-10 leading-relaxed">
              Buy, sell, and trade properties with blockchain technology.
              Secure, transparent, and efficient real estate transactions
              powered by Movement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Properties <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              {!walletAddress && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => setShowWalletModal(true)}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-teal-700 mb-2">
                $50M+
              </div>
              <div className="text-sm text-zinc-600">Total Value Traded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-teal-700 mb-2">
                1,200+
              </div>
              <div className="text-sm text-zinc-600">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-teal-700 mb-2">
                500+
              </div>
              <div className="text-sm text-zinc-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-teal-700 mb-2">
                98%
              </div>
              <div className="text-sm text-zinc-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-semibold text-zinc-900 mb-3">
                Featured Properties
              </h2>
              <p className="text-zinc-600">
                Explore our exclusive property listings
              </p>
            </div>
            <Link
              to="/marketplace"
              className="text-teal-700 font-medium hover:text-teal-800 transition-colors flex items-center gap-1"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-zinc-200">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-zinc-400" />
              </div>
              <p className="text-zinc-600 mb-6">No properties available yet</p>
              <Link to="/app/upload">
                <Button>List Your First Property</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

       {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900 mb-4">
              Why Choose PropaChain
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Experience the future of real estate with our blockchain-powered
              platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-zinc-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Instant Transactions
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Complete property transactions in seconds with zero fees using
                Movement blockchain technology.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Smart Escrow
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Automated and trustless escrow system ensures secure property
                exchanges for all parties.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Global Access
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Trade real estate globally without intermediaries, borders, or
                traditional banking limitations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Get started with PropaChain in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-700 text-white rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Connect Wallet
              </h3>
              <p className="text-zinc-600">
                Connect your Movement wallet to get started with secure property
                trading
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-700 text-white rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Browse Properties
              </h3>
              <p className="text-zinc-600">
                Explore verified property listings with detailed information and
                imagery
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-700 text-white rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Make Transaction
              </h3>
              <p className="text-zinc-600">
                Complete secure transactions using smart contracts and escrow
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-teal-50 mb-10">
            Join thousands of users trading properties on the blockchain
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!walletAddress ? (
              <>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto bg-white text-teal-700 hover:bg-teal-50"
                  onClick={() => setShowWalletModal(true)}
                >
                  Connect Wallet
                </Button>
                <Link to="/marketplace">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-teal-800 hover:bg-teal-900 border-teal-800"
                  >
                    View Marketplace <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/app">
                <Button
                  size="lg"
                  className="bg-white text-teal-700 hover:bg-teal-50 border-white"
                >
                  Go to Dashboard <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </div>
  );
}
