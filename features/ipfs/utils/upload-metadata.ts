/**
 * Uploads OpenSea-compliant NFT metadata JSON to IPFS using Pinata.
 * Returns the full IPFS gateway URL to the uploaded metadata.
 */

import type { NFTMetadata } from '@/features/ipfs/types/ipfs.types';

export const uploadMetadataToPinata = async (
  metadata: NFTMetadata
): Promise<string> => {
  const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

  if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    throw new Error('Missing Pinata credentials');
  }

  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
    body: JSON.stringify({
      pinataMetadata: {
        name: `nft-metadata-${metadata.name.replace(/\s+/g, '-').toLowerCase()}`,
      },
      pinataContent: metadata,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Pinata metadata upload failed: ${errorDetails}`);
  }

  const data = await response.json();
  return `https://ipfs.io/ipfs/${data.IpfsHash}`;
};
