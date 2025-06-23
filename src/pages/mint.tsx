import React from "react";
import Head from "next/head";
import MintForm from "@/features/mint/MintForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Mint page for NFT Sea.
 * Implements the main minting UI as per Figma design.
 */
const MintPage = () => (
  <>
    <Head>
      <title>Mint New NFT | NFT Sea</title>
      <meta name="description" content="Mint a new NFT on NFT Sea" />
    </Head>
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white">
      <Header />
      <main className="flex-1 flex flex-col">
        <MintForm />
      </main>
      <Footer />
    </div>
  </>
);

export default MintPage;