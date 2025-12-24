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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connect Wallet</h2>
          <p className="text-sm text-slate-500 mb-6">
            Choose a wallet to connect to PropAChain.
          </p>
          
          <div className="space-y-3">
            <Button 
              variant="secondary" 
              className="w-full justify-start h-14"
              onClick={login}
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <span className="text-purple-600 font-bold text-xs">P</span>
              </div>
              <div className="text-left">
                <span className="block font-semibold text-slate-900">Login with Privy</span>
                <span className="block text-xs text-slate-500">Email, Google, or Socials</span>
              </div>
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Or connect existing</span>
              </div>
            </div>

            {wallets?.map((wallet) => (
              <Button
                key={wallet.name}
                variant="secondary"
                className="w-full justify-start h-14"
                onClick={() => connect(wallet.name)}
              >
                <img src={wallet.icon} alt={wallet.name} className="w-8 h-8 mr-3 rounded-full" />
                <span className="font-semibold text-slate-900">{wallet.name}</span>
              </Button>
            ))}
            
            {(!wallets || wallets.length === 0) && (
              <p className="text-center text-sm text-slate-400 py-2">
                No Aptos wallets detected.
                <br />
                <a 
                  href="https://petra.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Install Petra
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
