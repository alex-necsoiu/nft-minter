/**
 * Header component for NFT Sea.
 * Displays the logo and a call-to-action button.
 * Follows Figma design and project style rules.
 */
import React from 'react'

const Header: React.FC = () => (
  <header className="flex justify-between items-center px-10 py-6">
    <span className="text-3xl font-serif font-bold text-white tracking-wide select-none">
      <span className="text-white">NFT</span>
      <span className="text-accent">Sea</span>
    </span>
    <button className="bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-md px-5 py-2 shadow-lg hover:opacity-90 transition">
      Explore Marketplace
    </button>
  </header>
)

export default Header