# NFT Minting Application

This is a decentralized application (dApp) for connecting a wallet and minting ERC721 NFTs on the Sepolia testnet. Users can upload an image, provide a title and description, and mint their unique NFT.

## Architecture

The application follows a **feature-first (domain-based)** architecture using the **Next.js App Router**. Key technologies and patterns include:

-   **React & TypeScript:** For building the user interface with strong typing.
-   **Next.js App Router:** Providing server-side rendering (SSR), API routes, and file-system based routing.
-   **Tailwind CSS:** For utility-first styling.
-   **Wagmi:** A React hook library for interacting with Ethereum and EVM chains.
-   **Viem:** A TypeScript interface for Ethereum that handles blockchain interactions.
-   **@tanstack/react-query:** For managing asynchronous data fetching and state, used by Wagmi.
-   **Pinata:** An IPFS pinning service used for storing NFT images and metadata (via a serverless API route).
-   **Serverless API Route:** Used to handle the secure interaction with the Pinata API keys for IPFS uploads.

The codebase is organized into features (e.g., `mint`, `ipfs`, `wallet`) under the `/features` directory, containing components, hooks, services, and types specific to that domain.

## Components

-   **MintForm:** The main form component on the minting page where users input NFT details (title, description, image) and trigger the minting process. Includes form validation and UI state management (loading, errors, success).
-   **ErrorAlert & SuccessAlert (under `components/ui`):** Reusable UI components for displaying dismissible error and success messages to the user.
-   **ConnectButton (Implicitly used via Wagmi):** While not a custom component in this structure, wallet connection is handled by integrating with Wagmi's hooks and potentially a library like `@rainbow-me/rainbowkit` or similar, which provides pre-built connection UI.

## File Structure and Explanation

Here's an overview of the key directories and files in the project:

-   `app/`:
    -   `layout.tsx`: The root layout of the application, setting up the HTML structure and including global providers like `WagmiProvider` and `QueryClientProvider`.
    -   `page.tsx`: The main page component, likely rendering the `MintForm` or the entry point for the minting feature.
    -   `globals.css`: Global styles, including Tailwind CSS imports.
    -   `api/`:
        -   `ipfs/`:
            -   `upload/`:
                -   `route.ts`: A Next.js serverless API route that handles receiving the NFT image file and metadata, uploading them to Pinata using server-side environment variables, and returning the IPFS URLs.

-   `components/`:
    -   `ui/`: Contains UI components, potentially generated or customized from a library like Shadcn/UI.
        -   `button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, etc.: Basic form and UI elements.
        -   `error-alert.tsx`: Reusable component for displaying error messages.
        -   `success-alert.tsx`: Reusable component for displaying success messages.

-   `features/`:
    -   `ipfs/`:
        -   `services/`:
            -   `ipfs.service.ts`: Client-side service class that provides an interface to interact with the `/api/ipfs/upload` serverless function.
        -   `types/`:
            -   `ipfs.types.ts`: TypeScript types for IPFS-related data structures and API responses.
        -   `utils/`:
            -   `file-validation.ts`: Utility functions for validating file properties (e.g., size, type) before upload.
    -   `mint/`:
        -   `components/`:
            -   `MintForm.tsx`: The React component for the NFT minting form.
        -   `hooks/`:
            -   `use-mint.ts`: A custom React hook encapsulating the minting logic, including calling the `MintService`, interacting with Wagmi hooks (`useContractWrite`, `useWaitForTransactionReceipt`, `useAccount`, `useChainId`), and managing the state of the minting process.
        -   `services/`:
            -   `mint.service.ts`: A service class responsible for orchestrating the minting preparation. It takes form data, interacts with the `IpfsService` to upload data, structures the NFT metadata, and prepares the necessary configuration (`request` object) for the Wagmi `writeContract` hook.
        -   `types/`:
            -   `mint.types.ts`: TypeScript types specific to the minting feature, such as form data structure, contract arguments, and the minting process state.
    -   `wallet/`:
        -   `hooks/`:
            -   `use-wallet.ts`: A custom hook for wallet connection logic (might be less central now with direct Wagmi `useAccount` usage in features).

-   `lib/`:
    -   `config/`:
        -   `wagmi.ts`: Configuration for the Wagmi client, specifying supported chains (Sepolia), connectors (MetaMask, WalletConnect, Injected), and transport layers.
        -   `ipfs.ts`: Configuration related to IPFS, like the IPFS gateway URL.
    -   `contracts/`:
        -   `nft.ts`: Contains the NFT smart contract address and ABI (Application Binary Interface).
    -   `providers/`:
        -   `WagmiProvider.tsx`: A wrapper component that sets up the Wagmi and `@tanstack/react-query` contexts for the application.
    -   `types/`:
        -   `nft.ts`: Shared TypeScript types, including the `NFTMetadata` structure.
    -   `utils.ts`: General utility functions used across the application (e.g., `cn` for conditional class names).

-   `public/`:
    -   Contains static assets served directly by Next.js (e.g., `upload.svg` used in the form).

-   `.env.local`:
    -   Environment variables file. **This file should not be committed to version control.** It should contain sensitive keys and configuration values like:
        -   `PINATA_API_KEY`
        -   `PINATA_SECRET_API_KEY`
        -   `NEXT_PUBLIC_CHAIN_ID`
        -   `NEXT_PUBLIC_ALCHEMY_ENDPOINT`
        -   `NEXT_PUBLIC_NFT_ADDRESS`
        -   `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

## Setup and Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    yarn install
    # or npm install
    ```
3.  Create a `.env.local` file in the root directory and add your environment variables (Pinata keys, contract address, etc.). Refer to the `.env.local` section above.
4.  Run the development server:
    ```bash
    yarn dev
    # or npm run dev
    ```
5.  Open your browser to `http://localhost:3000` (or the port shown in your terminal).

## Contributing

(Optional section for contribution guidelines)

## License

(Optional section for licensing information)