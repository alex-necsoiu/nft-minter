import React, { useState } from 'react';
import { useMintNft } from './use-mint';
import { useWallet } from '@/features/wallet/use-wallet';
import Notification from '../notification/Notification';
import { uploadImageToIpfs, uploadMetadataToIpfs } from '@/features/ipfs/ipfs.service';
import { createNftMetadata } from './metadata.util';
import { logError } from '@/utils/sentry-logger';
import NftOverviewModal from './NftOverviewModal'; // Import the modal

/**
 * MintForm allows users to input NFT details and upload an image.
 * The mint button is disabled if the wallet is not connected or on the wrong network.
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

  // Handle image file selection
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

      // Show NFT overview modal
      handleMintSuccess(receipt.transactionHash, imageUrl, title, description);

      // Optionally reset form fields here if desired
      setTitle('');
      setDescription('');
      setImage(null);
    } catch (error: any) {
      logError(error, 'MintForm submission');
      setNotification({ message: error.message || 'Minting failed', type: 'error' });
    }
  };

  const isMintDisabled = !isConnected || !isCorrectNetwork || !title || !description || !image;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
      <div className="bg-black/70 backdrop-blur-lg rounded-2xl shadow-glass p-10 max-w-xl w-full border border-whiteGlass">
        <h1 className="text-4xl font-serif font-bold text-white text-center mb-2 tracking-wide">Mint New NFT</h1>
        <p className="text-gray-300 text-center mb-8 text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sem tortor quis amet scelerisque vivamus egestas.
        </p>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col items-center border-2 border-dashed border-gray-500 rounded-xl py-6 bg-grayDark text-gray-400 cursor-pointer hover:border-accent transition">
            <img src="/icons/upload.svg" alt="Upload" className="w-8 h-8 mb-2 opacity-70" />
            <span className="mb-2">Upload Image</span>
            <span className="text-xs">format supported</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} required />
          </label>
          <input
            className="bg-grayDark border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-accent"
            type="text"
            placeholder="NFT Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="bg-grayDark border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-accent"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              className="flex-1 bg-grayDark text-white rounded-md px-4 py-3 font-semibold border border-gray-600 hover:bg-gray-700 transition"
              disabled
            >
              Mint without listing
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-md px-4 py-3 shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isMintDisabled || isPending}
            >
              Mint and list immediately
            </button>
          </div>
          {notification && <Notification message={notification.message} type={notification.type} />}
        </form>
      </div>
      <footer className="mt-10 text-gray-400 text-sm text-center">
        NFT Sea 2022 © All right reserved
      </footer>
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