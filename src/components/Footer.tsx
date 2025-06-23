/**
 * Footer component for NFT Sea.
 * Displays the logo and copyright.
 * Follows Figma design and project style rules.
 */
import React from 'react'
import Link from 'next/link'

const Footer: React.FC = () => (
  <footer className="mt-20 p-6 flex justify-between items-center">
    <div className="flex items-center">
      <img src="/icons/logo.svg" alt="NFT Sea Logo" className="h-8 w-auto mr-3" />
      <h1 className="text-2xl font-bold">
        NFT <span className="text-purple-400">SEA</span>
      </h1>
    </div>
    <div className="text-center flex-1">
      <p className="text-gray-400 text-sm">NFT Sea 2022 © All right reserved</p>
    </div>
    <Link href="/marketplace" passHref>
      <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-lg px-5 py-2 transition">
        Explore Marketplace
      </button>
    </Link>
  </footer>
)

export default Footer