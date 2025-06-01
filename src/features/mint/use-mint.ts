// filepath: /Users/alexnecsoiu/repos/linum/nft-minter/src/features/mint/use-mint.ts
import { useState } from 'react';
import { useAccount, useNetwork, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { getNftContractConfig } from './mint.service';
import { MintFormValues } from './mint.types';
import { useNotification } from '../notification/use-notification';

/**
 * Custom hook for managing the NFT minting process.
 * It handles the state of the minting process and interacts with the smart contract.
 */
export const useMint = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { notify } = useNotification();
  
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contract = getNftContractConfig();
  const { writeContractAsync, data: txHash, isPending, error: contractError } = useWriteContract();
  const { isSuccess, isError } = useWaitForTransactionReceipt({ hash: txHash });

  /**
   * Function to mint an NFT.
   * @param values - The values from the minting form.
   */
  const mint = async (values: MintFormValues) => {
    if (!address) {
      notify('Please connect your wallet to mint an NFT.', 'error');
      return;
    }

    if (chain?.id !== Number(process.env.NEXT_PUBLIC_CHAIN_ID)) {
      notify('Please switch to the correct network.', 'error');
      return;
    }

    setIsMinting(true);
    setError(null);

    try {
      const uri = await mintNft(values); // Call the minting service to get the URI
      await writeContractAsync({
        ...contract,
        functionName: 'mint', // Change if your contract uses a different function name
        args: [address, uri],
      });
      notify('NFT minted successfully!', 'success');
    } catch (err) {
      setError('Minting failed. Please try again.');
      notify(error, 'error');
    } finally {
      setIsMinting(false);
    }
  };

  return {
    mint,
    isMinting,
    error,
    isPending,
    isSuccess,
    isError,
    contractError,
  };
};

/**
 * Custom hook to mint an NFT by calling the smart contract.
 * @returns mint function and status
 */
export function useMintNft() {
  const contract = getNftContractConfig();
  const { writeContractAsync, data: txHash, isPending, error } = useWriteContract();
  const { isSuccess, isError } = useWaitForTransactionReceipt({ hash: txHash });

  // Mint function expects the recipient address and tokenURI (metadata URL)
  const mint = async (to: string, tokenUri: string) => {
    return writeContractAsync({
      ...contract,
      functionName: 'mint', // Change if your contract uses a different function name
      args: [to, tokenUri],
    });
  };

  return {
    mint,
    isPending,
    isSuccess,
    isError,
    error,
  };
}