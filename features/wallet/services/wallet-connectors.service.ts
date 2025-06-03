import { injected } from 'wagmi/connectors';
import { WalletType } from '../types/wallet.types';

export class WalletConnectorsService {
  static getConnector(walletType: WalletType) {
    switch (walletType) {
      case 'metaMask':
        return injected({
          target: 'metaMask',
          shimDisconnect: true,
        });
      case 'portis':
        return injected({
          target: 'portis',
          shimDisconnect: true,
        });
      case 'torus':
        return injected({
          target: 'torus',
          shimDisconnect: true,
        });
      case 'walletlink':
        return injected({
          target: 'walletlink',
          shimDisconnect: true,
        });
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
  }
}