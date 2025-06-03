# 🖼️ NFT Minter dApp

A full-stack, gas-fee–aware decentralized application (dApp) built with **React**, **Next.js (App Router)**, **TypeScript**, **TailwindCSS**, **Wagmi**, and **Viem**. It enables users to connect their wallet and mint NFTs on the **Sepolia Ethereum testnet**. Image and metadata are uploaded to **IPFS via Pinata**, and the mint function interacts with an ERC-721 smart contract.

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Figma Design](#figma-design)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)
7. [Usage](#usage)
8. [Testing](#testing)
9. [Screenshots](#screenshots)

---

## 🧩 Overview

This app allows users to mint NFTs using a user-friendly form. Upon submission, the app:

- Uploads the image to IPFS via Pinata
- Generates compliant metadata JSON using the [OpenSea Metadata Standard](https://docs.opensea.io/docs/metadata-standards)
- Uploads metadata to IPFS
- Calls the `mint(to, uri)` function on a deployed ERC-721 contract via Wagmi

---

## 🛠 Tech Stack

| Layer         | Tech                              |
|---------------|-----------------------------------|
| Frontend      | React, Next.js App Router, Tailwind |
| Web3          | wagmi v2, viem                    |
| Styling       | TailwindCSS                       |
| Decentralized Storage | Pinata (IPFS)             |
| Smart Contract | ERC721 (Sepolia testnet)         |
| Wallet Support| Injected (MetaMask)               |

---

## ✨ Features

- ✅ Wallet connection (Injected)
- ✅ Image + metadata upload to IPFS via Pinata
- ✅ Fully responsive minting form with validation
- ✅ Confirmation screen with wallet transaction feedback
- ✅ Error/success feedback with dismissible alerts
- ✅ Follows [cursor.rules.json](./cursor.rules.json) conventions

---

## 🎨 Figma Design

Design reference:  
[🔗 View Figma Mockup](https://www.figma.com/design/vX6RLjk87SFnhZVoIajbes/Untitled?node-id=0-1)

Implemented Screens:
- [x] Wallet Connection
- [x] NFT Minting Form
- [x] Confirmation Modal

---

## 🗂 Project Structure

```
.
├── app/                      # App router pages and APIs
│   └── api/ipfs/upload       # IPFS upload API route
├── components/               # UI and shared components
├── features/                 # Domain-driven logic
│   ├── ipfs/                 # IPFS upload service, types, and validation
│   ├── mint/                 # Mint form, logic and hooks
│   └── wallet/               # Wallet connection service
├── lib/                      # Configs and contract wrappers
├── public/                   # Static assets
├── styles/                  # Tailwind globals
└── ...
```

---

## 🔐 Environment Variables

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_ALCHEMY_ENDPOINT=https://eth-sepolia.g.alchemy.com/v2/your-key
NEXT_PUBLIC_NFT_ADDRESS=0xc507d4FbD9b5Bd102668c00a3eF7ec68bF95C6A1
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_API_KEY=your-pinata-secret-key
```

---

## 🚀 Usage

### 1. Install dependencies

```bash
yarn install
```

### 2. Run the dev server

```bash
yarn dev
```

### 3. Connect MetaMask and mint NFTs

- Ensure you're on the **Sepolia Testnet**
- Mint via the form at `/`

---

## ✅ Testing

The following parts of the application are tested:

| Unit                         | Status     |
|-----------------------------|------------|
| IPFS image validation       | ✅ Fully covered via `file-validation.ts` tests
| Metadata upload util        | ✅ Unit tested with mocked Pinata
| Minting hook (`use-mint.ts`)| ✅ Mocked contract call flow
| Wallet connection           | 🔶 Smoke tested manually
| API IPFS route (`route.ts`) | ✅ Integration tested with form

Test coverage focuses on validating:
- Max file size (≤ 5MB)
- Metadata generation format
- Pinata upload behavior
- Wagmi contract interaction via mocks

Run tests:

```bash
yarn test
```

---

## 📸 Screenshots

### 📍 NFT Mint Form
![Mint Form](./public/screenshot-mint.png)

### ✅ Confirmation Modal
![Confirmation](./public/screenshot-confirmation.png)

---

## 📝 License

MIT © 2025 Alex Necsoiu