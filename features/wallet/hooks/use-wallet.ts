'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { useChainId } from 'wagmi';
import { WalletState, WalletConnectOptions, WalletType } from '../types/wallet.types';
import { WalletConnectorsService } from '../services/wallet-connectors.service';
import { getWalletDisplayName } from '../utils/wallet-validation';
import { CONTRACT_CONFIG } from '@/lib/config/contract';

export const useWallet = () => {
  const [error, setError] = useState<string>();
  const [isConnectingSpecificWallet, setIsConnectingSpecificWallet] = useState<WalletType | null>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isConnecting: isWagmiConnecting, error: wagmiError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchingChain, error: switchChainError } = useSwitchChain();

  const isConnecting = isWagmiConnecting || isConnectingSpecificWallet !== null;

  useEffect(() => {
    console.log('Available connectors from useConnect:', connectors);
  }, [connectors]);

  useEffect(() => {
    if (wagmiError) {
      console.error('Wagmi connection error:', wagmiError);
      setError(wagmiError.message);
      setIsConnectingSpecificWallet(null);
    }
  }, [wagmiError]);

  useEffect(() => {
    if (switchChainError) {
      console.error('Wagmi switch chain error:', switchChainError);
      setError(switchChainError.message);
    }
  }, [switchChainError]);

  const connectWallet = useCallback(async (walletType: WalletType, options?: WalletConnectOptions) => {
    console.log(`Attempting to connect to ${walletType}`);
    setError(undefined);
    setIsConnectingSpecificWallet(walletType);

    try {
      const targetConnector = WalletConnectorsService.getConnector(walletType);
      console.log('Attempting connect with connector:', targetConnector);
      
      const result = await connect({ connector: targetConnector });
      console.log('Connect call initiated, result (promise):', result);

    } catch (err) {
      console.error('Error preparing connection attempt:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to prepare wallet connection';
      setError(errorMessage);
      setIsConnectingSpecificWallet(null);
      options?.onError?.(new Error(errorMessage));
    }
  }, [connect]);

  const disconnectWallet = useCallback(async () => {
    try {
      console.log('Attempting to disconnect');
      setError(undefined);
      await disconnect();
      console.log('Disconnected successfully');
    } catch (err) {
      console.error('Error in disconnectWallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
    }
  }, [disconnect]);

  const switchToSepolia = useCallback(async () => {
    console.log('Attempting to switch to Sepolia');
    setError(undefined);
    try {
      if (switchChain) {
        await switchChain({ chainId: CONTRACT_CONFIG.chainId });
        console.log('Switch chain call initiated');
      } else {
        console.warn('switchChain function not available');
        setError("Network switching not supported by this wallet.");
      }
    } catch (err) {
      console.error('Error during switch chain attempt:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch network');
    }
  }, [switchChain]);

  useEffect(() => {
    if (isConnected && address) {
      console.log('Wallet connected:', address, 'on chain:', chainId);
      setIsConnectingSpecificWallet(null);
      setError(undefined);
      if (chainId !== CONTRACT_CONFIG.chainId) {
        console.log('Connected to wrong network, need to switch to Sepolia');
      }
    } else if (!isConnected && !isConnecting && (wagmiError || error)) {
      console.log('Wallet connection failed or disconnected with error:', wagmiError || error);
      setIsConnectingSpecificWallet(null);
    } else if (!isConnected && !isConnecting && !wagmiError && !error) {
      console.log('Wallet disconnected (state updated)');
      setIsConnectingSpecificWallet(null);
    }
  }, [isConnected, address, chainId, isConnecting, wagmiError, error]);

  const walletState: WalletState = {
    isConnected,
    address,
    chainId,
    isConnecting,
    error: error || switchChainError,
  };

  return {
    walletState,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    isSwitchingChain,
  };
};
