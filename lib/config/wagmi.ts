import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask(),
    walletConnect({ 
      projectId,
      showQrModal: true,
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