import React, { useState } from 'react';
import { useMintNft } from './use-mint';
import { useWallet } from '@/features/wallet/use-wallet';
import Notification from '../notification/Notification';
import { uploadImageToIpfs, uploadMetadataToIpfs } from '@/features/ipfs/ipfs.service';
import { createNftMetadata } from './metadata.util';
import { logError } from '@/utils/sentry-logger';
import NftOverviewModal from './NftOverviewModal';

/**
 * MintForm is the main NFT minting UI.
 * Pixel-perfect Figma implementation for Minting.png.
 */
const MintForm: React.FC = () => {
  const { address, isConnected, isCorrectNetwork } = useWallet();
  const { mint, isPending } = useMintNft();

  // Local state for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // State for NFT overview modal
  const [showOverview, setShowOverview] = useState(false);
  const [mintedNft, setMintedNft] = useState<{
    imageUrl: string;
    title: string;
    description: string;
    txHash: string;
  } | null>(null);

  // Handle image file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Show NFT overview modal after successful mint
  const handleMintSuccess = (
    txHash: string,
    imageUrl: string,
    title: string,
    description: string
  ) => {
    setMintedNft({ imageUrl, title, description, txHash });
    setShowOverview(true);
  };

  // Submit handler for minting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    // Client-side validation
    if (!title.trim()) {
      setNotification({ message: 'Title is required.', type: 'error' });
      return;
    }
    if (!description.trim()) {
      setNotification({ message: 'Description is required.', type: 'error' });
      return;
    }
    if (!image) {
      setNotification({ message: 'Image is required.', type: 'error' });
      return;
    }
    if (!isConnected) {
      setNotification({ message: 'Connect your wallet to mint.', type: 'error' });
      return;
    }
    if (!isCorrectNetwork) {
      setNotification({ message: 'Switch to Sepolia network to mint.', type: 'error' });
      return;
    }

    try {
      setNotification({ message: 'Uploading image to IPFS...', type: 'success' });
      const imageUrl = await uploadImageToIpfs(image);

      setNotification({ message: 'Creating metadata...', type: 'success' });
      const metadata = createNftMetadata(title, description, imageUrl);

      setNotification({ message: 'Uploading metadata to IPFS...', type: 'success' });
      const metadataUrl = await uploadMetadataToIpfs(metadata);

      setNotification({ message: 'Minting NFT on-chain...', type: 'success' });
      const receipt = await mint(address!, metadataUrl);

      setNotification({ message: 'NFT minted successfully!', type: 'success' });

      // Show NFT overview modal (receipt is txHash string)
      handleMintSuccess(receipt, imageUrl, title, description);

      // Optionally reset form fields here if desired
      setTitle('');
      setDescription('');
      setImage(null);
    } catch (error: any) {
      logError(error, 'MintForm submission');
      setNotification({ message: error.message || 'Minting failed', type: 'error' });
    }
  };

  // Disable minting if wallet is not connected, wrong network, or fields are empty
  const isMintDisabled = !isConnected || !isCorrectNetwork || !title || !description || !image;

  // Image preview for better UX
  const imagePreview = image ? URL.createObjectURL(image) : null;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Hero Card */}
      <div className="bg-black/40 border border-white/30 rounded-2xl shadow-lg mb-12">
        <div className="p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-wide">MINT NEW NFT</h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sem tortor, quis amet scelerisque vivamus egestas.
          </p>
        </div>
      </div>

      {/* Minting Form */}
      <form className="max-w-lg mx-auto space-y-6" onSubmit={handleSubmit}>
        {/* Upload Image */}
        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-right bg-black/30">
          {!imagePreview ? (
            <div className="flex flex-col items-end">
              <svg className="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <p className="text-white font-medium mb-1 text-right">Upload Image</p>
              <p className="text-gray-400 text-sm text-right">format supported</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                required
                aria-label="NFT image file"
              />
            </div>
          ) : (
            <img
              src={imagePreview}
              alt="Preview"
              className="object-contain h-32 w-32 mx-auto rounded-lg"
            />
          )}
        </div>

        {/* NFT Title */}
        <input
          className="bg-black/30 border border-white/30 text-white placeholder:text-gray-400 h-12 text-base rounded-lg px-4"
          type="text"
          placeholder="NFT Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          aria-label="NFT Title"
        />

        {/* Description */}
        <textarea
          className="bg-black/30 border border-white/30 text-white placeholder:text-gray-400 min-h-[120px] text-base resize-none rounded-lg px-4 py-3"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          aria-label="NFT Description"
        />

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            className="flex-1 bg-transparent border border-white/30 text-white rounded-lg h-12 text-base font-semibold cursor-not-allowed opacity-80"
            disabled
            aria-label="Mint without listing (disabled)"
          >
            Mint without listing
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 text-base border-0 rounded-lg font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isMintDisabled || isPending}
            aria-label="Mint and list immediately"
          >
            Mint and list immediately
          </button>
        </div>
        {/* Notification for user feedback */}
        {notification && <Notification message={notification.message} type={notification.type} />}
      </form>

      {/* NFT Overview Modal */}
      {showOverview && mintedNft && (
        <NftOverviewModal
          imageUrl={mintedNft.imageUrl}
          title={mintedNft.title}
          description={mintedNft.description}
          txHash={mintedNft.txHash}
          onClose={() => setShowOverview(false)}
        />
      )}
    </div>
  );
};

export default MintForm;