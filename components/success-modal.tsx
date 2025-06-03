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
          <h2 className="text-2xl font-bold mb-4">Dorippa Panthera</h2>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet, a habitant a consequat elementum nisl.
            Phasellus facilisis urna facilisis aliquet.
          </p>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 text-base border-0"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
