import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { uploadImageToIpfs, uploadMetadataToIpfs } from '../ipfs/ipfs.service';
import { mintNft } from './mint.service';
import { MintFormProps } from './mint.types';
import Notification from '../notification/Notification';

const MintForm: React.FC<MintFormProps> = () => {
  const { isConnected } = useAccount();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleMint = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isConnected) {
      setNotification({ message: 'Please connect your wallet to mint an NFT.', type: 'error' });
      return;
    }

    if (!imageFile) {
      setNotification({ message: 'Please upload an image.', type: 'error' });
      return;
    }

    try {
      // Upload image to IPFS
      const imageUrl = await uploadImageToIpfs(imageFile);
      // Create metadata object
      const metadata = {
        title,
        description,
        image: imageUrl,
      };
      // Upload metadata to IPFS
      const metadataUrl = await uploadMetadataToIpfs(metadata);
      // Mint the NFT
      await mintNft(metadataUrl);
      setNotification({ message: 'NFT minted successfully!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Minting failed. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="mint-form">
      <h2 className="text-2xl font-bold">Mint Your NFT</h2>
      <form onSubmit={handleMint} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea"
          required
        />
        <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" required />
        <button type="submit" className="btn" disabled={!isConnected}>
          Mint NFT
        </button>
      </form>
      {notification && <Notification message={notification.message} type={notification.type} />}
    </div>
  );
};

export default MintForm;