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

  const [mintState, setMintState] = useState<MintProcessResult & { isLoading: boolean; status: 'idle' | 'preparing' | 'uploading' | 'prepared' | 'prompting' | 'mining' | 'success' | 'error', preparedRequest?: any }>({
      success: false,
      isLoading: false,
      status: 'idle',
      error: undefined,
      preparedRequest: undefined,
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
               preparedRequest: undefined, // Clear prepared request on error
           }));
      } else if (confirmationError) {
           console.error('useMint useEffect: Wagmi confirmation error:', confirmationError);
            setMintState(prevState => ({
                ...prevState,
                success: false,
                isLoading: false,
                status: 'error',
                error: confirmationError.message,
                preparedRequest: undefined, // Clear prepared request on error
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
              preparedRequest: undefined, // Clear prepared request on success
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
              preparedRequest: undefined,
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

    setMintState({ success: false, isLoading: true, status: 'preparing', transactionHash: undefined, ipfsImageUrl: undefined, ipfsMetadataUrl: undefined, error: undefined, preparedRequest: undefined });
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

      console.log('useMint: IPFS upload complete, request prepared.', finalRequest);
      setMintState(prevState => ({
        ...prevState,
        ipfsImageUrl: ipfsImageUrl,
        ipfsMetadataUrl: ipfsMetadataUrl,
        status: 'prepared', // New status: ready for transaction prompt
        isLoading: false, // Not loading while waiting for user prompt
        error: undefined,
        preparedRequest: finalRequest, // Store the prepared request
      }));

      // IMPORTANT: Do NOT call writeContract here anymore.
      // await writeContract(finalRequest);
      // console.log('useMint: Contract write call initiated. Wagmi state will update.');

    } catch (err: any) {
      console.error('useMint: Error during mint process before contract write:', err);
      setMintState({ success: false, isLoading: false, status: 'error', error: err instanceof Error ? err.message : 'An unexpected error occurred during minting preparation.', preparedRequest: undefined });
    }

  }, [address, chain?.id, isConnected, mintService, resetWrite]);

  const confirmMintTransaction = useCallback(async () => {
      if (!mintState.preparedRequest) {
          console.error('useMint: No prepared request found for transaction confirmation.');
          setMintState(prevState => ({ ...prevState, success: false, isLoading: false, status: 'error', error: 'Mint data not prepared.' }));
          return;
      }

      setMintState(prevState => ({ ...prevState, status: 'prompting', isLoading: true, error: undefined }));

      try {
          console.log('useMint: Calling writeContract...', mintState.preparedRequest);
          await writeContract(mintState.preparedRequest); // Call writeContract here
          // Wagmi hooks will handle status updates from here (isWritingContract, isConfirmingTransaction)
      } catch (err: any) {
           console.error('useMint: Error during contract write prompt:', err);
           // Wagmi's useContractWrite hook error will also update state, 
           // but we can add a specific state update here if needed
           setMintState(prevState => ({
               ...prevState,
               success: false,
               isLoading: false,
               status: 'error',
               error: err instanceof Error ? err.message : 'Failed to prompt wallet transaction.',
               preparedRequest: undefined, // Clear prepared request on error
           }));
      }
  }, [mintState.preparedRequest, writeContract]);

  const resetMintProcess = useCallback(() => {
      console.log('useMint: Resetting mint process state.');
      setMintState({
          success: false,
          isLoading: false,
          status: 'idle',
          error: undefined,
          transactionHash: undefined,
          ipfsImageUrl: undefined,
          ipfsMetadataUrl: undefined,
          preparedRequest: undefined,
      });
      resetWrite(); // Also reset wagmi's useContractWrite state
  }, [resetWrite]);

  return {
    mintState,
    mintNFT, // This now only prepares data
    confirmMintTransaction, // New function to trigger the contract write
    resetMintProcess, // New function to reset the mint process state
    isWritingContract,
    isConfirmingTransaction,
    error
  };
};
