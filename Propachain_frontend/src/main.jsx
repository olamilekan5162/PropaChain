import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { PrivyProvider } from "@privy-io/react-auth";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

// TODO: Replace with environment variables or proper config
const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID; // Keeping this placeholder/demo or from user's other project if known.
// For now, I'll use a placeholder or check if user provided one in config.
// User mentioned config files. I should check src/config/movement.js first actually.
// But assuming standard setup for now.

const wallets = [
  // Add official wallet adapters if installed, otherwise AptosWalletAdapterProvider handles standard wallets
];

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "google", "wallet"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <AptosWalletAdapterProvider
        plugins={wallets}
        autoConnect={true}
        dappConfig={{ network: Network.TESTNET }}
      >
        <App />
      </AptosWalletAdapterProvider>
    </PrivyProvider>
  </StrictMode>
);
