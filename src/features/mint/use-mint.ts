// filepath: /Users/alexnecsoiu/repos/linum/nft-minter/src/features/mint/use-mint.ts
import { useState } from 'react';
import { useAccount, useContractWrite, useNetwork } from 'wagmi';
import { mintNft } from './mint.service';
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
      // Here you would call the smart contract mint function
      // await contract.mint(address, uri);
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
  };
};