import { sepolia } from 'wagmi/chains';

export const CONTRACT_CONFIG = {
  address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  chain: sepolia,
};

// Contract ABI for the NFT
export const NFT_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "uri", type: "string" }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;
