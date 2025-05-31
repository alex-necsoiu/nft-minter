import { uploadImageToIpfs, uploadMetadataToIpfs } from '../src/features/ipfs/ipfs.service';

describe('IPFS Service', () => {
  const mockImageFile = new File(['dummy content'], 'image.png', { type: 'image/png' });
  const mockMetadata = {
    title: 'Test NFT',
    description: 'This is a test NFT',
    image: 'https://ipfs.io/ipfs/dummyImageHash',
  };

  it('should upload an image to IPFS', async () => {
    const result = await uploadImageToIpfs(mockImageFile);
    expect(result).toHaveProperty('path');
    expect(result.path).toMatch(/ipfs\/.+/);
  });

  it('should upload metadata to IPFS', async () => {
    const result = await uploadMetadataToIpfs(mockMetadata);
    expect(result).toHaveProperty('path');
    expect(result.path).toMatch(/ipfs\/.+/);
  });

  it('should handle errors during image upload', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    await uploadImageToIpfs(null); // Simulate error by passing null
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should handle errors during metadata upload', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    await uploadMetadataToIpfs(null); // Simulate error by passing null
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});