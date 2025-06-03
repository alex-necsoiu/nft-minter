import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { logger } from '@/lib/utils/logger'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

if (!projectId) {
  logger.warn('WalletConnect project ID is not set. WalletConnect will not work properly.');
}

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask(),
    walletConnect({ 
      projectId,
      showQrModal: true,
      metadata: {
        name: 'NFT Minting App',
        description: 'Mint your NFTs on Sepolia',
        url: 'https://nft-minting-app.vercel.app',
        icons: ['https://nft-minting-app.vercel.app/logo.svg']
      },
    }),
    coinbaseWallet({
      appName: 'NFT Minting App',
      appLogoUrl: 'https://nft-minting-app.vercel.app/logo.svg',
    }),
    injected({
      target: 'metaMask',
      shimDisconnect: true,
    }),
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_ENDPOINT),
  },
  ssr: false,
}) 