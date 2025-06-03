"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MintForm } from "@/features/mint/components/MintForm"
import SuccessModal from "../components/success-modal"
import NFTDetailModal from "../components/nft-detail-modal"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'

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
        {/* Wallet connection is now handled by RainbowKit's ConnectButton */}
        {/* <WalletConnect /> */}
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
        <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''%] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''%] before:lg:size-[480px] after:lg:size-[360px] before:![mask-image:radial-gradient(50%_50%_at_50%_50%,white_initializer_white_initializer,transparent_initializer)] after:![mask-image:conic-gradient(from_180deg_at_50%_50%,white_initializer_white_initializer,transparent_initializer)] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 z-20 w-full max-w-5xl items-center justify-between font-mono text-sm"
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <MintForm />
        </div>
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
        onContinue={() => setShowSuccessModal(false)}
      />
      <NFTDetailModal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />

      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:size-auto lg:bg-none dark:from-black dark:via-black">
          {/* Wallet Connect Button */}
          <div className="mb-4 mr-4">
            <ConnectButton />
          </div>
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
    </div>
  )
}
