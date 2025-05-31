// This file exports shared TypeScript types and interfaces used throughout the application.

export interface MintFormValues {
    title: string;
    description: string;
    image: File | null;
}

export interface NftMetadata {
    title: string;
    description: string;
    image: string; // IPFS URL
}

export interface WalletConnection {
    isConnected: boolean;
    address: string | null;
}

export interface Notification {
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
}