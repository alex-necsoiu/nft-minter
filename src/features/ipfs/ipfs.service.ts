// filepath: /Users/alexnecsoiu/repos/linum/nft-minter/src/features/ipfs/ipfs.service.ts

import { PinataClient } from '@pinata/sdk';
import { IPFS_NODE } from '../../utils/constants'; // Assuming you have a constants file for environment variables

// Initialize Pinata client with API key and secret
const pinata = new PinataClient({
  apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  secretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
});

/**
 * Uploads an image file to IPFS and returns the IPFS hash.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} - The IPFS hash of the uploaded file.
 */
export const uploadImageToIpfs = async (file: File): Promise<string> => {
  try {
    const result = await pinata.pinFileToIPFS(file);
    return `${IPFS_NODE}/${result.IpfsHash}`; // Return the full IPFS URL
  } catch (error) {
    // Log error to a centralized logging service (e.g., Sentry)
    console.error('Error uploading image to IPFS:', error);
    throw new Error('Failed to upload image to IPFS');
  }
};

/**
 * Uploads metadata to IPFS and returns the IPFS hash.
 * @param {Object} metadata - The metadata object to upload.
 * @returns {Promise<string>} - The IPFS hash of the uploaded metadata.
 */
export const uploadMetadataToIpfs = async (metadata: object): Promise<string> => {
  try {
    const result = await pinata.pinJSONToIPFS(metadata);
    return `${IPFS_NODE}/${result.IpfsHash}`; // Return the full IPFS URL
  } catch (error) {
    // Log error to a centralized logging service (e.g., Sentry)
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
};