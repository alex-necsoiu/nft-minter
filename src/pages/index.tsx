import React from 'react';
import Head from 'next/head';
import WalletConnect from '../features/wallet/WalletConnect';
import MintForm from '../features/mint/MintForm';
import Notification from '../features/notification/Notification';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>NFT Minter</title>
        <meta name="description" content="Mint your own NFTs easily." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-4xl font-bold mb-6">Welcome to NFT Minter</h1>
      <WalletConnect />
      <MintForm />
      <Notification />
    </div>
  );
};

export default Home;