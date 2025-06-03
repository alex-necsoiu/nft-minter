'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { WalletType } from '../types/wallet.types';
import { getWalletDisplayName } from '../utils/wallet-validation';
import { logger } from '@/lib/utils/logger';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: WalletType) => void;
}

export const WalletConnectModal = ({ isOpen, onClose, onConnect }: WalletConnectModalProps) => {
  if (!isOpen) return null;

  const walletTypes: WalletType[] = ['metaMask', 'walletConnect', 'portis', 'torus', 'walletlink'];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative ml-auto w-96 h-full bg-gray-900 text-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">Connect Wallet</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {walletTypes.map((walletType) => (
            <Button
              key={walletType}
              variant="outline"
              className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-14"
              onClick={() => {
                logger.info('Wallet type selected', { walletType });
                onConnect(walletType);
              }}
            >
              <img 
                src={`/${walletType}.svg`} 
                alt={getWalletDisplayName(walletType)} 
                className="w-6 h-6 mr-3" 
              />
              Connect {getWalletDisplayName(walletType)}
            </Button>
          ))}
        </div>

        <div className="mt-8">
          <p className="text-gray-400 text-sm">
            {"Don't have a wallet? "}
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:underline"
              onClick={() => logger.info('Learn more link clicked')}
            >
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
