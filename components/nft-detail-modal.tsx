"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, ChevronDown } from "lucide-react"

interface NFTDetailModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NFTDetailModal({ isOpen, onClose }: NFTDetailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <Card className="relative w-full max-w-4xl bg-black border-gray-800 text-white">
        <CardContent className="p-0">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-gray-800 z-10"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Side - Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-lg p-8 flex items-center justify-center">
                <img src="/jellyfish-nft.png" alt="Dorippa Panthera NFT" className="w-full h-full object-contain" />
              </div>

              {/* Details Dropdown */}
              <Button
                variant="outline"
                className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-12"
              >
                Details
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Right Side - Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dorippa Panthera</h1>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-300">DESCRIPTION</h3>
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-400 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet, a habitant a consequat elementum
                    nisl. Phasellus facilisis urna facilisis aliquet enim congue. Libero amet proin phasellus pretium.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
