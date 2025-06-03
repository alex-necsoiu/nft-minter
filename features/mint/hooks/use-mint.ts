'use client';

import { useAccount, useContractWrite, useChainId } from 'wagmi';
import { prepareMint } from '@/features/ipfs/utils/prepare-mint';
import { useToast } from '@/hooks/use-toast';
import abi from '@/lib/contracts/nft';

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`;
const EXPECTED_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

/**
 * Hook to handle NFT minting logic.
 * Uploads metadata to IPFS and sends mint transaction to the NFT contract.
 */
export const useMint = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId(); // ✅ replaced deprecated useNetwork()
  const { toast } = useToast();

  const { writeAsync, isLoading, isSuccess, error } = useContractWrite({
    address: NFT_CONTRACT,
    abi,
    functionName: 'mint',
  });

  /**
   * Uploads image and metadata to IPFS and mints the NFT using the provided inputs.
   * @param file - Image file to be uploaded
   * @param title - NFT title
   * @param description - NFT description
   */
  const mintNFT = async ({
    file,
    title,
    description
  }: {
    file: File;
    title: string;
    description: string;
  }) => {
    if (!isConnected || !address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to mint.',
        variant: 'destructive'
      });
      throw new Error('Wallet not connected');
    }

    if (chainId !== EXPECTED_CHAIN_ID) {
      toast({
        title: 'Wrong network',
        description: 'Please switch to the Sepolia testnet.',
        variant: 'destructive'
      });
      throw new Error('Incorrect network');
    }

    try {
      const metadataUri = await prepareMint({ file, title, description });

      await writeAsync({
        args: [address, metadataUri]
      });

      toast({
        title: 'Minting initiated',
        description: 'Please confirm the transaction in your wallet.'
      });
    } catch (err: any) {
      console.error('❌ useMint: Error during mint process:', err);
      toast({
        title: 'Minting failed',
        description: err.message || 'Check the console for more information.',
        variant: 'destructive'
      });
      throw err;
    }
  };

  return {
    mintNFT,
    isLoading,
    isSuccess,
    error
  };
};
