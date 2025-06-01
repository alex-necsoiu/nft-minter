/**
 * Footer component for NFT Sea.
 * Displays the logo and copyright.
 * Follows Figma design and project style rules.
 */
import React from 'react'

const Footer: React.FC = () => (
  <footer className="w-full flex flex-col items-center py-8">
    <span className="text-3xl font-serif font-bold text-white tracking-wide select-none mb-2">
      <span className="text-white">NFT</span>
      <span className="text-accent">Sea</span>
    </span>
    <span className="text-gray-400 text-sm text-center">
      NFT Sea 2022 © All right reserved
    </span>
  </footer>
)

export default Footer