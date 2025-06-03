'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { useChainId } from 'wagmi';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { WalletConnectModal } from './WalletConnectModal';
import { WalletType } from '../types/wallet.types';
import { CONTRACT_CONFIG } from '@/lib/config/contract';
import { getWalletDisplayName } from '../utils/wallet-validation';
import { useWallet } from '@/features/wallet/hooks/use-wallet';
import { logger } from '@/lib/utils/logger';

export const WalletConnect = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    logger.info('WalletConnect component mounted');
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    walletState,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    isSwitchingChain,
  } = useWallet();

  const { isConnected, address, chainId, isConnecting, error } = walletState;

  useEffect(() => {
    if (isConnected && isModalOpen) {
      logger.info('Wallet connected, closing modal');
      setIsModalOpen(false);
    }
  }, [isConnected, isModalOpen]);

  useEffect(() => {
    if (error) {
      logger.error('Wallet connection error', error);
    }
  }, [error]);

  if (!mounted) {
    return null;
  }

  if (isConnected) {
    if (chainId !== CONTRACT_CONFIG.chainId) {
      logger.warn('Wrong network detected', { currentChainId: chainId, requiredChainId: CONTRACT_CONFIG.chainId });
      return (
        <div className="flex items-center gap-2 text-sm text-red-400">
          Wrong Network!
          <Button
            onClick={() => {
              logger.info('Switching to Sepolia network');
              switchToSepolia();
            }}
            disabled={isSwitchingChain || isConnecting}
            variant="ghost"
            className="bg-black/60 text-white hover:bg-black/80"
          >
            {isSwitchingChain ? 'Switching...' : 'Switch to Sepolia'}
          </Button>
          <Button
            onClick={() => {
              logger.info('Disconnecting wallet due to wrong network');
              disconnectWallet();
            }}
            variant="ghost"
            className="bg-black/60 text-white hover:bg-black/80"
          >
            Disconnect
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-white">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <Button
          onClick={() => {
            logger.info('Disconnecting wallet');
            disconnectWallet();
          }}
          variant="ghost"
          className="bg-black/60 text-white hover:bg-black/80"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        className="bg-black/60 text-white hover:bg-black/80 flex items-center gap-2 px-4 py-2 h-auto rounded-md"
        onClick={() => {
          logger.info('Opening wallet connection modal');
          setIsModalOpen(true);
        }}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        <img src="/wallet.svg" alt="Wallet" className="w-5 h-5" />
      </Button>

      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => {
          logger.info('Closing wallet connection modal');
          setIsModalOpen(false);
        }}
        onConnect={(walletType) => {
          logger.info('Connecting wallet', { walletType });
          connectWallet(walletType);
        }}
      />

      {error && (
        <div className="text-sm text-red-500 mt-2 text-center">
          Error: {error}
        </div>
      )}
    </>
  );
};
