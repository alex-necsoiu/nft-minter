export interface WalletState {
  isConnected: boolean;
  address?: `0x${string}`;
  chainId?: number;
  isConnecting: boolean;
  error?: string;
}

export interface WalletConnectOptions {
  onSuccess?: (address: `0x${string}`) => void;
  onError?: (error: Error) => void;
}

export type WalletType = 'metaMask' | 'portis' | 'torus' | 'walletlink';
