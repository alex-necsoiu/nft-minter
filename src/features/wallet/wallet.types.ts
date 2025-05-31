// This file defines TypeScript types and interfaces related to wallet functionality.

export interface Wallet {
  address: string;
  isConnected: boolean;
}

export interface WalletConnectionStatus {
  isConnecting: boolean;
  isConnected: boolean;
  error?: string;
}