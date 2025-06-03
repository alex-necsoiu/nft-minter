import { WalletType } from '../types/wallet.types';

export const validateWalletType = (walletType: string): walletType is WalletType => {
  return ['metaMask', 'walletConnect', 'portis', 'torus', 'walletlink'].includes(walletType);
};

export const getWalletDisplayName = (walletType: WalletType): string => {
  switch (walletType) {
    case 'metaMask':
      return 'MetaMask';
    case 'walletConnect':
      return 'WalletConnect';
    case 'portis':
      return 'Portis';
    case 'torus':
      return 'Torus';
    case 'walletlink':
      return 'WalletLink';
    default:
      return 'Unknown Wallet';
  }
};
