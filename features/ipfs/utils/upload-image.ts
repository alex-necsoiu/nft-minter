/**
 * Uploads an image directly to Pinata from the client-side.
 * Secure in dev/test. For production, migrate to serverless if needed.
 */

export const uploadImageToPinata = async (file: File): Promise<string> => {
    const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
  
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      throw new Error('Missing Pinata credentials');
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      body: formData,
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });
  
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Pinata upload failed: ${error}`);
    }
  
    const data = await res.json();
    return `https://ipfs.io/ipfs/${data.IpfsHash}`;
  };
  