"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

export default function SuccessModal({ isOpen, onClose, onContinue }: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <Card className="relative w-full max-w-md bg-black border-gray-800 text-white">
        <CardContent className="p-8 text-center">
          {/* NFT Image */}
          <div className="mb-6">
            <div className="w-64 h-64 mx-auto bg-white rounded-lg p-4 flex items-center justify-center">
              <img src="/jellyfish-nft.png" alt="Dorippa Panthera NFT" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-4">Confirm Minting</h2>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
          You’re about to mint this NFT. This action will require a small gas fee to finalize the transaction on the blockchain.
          Please confirm in your wallet to proceed.
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 text-base border-0"
            >
              Confirm
            </Button>
             <Button
              onClick={onClose}
              variant="outline"
              className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 h-12 text-base"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
