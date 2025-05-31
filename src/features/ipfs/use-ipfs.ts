// filepath: /Users/alexnecsoiu/repos/linum/nft-minter/src/features/ipfs/use-ipfs.ts
import { useState } from 'react';
import { uploadToIpfs } from './ipfs.service'; // Importing the IPFS service for uploading files

// Custom hook for managing IPFS interactions
const useIpfs = () => {
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to track any errors
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null); // State to store the IPFS URL

  // Function to upload a file to IPFS
  const uploadFile = async (file: File) => {
    setLoading(true); // Set loading to true when starting the upload
    setError(null); // Reset any previous errors

    try {
      const url = await uploadToIpfs(file); // Call the service to upload the file
      setIpfsUrl(url); // Set the IPFS URL on successful upload
    } catch (err) {
      setError('Failed to upload to IPFS'); // Set error message on failure
      console.error(err); // Log the error for debugging
    } finally {
      setLoading(false); // Set loading to false after the upload attempt
    }
  };

  return { uploadFile, loading, error, ipfsUrl }; // Return the upload function and state
};

export default useIpfs; // Export the custom hook for use in components