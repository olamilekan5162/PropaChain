import { X } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { Button } from "../common/Button";

const WalletModal = ({ isOpen, onClose }) => {
  const { wallets, connect, connected } = useWallet();
  const { login, authenticated } = usePrivy();

  // Close modal if connected
  useEffect(() => {
    if (connected || authenticated) {
      onClose();
    }
  }, [connected, authenticated, onClose]);


  const filteredWallets = wallets
    ?.filter((wallet) => {
      const name = wallet.name.toLowerCase();
      return (
        !name.includes("petra") &&
        !name.includes("google") &&
        !name.includes("apple")
      );
    })
    .filter((wallet, index, self) => {
      return index === self.findIndex((w) => w.name === wallet.name);
    })
    .sort((a, b) => {
      if (a.name.toLowerCase().includes("nightly")) return -1;
      if (b.name.toLowerCase().includes("nightly")) return 1
      return 0;
    });

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-teal-50 to-teal-50/50 px-6 py-5 border-b border-teal-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-teal-700 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Connect Wallet
              </h2>
              <p className="text-sm text-zinc-600 mt-0.5">
                Choose your preferred connection method
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {/* Privy Login */}
            <button
              // onClick={login}
              onClick={() => login({ loginMethods: ["email", "google"] })}
              className="w-full flex items-center gap-4 p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/40 transition-shadow">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div className="text-left">
                <span className="block font-semibold text-zinc-900 group-hover:text-teal-700 transition-colors">
                  Login with Privy
                </span>
                <span className="block text-sm text-zinc-600">
                  Email, Google & more
                </span>
              </div>
            </button>

            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-zinc-500 font-medium">
                  Or connect wallet
                </span>
              </div>
            </div>

            {/* Movement Wallets */}
            {filteredWallets?.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => connect(wallet.name)}
                className="w-full flex items-center gap-4 p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-all group"
              >
                <img
                  src={wallet.icon}
                  alt={wallet.name}
                  className="w-12 h-12 rounded-lg shrink-0 shadow-sm"
                />
                <div className="text-left">
                  <span className="block font-semibold text-zinc-900 group-hover:text-teal-700 transition-colors">
                    {wallet.name}
                  </span>
                  <span className="block text-sm text-zinc-600">
                    Movement Network
                  </span>
                </div>
              </button>
            ))}

            {/* No Wallets */}
            {(!wallets || wallets.length === 0) && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <p className="text-sm text-amber-900 mb-2">
                  No wallets detected
                </p>
                <a
                  href="https://petra.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800"
                >
                  Install Petra Wallet
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-5 p-3 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-xs text-teal-800 leading-relaxed">
              <strong className="font-semibold">Secure Connection:</strong> Your
              wallet credentials never leave your device. We use
              industry-standard encryption to protect your transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
