import { useState, _useEffect } from "react";
import {
  Wallet as WalletIcon,
  Copy,
  ExternalLink,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
} from "lucide-react";

export default function Wallet() {
  const [isConnected, setIsConnected] = useState(() => {
    return !!localStorage.getItem("walletAddress");
  });
  const [walletAddress, setWalletAddress] = useState(() => {
    return localStorage.getItem("walletAddress") || "";
  });

  const handleConnect = () => {
    // Mock wallet connection
    const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
    setIsConnected(true);
    setWalletAddress(address);
    localStorage.setItem("walletAddress", address);
    // Trigger storage event for other components
    window.dispatchEvent(new Event("walletConnected"));
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
    localStorage.removeItem("walletAddress");
    // Trigger storage event for other components
    window.dispatchEvent(new Event("walletDisconnected"));
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  const transactions = [
    {
      id: 1,
      type: "deposit",
      amount: "50,000,000",
      property: "5 Bedroom Duplex in Lekki",
      date: "2 hours ago",
      status: "completed",
      hash: "0x8f7d...3a2c",
    },
    {
      id: 2,
      type: "escrow",
      amount: "85,000,000",
      property: "3 Bedroom Flat in Victoria Island",
      date: "1 day ago",
      status: "pending",
      hash: "0x2b4e...9f1a",
    },
    {
      id: 3,
      type: "withdrawal",
      amount: "30,000,000",
      property: "Land in Ajah",
      date: "3 days ago",
      status: "completed",
      hash: "0x5c3d...7e8b",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="bg-white border-b border-gray-200 px-4 py-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-1">
            Manage your blockchain wallet and transactions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {!isConnected ? (
          // Wallet Not Connected
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <WalletIcon className="w-10 h-10 text-teal-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Connect your wallet to access escrow services, manage property
              transactions, and view your transaction history on the blockchain.
            </p>
            <button
              onClick={handleConnect}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-12 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors"
            >
              <WalletIcon className="w-5 h-5" />
              <span>Connect Wallet</span>
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Supports Movement Network and other EVM-compatible wallets
            </p>
          </div>
        ) : (
          <>
            {/* Wallet Connected */}
            <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-lg p-4 md:p-6 text-white">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white opacity-80">
                      Movement Network
                    </p>
                    <p className="font-semibold text-white">Connected</p>
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 bg-white text-teal-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                >
                  Disconnect
                </button>
              </div>

              <div className="mb-3 md:mb-4">
                <p className="text-xs md:text-sm text-white opacity-80 mb-1">
                  Wallet Address
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-sm md:text-lg font-mono text-white">
                    {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="p-1.5 hover:bg-teal-800 rounded transition-colors"
                    title="Copy address"
                  >
                    <Copy className="w-4 h-4 text-white" />
                  </button>
                  <a
                    href={`https://explorer.movementnetwork.xyz/address/${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-teal-800 rounded transition-colors"
                    title="View on explorer"
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">
                    Balance
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    ₦165,000,000
                  </p>
                  <p className="text-xs text-gray-500 mt-1">≈ $110,000 USD</p>
                </div>
                <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">
                    In Escrow
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    ₦85,000,000
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    1 active transaction
                  </p>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3">
                <button className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-white text-teal-700 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Deposit</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-teal-800 hover:bg-teal-900 rounded-lg font-medium transition-colors text-white">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Transaction History
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 md:p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 md:gap-4">
                      <div className="flex items-start gap-2 md:gap-3">
                        <div
                          className={`w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            tx.type === "deposit"
                              ? "bg-green-100"
                              : tx.type === "withdrawal"
                              ? "bg-blue-100"
                              : "bg-yellow-100"
                          }`}
                        >
                          {tx.type === "deposit" && (
                            <ArrowDownLeft className="w-4 md:w-5 h-4 md:h-5 text-green-700" />
                          )}
                          {tx.type === "withdrawal" && (
                            <ArrowUpRight className="w-4 md:w-5 h-4 md:h-5 text-blue-700" />
                          )}
                          {tx.type === "escrow" && (
                            <Clock className="w-4 md:w-5 h-4 md:h-5 text-yellow-700" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm md:text-base text-gray-900 capitalize">
                              {tx.type}
                            </span>
                            <span
                              className={`px-1.5 md:px-2 py-0.5 rounded-full text-xs font-medium ${
                                tx.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 mb-1">
                            {tx.property}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-500 overflow-hidden">
                            <span className="whitespace-nowrap">{tx.date}</span>
                            <span>•</span>
                            <code className="font-mono truncate">
                              {tx.hash}
                            </code>
                            <a
                              href={`https://explorer.movementnetwork.xyz/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-teal-700"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className={`font-bold text-sm md:text-base ${
                            tx.type === "deposit"
                              ? "text-green-700"
                              : tx.type === "withdrawal"
                              ? "text-blue-700"
                              : "text-yellow-700"
                          }`}
                        >
                          {tx.type === "deposit"
                            ? "+"
                            : tx.type === "withdrawal"
                            ? "-"
                            : ""}
                          ₦{tx.amount}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
