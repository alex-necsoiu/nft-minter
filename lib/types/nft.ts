export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

export interface MintFormData {
  title: string;
  description: string;
  image: File | null;
}

export interface MintResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
}
