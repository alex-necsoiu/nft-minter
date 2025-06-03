import { MintService } from '../mint.service';
import { IpfsService } from '@/features/ipfs/services/ipfs.service';
import { NFTMetadata } from '@/lib/types/nft';

// Mock the IpfsService module
jest.mock('@/features/ipfs/services/ipfs.service');

describe('MintService', () => {
  let mintService: MintService;
  let mockUploadNFTData: jest.MockedFunction<typeof IpfsService.prototype.uploadNFTData>;

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods before each test
    mockUploadNFTData = IpfsService.prototype.uploadNFTData as jest.MockedFunction<typeof IpfsService.prototype.uploadNFTData>;
    mockUploadNFTData.mockClear();

    // Create a new instance of MintService before each test
    mintService = new MintService();
  });

  it('should call IpfsService.uploadNFTData with correct arguments and return prepare config on success', async () => {
    // Arrange: Mock IpfsService to return a successful upload result
    const mockIpfsSuccessResponse = {
      success: true,
      ipfsImageUrl: 'ipfs://mock-image-cid',
      ipfsMetadataUrl: 'ipfs://mock-metadata-cid',
    };
    mockUploadNFTData.mockResolvedValue(mockIpfsSuccessResponse);

    // Arrange: Create mock input data
    const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const mockMetadataInput: Omit<NFTMetadata, 'image'> = {
      name: 'Test NFT Title',
      description: 'Test NFT Description',
    };

    // Act: Call the prepareMint method
    const result = await mintService.prepareMint(mockFile, mockMetadataInput);

    // Assert: Verify IpfsService.uploadNFTData was called correctly
    expect(mockUploadNFTData).toHaveBeenCalledTimes(1);
    expect(mockUploadNFTData).toHaveBeenCalledWith(mockFile, mockMetadataInput);

    // Assert: Verify the returned result structure and values
    expect(result).toHaveProperty('request');
    expect(result).toHaveProperty('ipfsImageUrl', mockIpfsSuccessResponse.ipfsImageUrl);
    expect(result).toHaveProperty('ipfsMetadataUrl', mockIpfsSuccessResponse.ipfsMetadataUrl);

    // Assert: Verify the structure of the contract request (basic check)
    expect(result.request).toHaveProperty('address');
    expect(result.request).toHaveProperty('abi');
    expect(result.request).toHaveProperty('functionName', 'mint');
    expect(result.request).toHaveProperty('args');
    expect(result.request.args).toHaveLength(2); // Expecting [recipientAddress, metadataUrl]

    // Note: The recipient address is a placeholder in MintService, actual address added in hook
    expect(result.request.args[1]).toBe(mockIpfsSuccessResponse.ipfsMetadataUrl);
  });

  it('should throw an error if IpfsService.uploadNFTData fails', async () => {
    // Arrange: Mock IpfsService to return a failure result
    const mockIpfsFailureResponse = {
      success: false,
      error: 'Simulated IPFS upload failure',
    };
    mockUploadNFTData.mockResolvedValue(mockIpfsFailureResponse);

    // Arrange: Create mock input data
    const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const mockMetadataInput: Omit<NFTMetadata, 'image'> = {
      name: 'Test NFT Title',
      description: 'Test NFT Description',
    };

    // Act & Assert: Call prepareMint and expect it to throw an error
    await expect(mintService.prepareMint(mockFile, mockMetadataInput))
      .rejects
      .toThrow('Simulated IPFS upload failure'); // Expect the error message from the mock response

    // Assert: Verify IpfsService.uploadNFTData was still called
    expect(mockUploadNFTData).toHaveBeenCalledTimes(1);
    expect(mockUploadNFTData).toHaveBeenCalledWith(mockFile, mockMetadataInput);
  });

  it('should throw an error if IpfsService.uploadNFTData succeeds but returns no URLs', async () => {
    // Arrange: Mock IpfsService to return success but missing URLs
    const mockIpfsPartialSuccessResponse = {
      success: true,
      // URLs are missing
    };
    mockUploadNFTData.mockResolvedValue(mockIpfsPartialSuccessResponse);

    // Arrange: Create mock input data
    const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const mockMetadataInput: Omit<NFTMetadata, 'image'> = {
      name: 'Test NFT Title',
      description: 'Test NFT Description',
    };

    // Act & Assert: Call prepareMint and expect it to throw an error
    await expect(mintService.prepareMint(mockFile, mockMetadataInput))
      .rejects
      .toThrow('Failed to upload to IPFS'); // Expect the generic failure message

    // Assert: Verify IpfsService.uploadNFTData was still called
    expect(mockUploadNFTData).toHaveBeenCalledTimes(1);
    expect(mockUploadNFTData).toHaveBeenCalledWith(mockFile, mockMetadataInput);
  });

  it('should throw an error if metadata is missing name', async () => {
    const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const mockMetadataInput = { description: 'Test NFT Description' } as any;
    await expect(mintService.prepareMint(mockFile, mockMetadataInput))
      .rejects
      .toThrow('NFT name is required');
  });

  it('should throw an error if metadata is missing description', async () => {
    const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const mockMetadataInput = { name: 'Test NFT Title' } as any;
    await expect(mintService.prepareMint(mockFile, mockMetadataInput))
      .rejects
      .toThrow('NFT description is required');
  });

  it('should throw an error if file is not provided', async () => {
    const mockMetadataInput = { name: 'Test NFT Title', description: 'Test NFT Description' };
    await expect(mintService.prepareMint(undefined as any, mockMetadataInput))
      .rejects
      .toThrow('Image file is required');
  });

  it('should throw an error if file type is not an image', async () => {
    const mockFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const mockMetadataInput = { name: 'Test NFT Title', description: 'Test NFT Description' };
    await expect(mintService.prepareMint(mockFile, mockMetadataInput))
      .rejects
      .toThrow('Only image files are allowed');
  });

  it('should throw an error if file size exceeds 5MB', async () => {
    // 5MB + 1 byte
    const largeContent = new Uint8Array(5 * 1024 * 1024 + 1);
    const mockFile = new File([largeContent], 'large-image.png', { type: 'image/png' });
    const mockMetadataInput = { name: 'Test NFT Title', description: 'Test NFT Description' };
    await expect(mintService.prepareMint(mockFile, mockMetadataInput))
      .rejects
      .toThrow('Image file size must be less than 5MB');
  });

  it('should propagate unexpected errors from IpfsService.uploadNFTData', async () => {
    const mockFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const mockMetadataInput = { name: 'Test NFT Title', description: 'Test NFT Description' };
    mockUploadNFTData.mockImplementation(() => { throw new Error('Unexpected IPFS error'); });
    await expect(mintService.prepareMint(mockFile, mockMetadataInput))
      .rejects
      .toThrow('Unexpected IPFS error');
  });

  // TODO: Add more specific tests for contract request args mapping if needed
  // TODO: Consider testing file validation logic if it moves into MintService or is a dependency here
});

describe('MintService.prepareMintFromFile', () => {
  let mintService: MintService;
  let mockUploadNFTData: jest.MockedFunction<typeof IpfsService.prototype.uploadNFTData>;

  beforeEach(() => {
    mockUploadNFTData = IpfsService.prototype.uploadNFTData as jest.MockedFunction<typeof IpfsService.prototype.uploadNFTData>;
    mockUploadNFTData.mockClear();
    mintService = new MintService();
  });

  it('should call IpfsService.uploadNFTData with correct arguments and return prepare config on success', async () => {
    const mockIpfsSuccessResponse = {
      success: true,
      ipfsImageUrl: 'ipfs://mock-image-cid-2',
      ipfsMetadataUrl: 'ipfs://mock-metadata-cid-2',
    };
    mockUploadNFTData.mockResolvedValue(mockIpfsSuccessResponse);

    const mockFile = new File(['dummy content'], 'test-image-2.png', { type: 'image/png' });
    const mockMetadata: NFTMetadata = {
      name: 'Test NFT Name 2',
      description: 'Test NFT Description 2',
      image: 'ipfs://mock-image-cid-2', // This should match the mock response image URL
    };

    const result = await mintService.prepareMintFromFile(mockFile, mockMetadata);

    expect(mockUploadNFTData).toHaveBeenCalledTimes(1);
    expect(mockUploadNFTData).toHaveBeenCalledWith(mockFile, mockMetadata);

    expect(result).toHaveProperty('request');
    expect(result).toHaveProperty('ipfsImageUrl', mockIpfsSuccessResponse.ipfsImageUrl);
    expect(result).toHaveProperty('ipfsMetadataUrl', mockIpfsSuccessResponse.ipfsMetadataUrl);

    expect(result.request).toHaveProperty('address');
    expect(result.request).toHaveProperty('abi');
    expect(result.request).toHaveProperty('functionName', 'mint');
    expect(result.request).toHaveProperty('args');
    expect(result.request.args).toHaveLength(2);
    expect(result.request.args[0]).toBe(mockMetadata.name); // Expecting [metadata.name, metadataUrl] based on service implementation
    expect(result.request.args[1]).toBe(mockIpfsSuccessResponse.ipfsMetadataUrl);
  });

  it('should throw an error if IpfsService.uploadNFTData fails', async () => {
    const mockIpfsFailureResponse = {
      success: false,
      error: 'Simulated IPFS upload failure for prepareMintFromFile',
    };
    mockUploadNFTData.mockResolvedValue(mockIpfsFailureResponse);

    const mockFile = new File(['dummy content'], 'test-image-2.png', { type: 'image/png' });
    const mockMetadata: NFTMetadata = {
      name: 'Test NFT Name 2',
      description: 'Test NFT Description 2',
      image: 'ipfs://mock-image-cid-2',
    };

    await expect(mintService.prepareMintFromFile(mockFile, mockMetadata))
      .rejects
      .toThrow('Simulated IPFS upload failure for prepareMintFromFile');

    expect(mockUploadNFTData).toHaveBeenCalledTimes(1);
    expect(mockUploadNFTData).toHaveBeenCalledWith(mockFile, mockMetadata);
  });

  it('should throw an error if IpfsService.uploadNFTData succeeds but returns no URLs', async () => {
    const mockIpfsPartialSuccessResponse = {
      success: true,
      // URLs are missing
    };
    mockUploadNFTData.mockResolvedValue(mockIpfsPartialSuccessResponse);

    const mockFile = new File(['dummy content'], 'test-image-2.png', { type: 'image/png' });
    const mockMetadata: NFTMetadata = {
      name: 'Test NFT Name 2',
      description: 'Test NFT Description 2',
      image: 'ipfs://mock-image-cid-2',
    };

    await expect(mintService.prepareMintFromFile(mockFile, mockMetadata))
      .rejects
      .toThrow('Failed to upload to IPFS');

    expect(mockUploadNFTData).toHaveBeenCalledTimes(1);
    expect(mockUploadNFTData).toHaveBeenCalledWith(mockFile, mockMetadata);
  });

  it('should throw an error if metadata is missing name', async () => {
    const mockFile = new File(['dummy content'], 'test-image-2.png', { type: 'image/png' });
    const mockMetadata = { description: 'Test NFT Description 2', image: 'ipfs://mock-image-cid-2' } as any;
    await expect(mintService.prepareMintFromFile(mockFile, mockMetadata))
      .rejects
      .toThrow('NFT name is required');
  });

  it('should throw an error if metadata is missing description', async () => {
    const mockFile = new File(['dummy content'], 'test-image-2.png', { type: 'image/png' });
    const mockMetadata = { name: 'Test NFT Name 2', image: 'ipfs://mock-image-cid-2' } as any;
    await expect(mintService.prepareMintFromFile(mockFile, mockMetadata))
      .rejects
      .toThrow('NFT description is required');
  });

  it('should throw an error if metadata is missing image', async () => {
    const mockFile = new File(['dummy content'], 'test-image-2.png', { type: 'image/png' });
    const mockMetadata = { name: 'Test NFT Name 2', description: 'Test NFT Description 2' } as any;
    await expect(mintService.prepareMintFromFile(mockFile, mockMetadata))
      .rejects
      .toThrow('NFT image URL is required in metadata');
  });

  it('should throw an error if file is not provided', async () => {
    const mockMetadata: NFTMetadata = {
      name: 'Test NFT Name 2',
      description: 'Test NFT Description 2',
      image: 'ipfs://mock-image-cid-2',
    };
    await expect(mintService.prepareMintFromFile(undefined as any, mockMetadata))
      .rejects
      .toThrow('Image file is required');
  });

  it('should throw an error if file type is not an image', async () => {
    const mockFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const mockMetadata: NFTMetadata = {
      name: 'Test NFT Name 2',
      description: 'Test NFT Description 2',
      image: 'ipfs://mock-image-cid-2',
    };
    await expect(mintService.prepareMintFromFile(mockFile, mockMetadata))
      .rejects
      .toThrow('Only image files are allowed');
  });

  it('should throw an error if file size exceeds 5MB', async () => {
    const largeContent = new Uint8Array(5 * 1024 * 1024 + 1);
    const mockFile = new File([largeContent], 'large-image-2.png', { type: 'image/png' });
    const mockMetadata: NFTMetadata = {
      name: 'Test NFT Name 2',
      description: 'Test NFT Description 2',
      image: 'ipfs://mock-image-cid-2',
    };
    await expect(mintService.prepareMintFromFile(mockFile, mockMetadata))
      .rejects
      .toThrow('Image file size must be less than 5MB');
  });

  it('should propagate unexpected errors from IpfsService.uploadNFTData', async () => {
    const mockFile = new File(['dummy content'], 'test-image-2.png', { type: 'image/png' });
    const mockMetadata: NFTMetadata = {
      name: 'Test NFT Name 2',
      description: 'Test NFT Description 2',
      image: 'ipfs://mock-image-cid-2',
    };
    mockUploadNFTData.mockImplementation(() => { throw new Error('Unexpected IPFS error from prepareMintFromFile'); });
    await expect(mintService.prepareMintFromFile(mockFile, mockMetadata))
      .rejects
      .toThrow('Unexpected IPFS error from prepareMintFromFile');
  });
}); 