// features/ipfs/services/ipfs.service.ts

// Remove Pinata SDK import
// import pinataSDK, { PinataPinByFileOptions, PinataMetadata } from '@pinata/sdk';
import { IpfsUploadResponse, NFTMetadataUploadResponse } from '../types/ipfs.types';
// Remove IPFS_CONFIG import as keys are server-side
// import { IPFS_CONFIG } from '@/lib/config/ipfs';
import { NFTMetadata } from '@/lib/types/nft'; // Import NFTMetadata type

export class IpfsService {
  // Remove pinata instance
  // private pinata: pinataSDK;

  constructor() {
    // Remove Pinata SDK initialization
    // const { pinataApiKey, pinataSecretKey } = IPFS_CONFIG;
    // if (!pinataApiKey || !pinataSecretKey) { ... }
    // this.pinata = new pinataSDK(pinataApiKey, pinataSecretKey);
  }

  /**
   * Uploads a file and its associated metadata to IPFS via the serverless API route.
   * The server handles validation and interaction with Pinata.
   * @param file The file to upload.
   * @param metadata The NFT metadata object.
   * @returns A promise resolving to an object containing success status and IPFS URLs.
   */
  async uploadNFTData(file: File, metadata: Omit<NFTMetadata, 'image'>): Promise< {success: boolean; ipfsImageUrl?: string; ipfsMetadataUrl?: string; error?: string; } > {
      console.log('Preparing data for IPFS upload API:', { file: file.name, metadata }); // Debug log

      // Use FormData to send both the file and metadata (as a JSON string)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata)); // Send metadata as JSON string

      try {
          // Make the POST request to our API route
          const response = await fetch('/api/ipfs/upload', {
              method: 'POST',
              body: formData, // FormData will be automatically set with appropriate headers
          });

          // Parse the JSON response from the API route
          const result = await response.json();

          console.log('Response from /api/ipfs/upload:', result); // Debug log

          // The API route is designed to return { success: boolean, ipfsImageUrl?: string, ipfsMetadataUrl?: string, error?: string }
          return result;

      } catch (error) {
          console.error('Error calling IPFS upload API route:', error); // Debug log
          return { success: false, error: error instanceof Error ? error.message : 'Failed to communicate with IPFS upload service.' };
      }
  }

    // Remove individual upload methods if they are no longer used directly by the client
    // async uploadFile(...) {}
    // async uploadMetadata(...) {}
}
