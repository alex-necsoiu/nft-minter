/**
 * Header component for NFT Sea.
 * Figma-compliant: logo with gradient, right-aligned button, and spacing.
 */
import React from 'react';
import Link from "next/link";

const Header: React.FC = () => (
  <header className="flex justify-between items-center p-6">
    <div className="flex items-center">
      <img src="/icons/logo.svg" alt="NFT Sea Logo" className="h-8 w-auto mr-3" />
      <h1 className="text-2xl font-bold">
        NFT <span className="text-purple-400">SEA</span>
      </h1>
    </div>
    <Link href="/marketplace" passHref>
      <button className="flex items-center border border-gray-600 text-white hover:bg-gray-800 rounded-lg px-5 py-2 transition">
        Explore Marketplace
        <img src="/icons/bx_wallet-alt.svg" alt="Wallet" className="w-5 h-5 ml-2" />
      </button>
    </Link>
  </header>
);

export default Header;