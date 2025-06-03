"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative ml-auto w-96 h-full bg-gray-900 text-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">Connect Wallet</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-gray-800">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-14"
          >
            <img src="/metamask.svg" alt="Metamask" className="w-6 h-6 mr-3" />
            Connect Metamask
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-14"
          >
            <img src="/portis.svg" alt="Portis" className="w-6 h-6 mr-3" />
            Connect Portis
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-14"
          >
            <img src="/torus.svg" alt="Torus" className="w-6 h-6 mr-3" />
            Connect Torus
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-14"
          >
            <img src="/walletlink.svg" alt="Walletlink" className="w-6 h-6 mr-3" />
            Connect Walletlink
          </Button>
        </div>

        <div className="mt-8">
          <p className="text-gray-400 text-sm">
            {"Don't have a wallet? "}
            <a href="#" className="text-blue-400 hover:underline">
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
