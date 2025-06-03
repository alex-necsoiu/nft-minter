export interface IpfsUploadResponse {
  success: boolean;
  ipfsHash?: string; // CID (Content Identifier) of the uploaded file
  error?: string;
}

export interface NFTMetadataUploadResponse {
  success: boolean;
  ipfsHash?: string; // CID of the uploaded metadata JSON
  error?: string;
}

// You might add types for Pinata specific responses if needed, but these are sufficient for the service
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: {
    trait_type: string;
    value: string | number;
  }[];
}
