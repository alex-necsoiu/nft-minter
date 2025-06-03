import { IpfsService } from '../ipfs.service';
import { NFTMetadata } from '@/lib/types/nft';

// Mock the global fetch function
global.fetch = jest.fn();

describe('IpfsService', () => {
  let ipfsService: IpfsService;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    // Clear mock and reset instance before each test
    mockFetch = global.fetch as jest.Mock;
    mockFetch.mockClear();
    ipfsService = new IpfsService();
  });

  it('should upload file and metadata and return success with URLs', async () => {
    // Arrange
    const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const mockMetadata: Omit<NFTMetadata, 'image'> = {
      name: 'Test NFT',
      description: 'Test Description',
    };
    const mockApiResponse = {
      success: true,
      ipfsImageUrl: 'ipfs://mock-image-cid',
      ipfsMetadataUrl: 'ipfs://mock-metadata-cid',
    };
    
    // Mock the fetch response
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    // Act
    const result = await ipfsService.uploadNFTData(mockFile, mockMetadata);

    // Assert: Verify fetch was called correctly
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/ipfs/upload',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData), // Check if body is FormData
      })
    );

    // Verify FormData content (optional but good practice)
    const formDataCalledWith = mockFetch.mock.calls[0][1].body;
    expect(formDataCalledWith.get('file')).toBe(mockFile);
    expect(formDataCalledWith.get('metadata')).toBe(JSON.stringify(mockMetadata));

    // Assert: Verify the returned result
    expect(result).toEqual(mockApiResponse);
  });

  it('should handle API returning success: false with an error message', async () => {
    // Arrange
    const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const mockMetadata: Omit<NFTMetadata, 'image'> = {
      name: 'Test NFT',
      description: 'Test Description',
    };
    const mockApiResponse = {
      success: false,
      error: 'Simulated API error',
    };

    // Mock the fetch response
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    // Act
    const result = await ipfsService.uploadNFTData(mockFile, mockMetadata);

    // Assert
    expect(result).toEqual(mockApiResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle API returning success: true but missing URLs', async () => {
    // Arrange
    const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const mockMetadata: Omit<NFTMetadata, 'image'> = {
      name: 'Test NFT',
      description: 'Test Description',
    };
    const mockApiResponse = {
      success: true,
      // URLs missing
    };

    // Mock the fetch response
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    // Act
    const result = await ipfsService.uploadNFTData(mockFile, mockMetadata);

    // Assert: The service code should handle this, but the API response is what it is
    // We expect it to return the API response as is.
    expect(result).toEqual(mockApiResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle network errors during fetch', async () => {
    // Arrange
    const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const mockMetadata: Omit<NFTMetadata, 'image'> = {
      name: 'Test NFT',
      description: 'Test Description',
    };
    const networkError = new Error('Simulated network error');

    // Mock fetch to reject with a network error
    mockFetch.mockRejectedValue(networkError);

    // Act
    const result = await ipfsService.uploadNFTData(mockFile, mockMetadata);

    // Assert
    expect(result).toEqual({ success: false, error: 'Simulated network error' });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle non-ok HTTP responses', async () => {
    // Arrange
    const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const mockMetadata: Omit<NFTMetadata, 'image'> = {
      name: 'Test NFT',
      description: 'Test Description',
    };
    const mockErrorResponse = { message: 'Server error' };

    // Mock the fetch response with ok: false
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve(mockErrorResponse),
      text: () => Promise.resolve(JSON.stringify(mockErrorResponse)), // Provide text method as fetch Response has it
    });

    // Act
    const result = await ipfsService.uploadNFTData(mockFile, mockMetadata);

    // Assert: The service currently returns the JSON body from the API on non-ok responses
    expect(result).toEqual(mockErrorResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
}); 