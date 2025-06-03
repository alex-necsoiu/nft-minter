'use client';

import { useWallet } from '../hooks/use-wallet';

export const WalletInfo = () => {
  const { walletState } = useWallet();
  const { isConnected, address, chainId } = walletState;

  if (!isConnected) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Wallet Information</h3>
      <div className="space-y-2">
        <div>
          <span className="font-medium">Address:</span>{' '}
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <div>
          <span className="font-medium">Network:</span>{' '}
          {chainId === 11155111 ? 'Sepolia' : 'Unknown'}
        </div>
      </div>
    </div>
  );
};
