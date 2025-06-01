import { uploadImageToIpfs, uploadMetadataToIpfs } from '../src/features/ipfs/ipfs.service';

describe('IPFS Service', () => {
  const mockImageFile = new File(['dummy content'], 'image.png', { type: 'image/png' });
  const mockMetadata = {
    title: 'Test NFT',
    description: 'This is a test NFT',
    image: 'https://ipfs.io/ipfs/dummyImageHash',
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ IpfsHash: 'QmDummyHash' }),
    })
  ) as jest.Mock;

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
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: false, statusText: 'Bad Request' })
    );
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    await expect(uploadImageToIpfs(file)).rejects.toThrow('Pinata upload failed: Bad Request');
  });

  it('should handle errors during metadata upload', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    await uploadMetadataToIpfs(null); // Simulate error by passing null
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  describe('uploadImageToIpfs', () => {
    it('throws if Pinata API keys are not set', async () => {
      process.env.NEXT_PUBLIC_PINATA_API_KEY = '';
      process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY = '';
      const file = new File(['dummy'], 'test.png', { type: 'image/png' });
      await expect(uploadImageToIpfs(file)).rejects.toThrow('Pinata API keys are not set');
    });
  });
});