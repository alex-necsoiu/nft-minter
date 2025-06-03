import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { createPublicClient } from 'viem';
import { injected } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''; // Assuming you might add WalletConnect later

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_ENDPOINT),
  },
  connectors: [
    injected(),
  ],
});
