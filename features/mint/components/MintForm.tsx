'use client';

import { useState } from 'react';
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

const mintFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB'),
});

type MintFormData = z.infer<typeof mintFormSchema>;

export function MintForm() {
  const { isConnected } = useAccount();
  const { mintNFT, isSuccess, error } = useMint();
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const [dismissedSuccess, setDismissedSuccess] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue,
    watch,
  } = useForm<MintFormData>({
    resolver: zodResolver(mintFormSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: MintFormData) => {
    try {
      await mintNFT(data);
      reset();
      setSelectedImage(null);
    } catch (err) {
      console.error('Mint form submission error:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setValue('image', file, { shouldValidate: true });
    }
  };

  if (!isConnected) {
    return (
      <div className="rounded-lg border border-white/20 bg-white/5 p-4 text-center text-white/60">
        Please connect your wallet to mint NFTs.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && !dismissedError && (
        <ErrorAlert message={error} onDismiss={() => setDismissedError(error)} />
      )}

      {isSuccess && !dismissedSuccess && (
        <SuccessAlert
          message={`NFT minted successfully!`}
          onDismiss={() => setDismissedSuccess(true)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto space-y-6">
        {/* Image Upload Area */}
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-800/30">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={isSubmitting}
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

        {/* NFT Title Input */}
        <Input
          {...register('title')}
          placeholder="NFT Title"
          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 h-12 text-base"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}

        {/* Description Textarea */}
        <Textarea
          {...register('description')}
          placeholder="Description"
          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 min-h-[120px] text-base resize-none"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}

        {/* Mint Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 text-base border-0"
          disabled={isSubmitting || !isConnected || !isValid}
        >
          {isSubmitting ? 'Minting...' : 'Mint NFT'}
        </Button>
      </form>
    </div>
  );
}
