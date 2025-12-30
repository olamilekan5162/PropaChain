import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Building2,
  Wallet,
  History,
  Menu,
  X,
  LogOut,
  User,
  UploadCloud,
  FileText,
  ArrowLeftRight,
  Search,
  ShoppingCart,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Jazzicon from "react-jazzicon";
import { useMovementWallet } from "../../hooks/useMovementWallet";
import { usePrivy } from "@privy-io/react-auth";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import WalletModal from "../wallet/WalletModal";
import { Button } from "../common/Button";

const cn = (...inputs) => twMerge(clsx(inputs));

const SidebarLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
        isActive
          ? "bg-teal-50 text-teal-700 border border-teal-200"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
      )}
    >
      <Icon size={20} />
      <span>{children}</span>
    </Link>
  );
};

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { walletAddress, disconnectWallet } = useMovementWallet();
  const { authenticated, logout: privyLogout } = usePrivy();
  const { connected, disconnect: nativeDisconnect } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleDisconnect = async () => {
    try {
      if (authenticated) {
        await privyLogout();
      } else if (connected) {
        await nativeDisconnect();
      }
      disconnectWallet();
      setShowDropdown(false);
      navigate("/");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-zinc-200 flex-col fixed h-full z-10">
        {/* Logo */}
        <div className="p-6 border-b border-zinc-100">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-7 h-7 text-teal-700" />
            <span className="text-xl font-semibold text-zinc-900">
              PropaChain
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarLink to="/marketplace" icon={ShoppingCart}>
            Marketplace
          </SidebarLink>
          <SidebarLink to="/app" icon={Home}>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/app/my-properties" icon={Building2}>
            My Properties
          </SidebarLink>
          <SidebarLink to="/app/upload" icon={UploadCloud}>
            List Property
          </SidebarLink>
          <SidebarLink to="/app/transactions" icon={ArrowLeftRight}>
            Transactions
          </SidebarLink>
          <SidebarLink to="/app/profile" icon={User}>
            Profile
          </SidebarLink>
        </nav>

        {/* Wallet Section */}
        <div className="p-4 border-t border-zinc-100">
          {!walletAddress ? (
            <Button className="w-full" onClick={() => setShowWalletModal(true)}>
              Connect Wallet
            </Button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full bg-zinc-50 hover:bg-zinc-100 p-3 rounded-lg border border-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-zinc-200 overflow-hidden bg-white flex items-center justify-center">
                    <Jazzicon
                      diameter={32}
                      seed={parseInt(walletAddress.slice(2, 10), 16)}
                    />
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-xs text-zinc-500">Connected</p>
                    <p className="text-sm font-mono text-zinc-900 truncate">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                </div>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg shadow-lg border border-zinc-200 overflow-hidden">
                  <Link
                    to="/app/profile"
                    className="w-full text-left px-4 py-3 hover:bg-zinc-50 flex items-center gap-2 text-sm text-zinc-700"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User size={16} /> Profile
                  </Link>
                  <button
                    onClick={handleDisconnect}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm border-t border-zinc-100"
                  >
                    <LogOut size={16} /> Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white border-b border-zinc-200 z-20">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-6 h-6 text-teal-700" />
            <span className="text-lg font-semibold text-zinc-900">
              PropaChain
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-600 hover:text-zinc-900"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-zinc-200 bg-white p-4 space-y-1">
            <SidebarLink to="/app" icon={Home}>
              Dashboard
            </SidebarLink>
            <SidebarLink to="/app/my-properties" icon={Building2}>
              My Properties
            </SidebarLink>
            <SidebarLink to="/app/transactions" icon={ArrowLeftRight}>
              Transactions
            </SidebarLink>
            <SidebarLink to="/app/upload" icon={UploadCloud}>
              List Property
            </SidebarLink>
            <SidebarLink to="/app/profile" icon={User}>
              Profile
            </SidebarLink>

            <div className="pt-4 border-t border-zinc-100">
              {!walletAddress ? (
                <Button
                  className="w-full"
                  onClick={() => setShowWalletModal(true)}
                >
                  Connect Wallet
                </Button>
              ) : (
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                >
                  Disconnect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-6 pt-20 lg:pt-6">
          <Outlet />
        </div>
      </main>

      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </div>
  );
}
