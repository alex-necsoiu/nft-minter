/**
 * Generates NFT metadata in the OpenSea standard format.
 * @param name NFT title
 * @param description NFT description
 * @param imageUrl IPFS URL of the uploaded image
 */
export function createNftMetadata(name: string, description: string, imageUrl: string) {
  return {
    name,
    description,
    image: imageUrl,
    // Add more fields as needed (attributes, external_url, etc.)
  }
}