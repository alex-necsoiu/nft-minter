"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { WalletConnect } from "@/features/wallet/components/WalletConnect"
import { MintForm } from "@/features/mint/components/MintForm"
import SuccessModal from "../components/success-modal"
import NFTDetailModal from "../components/nft-detail-modal"
import { logger } from "@/lib/utils/logger"
import { useMint } from "@/features/mint/hooks/use-mint"
import { MintFormData } from "@/features/mint/types/mint.types"

export default function NFTSeaInterface() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Get mint state, functions, and errors from the hook
  const { 
      mintState,
      mintNFT,
      confirmMintTransaction,
      resetMintProcess,
      error: mintHookError, // Rename to avoid conflict with local error state if any
      isWritingContract,
      isConfirmingTransaction,
  } = useMint();

  // Determine overall loading/submitting state
  const isLoading = mintState.isLoading || isWritingContract || isConfirmingTransaction;
  // Combine errors for display
  const combinedError = mintHookError || mintState.error; // Assuming mintState.error also exists for other internal errors

  useEffect(() => {
    logger.info('NFTSeaInterface component mounted');
  }, []);

  useEffect(() => {
    // Show success modal when mintState status is 'prepared' (after IPFS upload)
    if (mintState.status === 'prepared') {
      setShowSuccessModal(true);
    } else if (mintState.status === 'success') {
      // Optionally show a different modal or notification for final success
      // setShowDetailModal(true);
    }

    // Handle mint errors by potentially showing an error message or modal
    if (mintState.status === 'error' && combinedError) {
        logger.error('Mint process error in NFTSeaInterface', combinedError);
        // TODO: Display error message in UI, maybe in a dedicated error modal
    }

  }, [mintState.status, combinedError]); // Depend on mintState.status and combinedError

  const handleSuccessModalClose = () => {
    logger.debug('Success modal closed');
    setShowSuccessModal(false);
    // Reset mint state if the user closes the modal and no critical process is ongoing
    if (mintState.status !== 'prompting' && mintState.status !== 'mining' && mintState.status !== 'success') {
        logger.debug('Calling resetMintProcess on modal close due to non-critical status:', mintState.status); // Updated log
        resetMintProcess(); // Call the new reset function
    }
  };

  const handleSuccessModalContinue = () => {
    logger.debug('Success modal continue clicked, triggering contract write');
    setShowSuccessModal(false);
    confirmMintTransaction(); // Call the new function to trigger MetaMask prompt
  };

  const handleDetailModalClose = () => {
    logger.debug('Detail modal closed');
    setShowDetailModal(false);
  };

  const handleMintFormSubmit = async (data: MintFormData) => {
      logger.info('NFTSeaInterface: Mint form submitted, initiating IPFS upload.');
      // Call the refactored mintNFT which now only prepares data
      await mintNFT(data);
      // useMint useEffect will handle showing the success modal when status becomes 'prepared'
  };

  // TODO: Implement proper error display in the UI based on combinedError

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

        {/* Minting Form - Pass state and error as props */}
        <MintForm 
          onSubmit={handleMintFormSubmit}
          mintState={mintState}
          error={combinedError}
          isSubmitting={isLoading}
        />
      </main>

      {/* Footer */}
      <footer className="mt-20 p-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.svg" alt="NFT SEA" className="h-8" />
        </div>
        <div className="text-center flex-1">
          <p className="text-gray-400 text-sm">NFT Sea 2022 © All right reserved</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6 py-2 h-auto rounded-md"
          onClick={() => logger.info('Explore Marketplace button clicked')}
        >
          Explore Marketplace
        </Button>
      </footer>

      {/* Modals */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        onContinue={handleSuccessModalContinue}
      />
      <NFTDetailModal 
        isOpen={showDetailModal} 
        onClose={handleDetailModalClose} 
      />

      {/* Basic Error Display - Use combinedError */}
      {mintState.status === 'error' && combinedError && (
          <div className="text-red-500 mt-4 text-center">
              Error: {combinedError}
          </div>
      )}
    </div>
  )
}
