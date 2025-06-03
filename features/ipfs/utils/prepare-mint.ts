'use client';

import { uploadImageToPinata } from '@/features/ipfs/utils/upload-image';
import { uploadMetadataToPinata } from '@/features/ipfs/utils/upload-metadata';

export async function prepareMint({
  file,
  title,
  description,
}: {
  file: File;
  title: string;
  description: string;
}): Promise<string> {
  const imageUrl = await uploadImageToPinata(file);

  const metadataUrl = await uploadMetadataToPinata({
    name: title,
    description,
    image: imageUrl,
    attributes: [
      { trait_type: 'App', value: 'NFT-Minter' },
      { trait_type: 'Created', value: new Date().toISOString() }
    ]
  });

  return metadataUrl;
}
