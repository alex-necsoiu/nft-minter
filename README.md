# nft-minter/README.md

# NFT Minter

NFT Minter is a Web3 decentralized application (dApp) built using Next.js, TypeScript, TailwindCSS, and Wagmi. This application allows users to connect their wallets and mint new NFTs by providing a title, description, and image.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/nft-minter.git
   cd nft-minter
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Copy the `.env.example` file to `.env` and fill in the required environment variables.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Connect your wallet using the WalletConnect component.
- Navigate to the minting page to create a new NFT.
- Fill in the title, description, and upload an image.
- Click the mint button to mint your NFT. The minting function will be disabled until your wallet is connected.

## Features

- Wallet connection using Wagmi.
- NFT minting functionality with error handling.
- Image and metadata storage on IPFS via Pinata.
- User notifications for successful or failed minting.

## Environment Variables

The following environment variables are required for the application to function correctly:

- `NEXT_PUBLIC_CHAIN_ID`: The chain ID for the Ethereum network (e.g., 11155111 for Sepolia).
- `NEXT_PUBLIC_ALCHEMY_ENDPOINT`: The Alchemy endpoint for connecting to the Ethereum network.
- `NEXT_PUBLIC_NFT_ADDRESS`: The deployed ERC721 contract address.
- `IPFS_NODE`: The IPFS node URL for storing files.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.