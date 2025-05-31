// filepath: /Users/alexnecsoiu/repos/linum/nft-minter/src/features/wallet/use-wallet.ts
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { InjectedConnector } from 'wagmi/connectors/injected';

// Custom hook for managing wallet connection and state
const useWallet = () => {
  const { isConnected, address } = useAccount();
  const { connect, disconnect } = useConnect();
  const [error, setError] = useState<string | null>(null);

  // Connect to the wallet using WalletConnect or Injected connector
  const connectWallet = async (connectorName: 'walletConnect' | 'injected') => {
    try {
      const connector =
        connectorName === 'walletConnect'
          ? new WalletConnectConnector({
              options: {
                qrcode: true,
              },
            })
          : new InjectedConnector();

      await connect(connector);
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
      console.error(err);
    }
  };

  // Disconnect the wallet
  const disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (err) {
      setError('Failed to disconnect wallet. Please try again.');
      console.error(err);
    }
  };

  // Effect to handle wallet connection state
  useEffect(() => {
    if (isConnected) {
      setError(null); // Clear any previous errors
    }
  }, [isConnected]);

  return {
    isConnected,
    address,
    connectWallet,
    disconnectWallet,
    error,
  };
};

export default useWallet;