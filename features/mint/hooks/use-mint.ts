'use client';

import { useState, useCallback, useEffect } from 'react';
import { useContractWrite, useWaitForTransactionReceipt, useAccount, useChainId } from 'wagmi';
import { MintFormData, MintProcessResult, MintPreparationResult } from '../types/mint.types';
import { MintService } from '../services/mint.service';
import { useWallet } from '@/features/wallet/hooks/use-wallet';
import { NFTMetadata } from '@/lib/types/nft';

export const useMint = () => {
  const { address, chain, isConnected } = useAccount();
  const chainId = useChainId();

  const [mintState, setMintState] = useState<MintProcessResult & { isLoading: boolean; status: 'idle' | 'preparing' | 'uploading' | 'prompting' | 'mining' | 'success' | 'error' }>({
      success: false,
      isLoading: false,
      status: 'idle',
      error: undefined
  });

  const mintService = new MintService();

  const { 
      data: hash,
      writeContract,
      isPending: isWritingContract,
      error: writeError,
      reset: resetWrite,
  } = useContractWrite();

  const {
      isLoading: isConfirmingTransaction,
      isSuccess: isTransactionSuccessful,
      error: confirmationError,
  } = useWaitForTransactionReceipt({ 
      hash,
      confirmations: 1,
      chainId: chain?.id,
  });

  const isLoading = mintState.status === 'preparing' || mintState.status === 'uploading' || mintState.status === 'prompting' || mintState.status === 'mining' || isWritingContract || isConfirmingTransaction;
  const error = writeError?.message || confirmationError?.message || mintState.error;

  useEffect(() => {
      if (writeError) {
          console.error('useMint useEffect: Wagmi write error:', writeError);
          setMintState(prevState => ({
               ...prevState,
               success: false,
               isLoading: false,
               status: 'error',
               error: writeError.message,
           }));
      } else if (confirmationError) {
           console.error('useMint useEffect: Wagmi confirmation error:', confirmationError);
            setMintState(prevState => ({
                ...prevState,
                success: false,
                isLoading: false,
                status: 'error',
                error: confirmationError.message,
            }));
      } else if (isTransactionSuccessful) {
          console.log('useMint useEffect: Wagmi transaction successful:', hash);
          setMintState(prevState => ({
              ...prevState,
              success: true,
              transactionHash: hash,
              isLoading: false,
              status: 'success',
              error: undefined,
          }));
      } else if (hash && !isWritingContract && !isConfirmingTransaction && mintState.status !== 'success' && mintState.status !== 'mining') {
           console.log('useMint useEffect: Transaction sent, waiting for confirmation:', hash);
           setMintState(prevState => ({
              ...prevState,
              transactionHash: hash,
              status: 'mining',
              isLoading: true,
              error: undefined,
           }));
      } else if (!address && !isConnected && mintState.status !== 'idle') {
          console.log('useMint useEffect: Wallet disconnected, resetting mint state.');
          setMintState({
              success: false,
              isLoading: false,
              status: 'idle',
              error: undefined,
              transactionHash: undefined,
              ipfsImageUrl: undefined,
              ipfsMetadataUrl: undefined,
          });
      }
  }, [writeError, confirmationError, isTransactionSuccessful, hash, isWritingContract, isConfirmingTransaction, address, isConnected, mintState.status, chain?.id]);

  const mintNFT = useCallback(async (data: MintFormData) => {
    if (!isConnected || !address) {
      setMintState({ success: false, isLoading: false, status: 'error', error: 'Please connect your wallet first' });
      return;
    }

    // TODO: Re-enable and fix network check timing issue (Chain ID: 11155111)
    /*
    if (chainId !== Number(process.env.NEXT_PUBLIC_CHAIN_ID)) {
      setMintState({ success: false, isLoading: false, status: 'error', error: `Please switch to the correct network (Chain ID: ${process.env.NEXT_PUBLIC_CHAIN_ID}).` });
      return;
    }
    */

    setMintState({ success: false, isLoading: true, status: 'preparing', transactionHash: undefined, ipfsImageUrl: undefined, ipfsMetadataUrl: undefined, error: undefined });
    resetWrite();

    try {
      const nftMetadataInput: Omit<NFTMetadata, 'image'> = {
          name: data.title,
          description: data.description,
      };

      console.log('useMint: Calling mintService.prepareMint (includes API upload)');
      setMintState(prevState => ({ ...prevState, status: 'uploading', isLoading: true }));

      const { request, ipfsImageUrl, ipfsMetadataUrl } = await mintService.prepareMint(data.image, nftMetadataInput);

      const finalRequest = {
          ...request,
          args: [address, request.args[1]],
      };

      setMintState(prevState => ({
        ...prevState,
        ipfsImageUrl: ipfsImageUrl,
        ipfsMetadataUrl: ipfsMetadataUrl,
        status: 'prompting',
        isLoading: true,
        error: undefined,
      }));

      await writeContract(finalRequest);

      console.log('useMint: Contract write call initiated. Wagmi state will update.');

    } catch (err: any) {
      console.error('useMint: Error during mint process before contract write:', err);
      setMintState({ success: false, isLoading: false, status: 'error', error: err instanceof Error ? err.message : 'An unexpected error occurred during minting preparation.' });
    }

  }, [address, chain?.id, isConnected, mintService, writeContract, resetWrite]);

  return {
    mintState,
    mintNFT,
    isWritingContract,
    isConfirmingTransaction,
    error
  };
};
