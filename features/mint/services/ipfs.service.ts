import axios from 'axios';
import { NFTMetadata } from '@/lib/types/nft';

const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_JSON_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

export const uploadNFTData = async (file: File, metadata: NFTMetadata): Promise<{ imageUrl: string; metadataUrl: string }> => {
  try {
    // Upload image file
    const formData = new FormData();
    formData.append('file', file);

    const imageResponse = await axios.post(PINATA_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!
      }
    });

    if (!imageResponse.data.IpfsHash) {
      throw new Error('Failed to get IPFS hash for image');
    }

    const imageUrl = `https://ipfs.io/ipfs/${imageResponse.data.IpfsHash}`;

    // Upload metadata JSON
    const metadataResponse = await axios.post(PINATA_JSON_URL, {
      ...metadata,
      image: imageUrl
    }, {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!
      }
    });

    if (!metadataResponse.data.IpfsHash) {
      throw new Error('Failed to get IPFS hash for metadata');
    }

    const metadataUrl = `https://ipfs.io/ipfs/${metadataResponse.data.IpfsHash}`;

    return {
      imageUrl,
      metadataUrl
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
}; 