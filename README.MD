# PropaChain

**Decentralized real estate marketplace with secure escrow and transparent transactions on the Movement Blockchain.**

## Overview

PropaChain is a blockchain-powered real estate platform that enables secure property sales and rentals without intermediaries. Built on the **Movement blockchain** (Aptos-compatible), it leverages **Privy** for seamless social login (Email, Google) and wallet creation, making Web3 real estate accessible to everyone. The platform provides trustless escrow services, automated ownership transfers, and on-chain verified user profiles.

## Core Features

-   **Seamless Onboarding** – Login with Email or Google via **Privy** (no extension required), or connect an existing Aptos wallet (Petra, Nightly).
-   **Unified Listings** – List properties for sale or rent in one seamless interface.
-   **Secure Escrow** – Funds are locked in smart contracts until both parties confirm satisfaction.
-   **Automatic Verification** – User profiles linked to verified real-world identities.
-   **IPFS Document Storage** – Property documents, images, and videos stored securely off-chain via Pinata.
-   **Transparent History** – All transactions and ownership changes are immutable on the Movement blockchain.
-   **Rental Management** – Automated rental period tracking.
-   **Dispute Resolution** – Mechanisms to resolve conflicts fairly.

## Real Use Case: Alice Buys a Home

Alice (new to crypto) logs in with her **Google account**. PropaChain automatically creates a secure wallet for her. She finds a property listed by Bob. She deposits the purchase amount into the smart contract escrow. Bob confirms he's ready to transfer. Alice inspects the property and confirms satisfaction. The smart contract automatically:

-   Releases payment to Bob
-   Transfers property ownership to Alice
-   Updates the on-chain registry

All transparent, secure, and instant—no middlemen, no delays.

## How It Works

1.  **Users register** via customized profile creation (KYC integrated).
2.  **Sellers list properties** with prices, images, videos, and legal documents.
3.  **Buyers/renters deposit funds** into escrow smart contracts.
4.  **Both parties confirm** when satisfied with the transaction.
5.  **Smart contract executes**:
    -   Releases funds to seller
    -   Transfers ownership (for sales)
    -   Tracks rental period (for rentals)

## User Types

-   **Sellers/Landlords**: List properties, confirm delivery, receive payments.
-   **Buyers/Renters**: Browse listings, deposit funds, confirm receipt.
-   **Admins**: Resolve disputes, ensure platform integrity.

## Tech Stack

| Layer                  | Technology                                                                |
| ---------------------- | ------------------------------------------------------------------------- |
| **Blockchain**         | Movement Blockchain (Move Language)                                       |
| **Frontend**           | React.js, TailwindCSS                                                     |
| **Authentication**     | **Privy** (Email, Google, Wallet)                                         |
| **Blockchain SDK**     | `@aptos-labs/ts-sdk`, `@aptos-labs/wallet-adapter-react`                  |
| **Storage**            | IPFS via Pinata (documents, images, videos)                               |
| **Build Tool**         | Vite                                                                      |

## Getting Started

**Prerequisites:**

-   [Node.js](https://nodejs.org/) (v16+)
-   [Privy App ID](https://dashboard.privy.io/)
-   [Pinata Account](https://pinata.cloud/) (for IPFS storage)

**Installation & Running:**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/olamilekan5162/propachain.git
    cd propachain
    ```

2.  **Install dependencies:**

    ```bash
    cd Propachain_frontend
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the `Propachain_frontend` directory:

    ```env
    VITE_PRIVY_APP_ID=<YOUR_PRIVY_APP_ID>
    VITE_PINATA_JWT=<YOUR_PINATA_JWT>
    VITE_PINATA_GATEWAY=<YOUR_PINATA_GATEWAY_URL>
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open `http://localhost:5173` in your browser.

## Project Structure

```
propachain/
├── contracts/             # Move Smart Contracts
│   └── sources/
│       └── propachain.move
├── Propachain_frontend/   # React Application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── config/        # Blockchain & App Config
│   │   ├── hooks/         # Custom React Hooks (useMovementWallet, etc.)
│   │   ├── pages/         # Application Views
│   │   └── main.jsx       # Entry point & Providers
│   ├── vite.config.js
│   └── package.json
├── README.md
└── Move.toml
```

## Contributing

We're building transparent real estate with community at the core. If you're a:

-   Move / Web3 Developer
-   Real Estate Tech Enthusiast
-   UI/UX Designer

Feel free to contribute or join the discussion.

## License

This project is licensed under **MIT License**. See the [LICENSE](LICENSE) file for details.

---

**Built on Movement Blockchain – The future of modular, secure real estate.**
