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

export const WalletConnect = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      setIsModalOpen(false);
    }
  }, [isConnected, isModalOpen]);

  if (!mounted) {
    return null;
  }

  if (isConnected) {
    if (chainId !== CONTRACT_CONFIG.chainId) {
      return (
        <div className="flex items-center gap-2 text-sm text-red-400">
          Wrong Network!
          <Button
            onClick={switchToSepolia}
            disabled={isSwitchingChain || isConnecting}
            variant="ghost"
            className="bg-black/60 text-white hover:bg-black/80"
          >
            {isSwitchingChain ? 'Switching...' : 'Switch to Sepolia'}
          </Button>
          <Button
            onClick={disconnectWallet}
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
          onClick={disconnectWallet}
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
          console.log('Opening wallet modal');
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
          console.log('Closing wallet modal');
          setIsModalOpen(false);
        }}
        onConnect={connectWallet}
      />

      {error && (
        <div className="text-sm text-red-500 mt-2 text-center">
          Error: {error}
        </div>
      )}
    </>
  );
};
