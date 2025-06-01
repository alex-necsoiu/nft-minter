# nft-minter/README.md

# NFT Minter DApp

A Next.js, React, and Wagmi-based dApp for minting NFTs on Sepolia.

## Features

- Wallet connect (Wagmi)
- NFT minting (ERC721)
- IPFS image & metadata upload (Pinata)
- Form validation & notifications
- Sentry error logging
- Unit tests

## Getting Started

1. **Install dependencies:**
   ```sh
   yarn install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and fill in your values.

3. **Run the app:**
   ```sh
   yarn dev
   ```

4. **Run tests:**
   ```sh
   yarn test
   ```

## Environment Variables

- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_ALCHEMY_ENDPOINT`
- `NEXT_PUBLIC_NFT_ADDRESS`
- `NEXT_PUBLIC_PINATA_API_KEY`
- `NEXT_PUBLIC_PINATA_SECRET_API_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`

## Contract

- [Sepolia Contract on Etherscan](https://sepolia.etherscan.io/address/0xc507d4FbD9b5Bd102668c00a3eF7ec68bF95C6A1)
- [ABI JSON](src/features/mint/abi/Musharka721.json)

## Figma Design

[View Figma](https://www.figma.com/design/vX6RLjk87SFnhZVoIajbes/Untitled?node-id=0-1&t=zPd2PfvUSZxBPGIB-1)

---

## License

MIT