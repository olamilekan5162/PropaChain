import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  Bell,
  MapPin,
  Home,
  ChevronDown,
  User,
  Wallet,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Check,
} from "lucide-react";

export default function MobileHeader({ showSearch = true }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check wallet connection state
  useEffect(() => {
    const checkWallet = () => {
      const address = localStorage.getItem("walletAddress");
      setIsWalletConnected(!!address);
      setWalletAddress(address || "");
    };

    checkWallet();

    // Listen for wallet connection changes
    const handleWalletChange = () => checkWallet();
    window.addEventListener("walletConnected", handleWalletChange);
    window.addEventListener("walletDisconnected", handleWalletChange);

    return () => {
      window.removeEventListener("walletConnected", handleWalletChange);
      window.removeEventListener("walletDisconnected", handleWalletChange);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="w-7 h-7 text-teal-700" />
              <span className="text-xl font-semibold text-gray-900">
                PropaChain
              </span>
            </Link>

            <nav className="flex items-center gap-8">
              <Link
                to="/marketplace"
                className={`text-gray-700 hover:text-teal-700 font-medium transition-colors ${
                  location.pathname === "/marketplace" ? "text-teal-700" : ""
                }`}
              >
                Marketplace
              </Link>
              <Link
                to="/app"
                className={`text-gray-700 hover:text-teal-700 font-medium transition-colors ${
                  location.pathname === "/app" ? "text-teal-700" : ""
                }`}
              >
                Dashboard
              </Link>

              {/* Desktop Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                  className="flex items-center gap-1 text-gray-700 hover:text-teal-700 font-medium transition-colors"
                >
                  <span>More</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isDesktopMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDesktopMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDesktopMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to="/app/my-properties"
                        onClick={() => setIsDesktopMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        <span>My Properties</span>
                      </Link>
                      <Link
                        to="/app/transactions"
                        onClick={() => setIsDesktopMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span>Messages</span>
                      </Link>
                      <Link
                        to="/app/orders"
                        onClick={() => setIsDesktopMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        <FileText className="w-5 h-5 shrink-0" />
                        <span>Orders</span>
                      </Link>
                      <Link
                        to="/app/wallet"
                        onClick={() => setIsDesktopMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        <Wallet className="w-5 h-5 flex-shrink-0" />
                        <span>Wallet</span>
                      </Link>
                      <Link
                        to="/app/profile"
                        onClick={() => setIsDesktopMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        <User className="w-5 h-5 flex-shrink-0" />
                        <span>Profile</span>
                      </Link>
                      <hr className="my-2" />
                      <Link
                        to="#"
                        onClick={() => setIsDesktopMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        to="#"
                        onClick={() => setIsDesktopMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <HelpCircle className="w-5 h-5 flex-shrink-0" />
                        <span>Help & Support</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <Link
                to="/app/upload"
                className="px-4 py-2 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors flex-shrink-0"
              >
                List Property
              </Link>
              <button
                onClick={() => navigate("/app/wallet")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 flex-shrink-0 ${
                  isWalletConnected
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "border border-teal-700 text-teal-700 hover:bg-teal-50"
                }`}
              >
                {isWalletConnected ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden lg:inline">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                    <span className="lg:hidden">Connected</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 bg-white border-b border-gray-200 z-40">
        {/* Top Bar */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <Link to="/" className="flex items-center space-x-1.5">
              <div className="w-7 h-7 bg-teal-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-base">P</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                PropaChain
              </span>
            </Link>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button className="p-1.5 text-gray-600 hover:text-gray-900 relative flex-shrink-0">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-teal-700 rounded-full"></span>
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 text-gray-600 hover:text-gray-900 flex-shrink-0"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-xs text-gray-600 mb-2">
            <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            <span className="font-medium">Lagos, Nigeria</span>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, locations..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </form>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Menu</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                <Link
                  to="/app"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 font-medium rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/app/my-properties"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 font-medium rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span>My Properties</span>
                </Link>
                <Link
                  to="/app/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 font-medium rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Orders</span>
                </Link>
                <Link
                  to="/app/wallet"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 font-medium rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span>Wallet</span>
                </Link>

                <hr className="my-4" />

                <Link
                  to="#"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Help & Support</span>
                </Link>
                <Link
                  to="#"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                >
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
