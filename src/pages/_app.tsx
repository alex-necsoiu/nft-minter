import '../styles/globals.css';
import { AppProps } from 'next/app';
import { WagmiConfig, createClient } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

// Create a Wagmi client
const client = createClient({
  autoConnect: true,
  connectors: () => [
    new InjectedConnector({
      chains: [{ id: 11155111, name: 'Sepolia', network: 'sepolia' }],
    }),
  ],
});

// Custom App component
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}

export default MyApp;