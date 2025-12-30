import { Outlet, Link, useNavigate } from "react-router-dom";
import { Home, Search, User, LogIn } from "lucide-react";
import { useState } from "react";
import { Button } from "../common/Button";
import { useMovementWallet } from "../../hooks/useMovementWallet";
import WalletModal from "../wallet/WalletModal";
import Jazzicon from "react-jazzicon";
import { Footer } from "./Footer";

export default function PublicLayout() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { walletAddress } = useMovementWallet();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-7 h-7 text-teal-700" />
              <span className="text-xl font-semibold text-zinc-900">
                PropaChain
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/marketplace"
                className="text-zinc-700 hover:text-teal-700 font-medium transition-colors"
              >
                Marketplace
              </Link>
              {!walletAddress ? (
                <div></div>
              ) : (
                <Link
                  to="/app"
                  className="text-zinc-700 hover:text-teal-700 font-medium transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {!walletAddress ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowWalletModal(true)}
                    className="hidden sm:inline-flex"
                  >
                    <LogIn size={18} className="mr-2" />
                    Connect Wallet
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowWalletModal(true)}
                    className="sm:hidden"
                  >
                    Connect
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  {/* <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate("/app")}
                  >
                    Dashboard
                  </Button> */}
                  <button
                    onClick={() => navigate("/app/profile")}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full border border-zinc-200 overflow-hidden bg-white flex items-center justify-center">
                      <Jazzicon
                        diameter={32}
                        seed={parseInt(walletAddress.slice(2, 10), 16)}
                      />
                    </div>
                    <span className="text-sm font-mono text-zinc-700 hidden sm:inline">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Wallet Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </div>
  );
}
