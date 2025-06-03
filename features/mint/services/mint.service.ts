import { MintFormData, MintContractArgs, MintProcessResult } from '../types/mint.types';
import { IpfsService } from '@/features/ipfs/services/ipfs.service';
import { NFTMetadata } from '@/lib/types/nft';
import { IPFS_GATEWAY } from '@/lib/config/ipfs';
import { validateImageFile } from '@/features/ipfs/utils/file-validation';
import { writeContract } from 'wagmi/actions';
import { NFT_CONTRACT_ABI } from '@/lib/contracts/nft';
import { parseEther } from 'viem';
import axios from 'axios';
import { MintPreparationResult } from '../types/mint.types';

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_ADDRESS!;

export class MintService {
  private ipfsService: IpfsService;

  constructor() {
    this.ipfsService = new IpfsService();
  }

  /**
   * Prepares the minting process by uploading image and metadata to IPFS via the API
   * and preparing the configuration object for the smart contract mint function.
   * This method does NOT interact with the blockchain directly.
   *
   * @param file The image file to upload.
   * @param metadataInput An object containing the title and description for the metadata.
   * @returns A promise resolving to a MintPreparationResult containing the contract write config and IPFS URLs.
   */
  async prepareMint(file: File, metadataInput: Omit<NFTMetadata, 'image'>): Promise<MintPreparationResult> {
    console.log('MintService: Preparing mint...'); // Debug log
    try {
      // Validate metadata
      if (!metadataInput.name) {
        throw new Error('NFT name is required');
      }
      if (!metadataInput.description) {
        throw new Error('NFT description is required');
      }

      // Validate file
      if (!file) {
        throw new Error('Image file is required');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Validate file size (5MB limit)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('Image file size must be less than 5MB');
      }

      // 1. Upload to IPFS using the dedicated upload function (via API)
      console.log('MintService: Calling uploadNFTData (via API)'); // Debug log
      
      // Map the form data to match NFTMetadata format (without image)
      const metadataForUpload: Omit<NFTMetadata, 'image'> = {
          name: metadataInput.name,
          description: metadataInput.description,
      };

      const { success, ipfsImageUrl, ipfsMetadataUrl, error } = await this.ipfsService.uploadNFTData(file, metadataForUpload);

      if (!success || !ipfsImageUrl || !ipfsMetadataUrl) {
        throw new Error(error || 'Failed to upload to IPFS');
      }

      console.log('MintService: IPFS upload successful. Image URL:', ipfsImageUrl, 'Metadata URL:', ipfsMetadataUrl); // Debug log

      // 2. Prepare arguments for the contract mint function
      const contractArgs: [string, string] = [
          '0x0000000000000000000000000000000000000000', // Placeholder address
          ipfsMetadataUrl, // The URI should point to the metadata JSON on IPFS
      ];

      // 3. Prepare contract write configuration
      console.log('MintService: Preparing contract write config...'); // Debug log
      const request = {
        address: NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_CONTRACT_ABI,
        functionName: 'mint',
        args: contractArgs,
      };

      console.log('MintService: Contract write config prepared.'); // Debug log

      // 4. Return the prepared request along with IPFS data
      return { 
        request, 
        ipfsImageUrl, 
        ipfsMetadataUrl 
      };

    } catch (error: any) {
      console.error('MintService: Error during mint preparation:', error); // Debug log
      throw error; // Propagate the original error
    }
  }

  async prepareMintFromFile(file: File, metadata: NFTMetadata) {
    try {
      // Validate metadata
      if (!metadata.name) {
        throw new Error('NFT name is required');
      }
      if (!metadata.description) {
        throw new Error('NFT description is required');
      }
      if (!metadata.image) {
        throw new Error('NFT image URL is required in metadata');
      }

      // Validate file
      if (!file) {
        throw new Error('Image file is required');
      }

      // Validate file type (optional depending on whether the API handles this)
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Validate file size (5MB limit, optional depending on API)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('Image file size must be less than 5MB');
      }

      const { success, ipfsImageUrl, ipfsMetadataUrl, error } = await this.ipfsService.uploadNFTData(file, metadata);

      if (!success || !ipfsImageUrl || !ipfsMetadataUrl) {
        throw new Error(error || 'Failed to upload to IPFS');
      }

      // Prepare contract write configuration
      const request = {
        address: NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFT_CONTRACT_ABI,
        functionName: 'mint',
        args: [metadata.name, ipfsMetadataUrl],
      };

      return { request, ipfsImageUrl, ipfsMetadataUrl };
    } catch (error) {
      console.error('Mint preparation error:', error);
      throw error; // Propagate the original error
    }
  }

  // Removed executeMint method as execution is handled in the hook
  // async executeMint(request: any): Promise<`0x${string}`> {
  //   // This logic is now handled by the useContractWrite hook in use-mint.ts
  //   // ...
  // }

  // Placeholder for the older prepareMint logic (can be removed if not needed)
  // async prepareMint(data: MintFormData, recipientAddress: `0x${string}`): Promise<any> {
  //    ...
  // }
}
