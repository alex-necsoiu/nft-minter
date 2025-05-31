// This file defines TypeScript types and interfaces related to the minting feature, ensuring type safety.

export interface MintFormValues {
  title: string;
  description: string;
  image: File | null; // The image file to be uploaded
}

export interface MintResponse {
  success: boolean;
  message: string; // Message to display to the user
  tokenId?: string; // Optional token ID if minting is successful
}

export interface MintError {
  code: number; // Error code
  message: string; // Error message to display to the user
}