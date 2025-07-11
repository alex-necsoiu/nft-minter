// filepath: /Users/alexnecsoiu/repos/linum/nft-minter/src/features/mint/mint.service.ts

import { ethers } from 'ethers';
import { useContractWrite, useAccount, useNetwork } from 'wagmi';
import { Address } from 'viem';
import { sepolia } from 'wagmi/chains';
import { logError } from '../../utils/sentry-logger'; // Import centralized logging utility
import Musharka721Abi from './abi/Musharka721.json';

/**
 * Returns the NFT contract config for Wagmi hooks.
 * Replace 'erc721Abi' with your actual contract ABI if different.
 */
export function getNftContractConfig() {
  const address = process.env.NEXT_PUBLIC_NFT_ADDRESS as Address;
  if (!address) throw new Error('NFT contract address not set');
  return {
    address,
    abi: Musharka721Abi,
    chainId: 11155111,
  };
}

// Define the minting service function
export const mintNft = async (to: string, uri: string) => {
  try {
    // Get the user's account and network
    const { address } = useAccount();
    const { chain } = useNetwork();

    // Ensure the user is connected to the correct network
    if (chain?.id !== Number(process.env.NEXT_PUBLIC_CHAIN_ID)) {
      throw new Error('Please connect to the Sepolia network.');
    }

    // Create a new instance of the contract
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_NFT_ADDRESS,
      Musharka721Abi,
      new ethers.providers.Web3Provider(window.ethereum)
    );

    // Call the mint function on the contract
    const tx = await contract.mint(to, uri);
    await tx.wait(); // Wait for the transaction to be mined

    return tx; // Return the transaction details
  } catch (error) {
    // Log the error to the centralized logging service
    logError(error);
    throw error; // Rethrow the error for further handling
  }
};