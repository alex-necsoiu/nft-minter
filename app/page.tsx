"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { WalletConnect } from "@/features/wallet/components/WalletConnect"
import { MintForm } from "@/features/mint/components/MintForm"
import SuccessModal from "../components/success-modal"
import NFTDetailModal from "../components/nft-detail-modal"

export default function NFTSeaInterface() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        backgroundImage: `url('/bg-new.svg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <img src="/logo.svg" alt="NFT SEA" className="h-8" />
        </div>
        <WalletConnect />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Hero Card */}
        <Card className="bg-gray-800/50 border-gray-600 backdrop-blur-sm mb-12">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-wide">MINT NEW NFT</h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sem tortor, quis amet scelerisque vivamus
              egestas.
            </p>
          </CardContent>
        </Card>

        {/* Minting Form */}
        <MintForm />
      </main>

      {/* Footer */}
      <footer className="mt-20 p-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.svg" alt="NFT SEA" className="h-8" />
        </div>
        <div className="text-center flex-1">
          <p className="text-gray-400 text-sm">NFT Sea 2022 © All right reserved</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6 py-2 h-auto rounded-md">
          Explore Marketplace
        </Button>
      </footer>

      {/* Modals */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
      <NFTDetailModal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />
    </div>
  )
}
