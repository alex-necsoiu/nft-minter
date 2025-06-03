import { NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';
import { NFTMetadata } from '@/lib/types/nft'; // Assuming NFTMetadata is needed here
import { IPFS_GATEWAY } from '@/lib/config/ipfs'; // Assuming IPFS_GATEWAY is needed here

// Ensure Pinata keys are only accessed on the server
const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretKey = process.env.PINATA_SECRET_API_KEY;

// Check if keys are set on the server at runtime
if (!pinataApiKey || !pinataSecretKey) {
  console.error('PINATA_API_KEY or PINATA_SECRET_API_KEY is not set in server environment variables.');
  // In a production app, you might want a more robust error handling/startup check
}

// Instantiate Pinata SDK on the server
const pinata = new pinataSDK(pinataApiKey, pinataSecretKey);

// POST handler for /api/ipfs/upload
export async function POST(request: Request) {
  console.log('Received request to /api/ipfs/upload'); // Server log
  console.log('Environment variables check:');
  console.log('- PINATA_API_KEY:', process.env.PINATA_API_KEY ? 'Set' : 'Not Set');
  console.log('- PINATA_SECRET_API_KEY:', process.env.PINATA_SECRET_API_KEY ? 'Set' : 'Not Set');
  console.log('- NEXT_PUBLIC_CHAIN_ID:', process.env.NEXT_PUBLIC_CHAIN_ID);
  console.log('- NEXT_PUBLIC_NFT_ADDRESS:', process.env.NEXT_PUBLIC_NFT_ADDRESS);

  // Check if Pinata keys are available before processing
  if (!pinataApiKey || !pinataSecretKey) {
     console.error('Missing Pinata keys:', {
       hasApiKey: !!pinataApiKey,
       hasSecretKey: !!pinataSecretKey
     });
     return NextResponse.json(
        { success: false, error: 'Server configuration error: IPFS keys not set.' },
        { status: 500 }
     );
  }

  try {
    // Parse the incoming FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const metadataJsonString = formData.get('metadata') as string | null; // Assuming metadata comes as a JSON string

    if (!file) {
      console.error('No file received in IPFS upload request');
      return NextResponse.json(
        { success: false, error: 'No file uploaded.' },
        { status: 400 }
      );
    }

    if (!metadataJsonString) {
        console.error('No metadata string received in IPFS upload request');
         return NextResponse.json(
            { success: false, error: 'No metadata provided.' },
            { status: 400 }
         );
    }

    let metadata: NFTMetadata;
    try {
        metadata = JSON.parse(metadataJsonString);
        // Optional: Add validation for metadata structure here
    } catch (parseError) {
         console.error('Failed to parse metadata JSON string:', parseError);
         return NextResponse.json(
            { success: false, error: 'Invalid metadata format.' },
            { status: 400 }
         );
    }


    console.log('File and metadata received. Uploading to Pinata...');

    // Upload file to Pinata
    const fileUploadResult = await pinata.pinFileToIPFS(file.stream() as any, {
        pinataMetadata: { name: file.name }, // Use file name for Pinata pin metadata
    });

    console.log('Pinata file upload result:', fileUploadResult);

    if (!fileUploadResult || !fileUploadResult.IpfsHash) {
        console.error('Pinata file upload failed or returned no hash:', fileUploadResult);
         return NextResponse.json(
            { success: false, error: 'Failed to upload file to IPFS via Pinata.' },
            { status: 500 }
         );
    }

    const ipfsImageUrl = `${IPFS_GATEWAY}/${fileUploadResult.IpfsHash}`;
     console.log('File uploaded, IPFS URL:', ipfsImageUrl);

    // Update metadata to use the new IPFS image URL
    const updatedMetadata: NFTMetadata = {
        ...metadata,
        image: ipfsImageUrl,
    };

    // Upload metadata JSON to Pinata
    const metadataUploadResult = await pinata.pinJSONToIPFS(updatedMetadata, {
        pinataMetadata: { name: `${metadata.name}_metadata` }, // Use metadata name for the pin
    });

     console.log('Pinata metadata upload result:', metadataUploadResult);

    if (!metadataUploadResult || !metadataUploadResult.IpfsHash) {
         console.error('Pinata metadata upload failed or returned no hash:', metadataUploadResult);
          // Consider cleanup: unpin the image if metadata upload fails? More advanced.
         return NextResponse.json(
            { success: false, error: 'Failed to upload metadata to IPFS via Pinata.' },
            { status: 500 }
         );
    }

     const ipfsMetadataUrl = `${IPFS_GATEWAY}/${metadataUploadResult.IpfsHash}`;
     console.log('Metadata uploaded, IPFS URL:', ipfsMetadataUrl);

    // Return successful response with IPFS hashes/URLs
    return NextResponse.json(
      {
        success: true,
        ipfsImageUrl: ipfsImageUrl,
        ipfsMetadataUrl: ipfsMetadataUrl,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('An unexpected error occurred during IPFS upload:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred during IPFS upload.' },
      { status: 500 }
    );
  }
}

// You might also want to implement other HTTP methods (GET, etc.) if needed
// export async function GET(request: Request) {}
