'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMint } from '../hooks/use-mint';
import { ErrorAlert } from '@/components/ui/error-alert';
import { SuccessAlert } from '@/components/ui/success-alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAccount } from 'wagmi';
import { logger } from '@/lib/utils/logger';
import { MintProcessResult } from '../types/mint.types';

const mintFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB'),
});

export type MintFormData = z.infer<typeof mintFormSchema>;

interface MintFormProps {
  onSubmit: (data: MintFormData) => Promise<void>;
  mintState: MintProcessResult & { isLoading: boolean; status: 'idle' | 'preparing' | 'uploading' | 'prepared' | 'prompting' | 'mining' | 'success' | 'error', preparedRequest?: any };
  error: string | undefined;
  isSubmitting: boolean;
}

export function MintForm({ onSubmit, mintState, error, isSubmitting }: MintFormProps) {
  const { isConnected, chain } = useAccount();
  const { mintNFT, mintState: internalMintState, error: internalError } = useMint();
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const [dismissedSuccess, setDismissedSuccess] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<MintFormData>({
    resolver: zodResolver(mintFormSchema),
  });

  const handleFormSubmit = async (data: MintFormData) => {
    try {
      logger.info('MintForm: Submitting form data to parent handler.', { title: data.title });
      await onSubmit(data);
    } catch (err) {
      const submitError = err instanceof Error ? err : new Error('Unknown error occurred');
      logger.error('MintForm: Error during form submission.', submitError);
    }
  };

  const handleDismissError = () => {
    logger.debug('Error alert dismissed');
    setDismissedError(error || null);
  };

  const handleDismissSuccess = () => {
    logger.debug('Success alert dismissed');
    setDismissedSuccess(mintState.transactionHash || null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      logger.debug('File selected', { fileName: file.name, fileSize: file.size });
      setSelectedImage(file);
      setValue('image', file);
    }
  };

  useEffect(() => {
    logger.debug('MintForm useEffect: mintState.status changed to:', mintState.status);
    if (mintState.status === 'idle' || mintState.status === 'prepared' || mintState.status === 'success' || mintState.status === 'error') {
      logger.debug('MintForm: Mint process ended or reset, resetting form.');
      reset();
      setSelectedImage(null);
      setDismissedError(null);
      setDismissedSuccess(null);
    }
  }, [mintState.status, reset]);

  if (!isConnected) {
    logger.info('Wallet not connected, showing connect wallet message');
    return (
      <div className="rounded-lg border p-4 text-center">
        <p className="text-muted-foreground">Please connect your wallet to mint NFTs</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && !dismissedError && (
        <ErrorAlert
          message={error}
          onDismiss={handleDismissError}
        />
      )}

      {mintState.status === 'success' && mintState.transactionHash && !dismissedSuccess && (
        <SuccessAlert
          message={`NFT minted successfully! Transaction hash: ${mintState.transactionHash}`}
          onDismiss={handleDismissSuccess}
        />
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-lg mx-auto space-y-6">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-800/30">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={isSubmitting || mintState.isLoading}
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            {selectedImage ? (
              <p className="text-white font-medium">{selectedImage.name}</p>
            ) : (
              <>
                <img src="/upload.svg" alt="Upload" className="w-8 h-8 mx-auto mb-3" />
                <p className="text-white font-medium mb-1">Upload Image</p>
                <p className="text-gray-400 text-sm">format supported</p>
              </>
            )}
          </label>
          {errors.image && (
            <p className="text-sm text-destructive mt-2">{errors.image.message}</p>
          )}
        </div>

        <Input
          {...register('title')}
          placeholder="NFT Title"
          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 h-12 text-base"
          disabled={isSubmitting || mintState.isLoading}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}

        <Textarea
          {...register('description')}
          placeholder="Description"
          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 min-h-[120px] text-base resize-none"
          disabled={isSubmitting || mintState.isLoading}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 text-base border-0"
          disabled={isSubmitting || mintState.isLoading || !isConnected || !isValid}
        >
          {isSubmitting || mintState.isLoading ? (
             mintState.status === 'preparing' ? 'Preparing...' :
             mintState.status === 'uploading' ? 'Uploading to IPFS...' :
             mintState.status === 'prompting' ? 'Check Wallet...' :
             'Minting...'
          ) : 'Mint NFT'}
        </Button>
      </form>
    </div>
  );
}
