// filepath: /Users/alexnecsoiu/repos/linum/nft-minter/src/features/wallet/use-wallet.ts
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { sepolia } from 'wagmi/chains';

/**
 * useWallet provides wallet connection, disconnection, and network validation logic.
 * Returns connection state, address, and network status for use in UI and forms.
 */
export function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, isLoading: isConnecting } = useConnect({
    connector: injected,
  });
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  // Validate if user is on Sepolia
  const isCorrectNetwork = chainId === sepolia.id;

  return {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    isCorrectNetwork,
    currentChainId: chainId,
  };
}