import React, { useState } from "react";
import MintForm from "@/features/mint/MintForm";
import WalletModal from "@/features/wallet/WalletModal";

export default function Home() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // Example wallet connect handler
  const handleWalletConnect = (provider: string) => {
    // TODO: Integrate with your wallet logic
    setWalletModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1333] via-[#23232a] to-[#2c1a2d] relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-10 pt-8 z-20 relative">
        {/* Logo */}
        <div className="text-4xl font-serif font-bold text-white tracking-wide select-none">
          NFT{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sea
          </span>
        </div>
        {/* Buttons */}
        <div className="flex gap-4">
          <button
            className="bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-md px-6 py-2 shadow hover:opacity-90 transition"
            // TODO: Add navigation to marketplace
          >
            Explore Marketplace
          </button>
          <button
            className="border border-white text-white font-semibold rounded-md px-6 py-2 hover:bg-white hover:text-black transition"
            onClick={() => setWalletModalOpen(true)}
          >
            Connect Wallet
          </button>
        </div>
      </header>

      {/* Main Minting Form */}
      <main className="flex flex-col items-center justify-center min-h-[80vh]">
        <MintForm />
      </main>

      {/* Wallet Modal */}
      {walletModalOpen && (
        <WalletModal
          onClose={() => setWalletModalOpen(false)}
          onConnect={handleWalletConnect}
        />
      )}
    </div>
  );
}