import { NFTMetadata } from '@/lib/types/nft'; // Import shared NFTMetadata type

// Represents the data collected from the minting form
export type MintFormData = {
  title: string;
  description: string;
  image: File; // File object from the file input
  // attributes: NFTAttribute[]; // Add if needed
};

// Type for the result of the preparation step (before contract write)
// This is what mintService.prepareMint will return
export type MintPreparationResult = {
  request: any; // The contract write config needed by useContractWrite
  ipfsImageUrl: string; // URL of the uploaded image on IPFS
  ipfsMetadataUrl: string; // URL of the uploaded metadata on IPFS
};

// Type for the final result after the minting process (including transaction)
// This is what the useMint hook state will hold
export type MintProcessResult = {
  success: boolean;
  // Optional fields available upon success
  transactionHash?: `0x${string}`;
  ipfsImageUrl?: string;
  ipfsMetadataUrl?: string;
  // Optional field available upon error
  error?: string;
};

// The arguments for the contract's mint function
// Based on your ABI: mint(address to, string tokenURI_)
export type MintContractArgs = {
  to: `0x${string}`;
  uri: string;
};
