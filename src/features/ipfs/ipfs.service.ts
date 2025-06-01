// filepath: /Users/alexnecsoiu/repos/linum/nft-minter/src/features/ipfs/ipfs.service.ts

/**
 * Uploads an image file to IPFS via Pinata's REST API.
 * Returns the full IPFS gateway URL.
 */
export const uploadImageToIpfs = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const secretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
  const IPFS_NODE = process.env.NEXT_PUBLIC_IPFS_NODE || 'https://gateway.pinata.cloud/ipfs';

  if (!apiKey || !secretApiKey) {
    throw new Error('Pinata API keys are not set');
  }

  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretApiKey,
      } as any, // FormData will set the correct Content-Type
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return `${IPFS_NODE}/${result.IpfsHash}`;
  } catch (error) {
    // TODO: Replace with centralized logging (e.g., Sentry)
    console.error('Error uploading image to IPFS:', error);
    throw new Error('Failed to upload image to IPFS');
  }
};

/**
 * Uploads metadata JSON to IPFS via Pinata's REST API.
 * Returns the full IPFS gateway URL.
 */
export const uploadMetadataToIpfs = async (metadata: object): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const secretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
  const IPFS_NODE = process.env.NEXT_PUBLIC_IPFS_NODE || 'https://gateway.pinata.cloud/ipfs';

  if (!apiKey || !secretApiKey) {
    throw new Error('Pinata API keys are not set');
  }

  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretApiKey,
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return `${IPFS_NODE}/${result.IpfsHash}`;
  } catch (error) {
    // TODO: Replace with centralized logging (e.g., Sentry)
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
};