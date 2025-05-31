import { mintNft } from '../src/features/mint/mint.service';
import { mockContract } from './mocks'; // Assuming you have a mock contract for testing
import { ethers } from 'ethers';

describe('Mint Service', () => {
  let toAddress: string;
  let uri: string;

  beforeEach(() => {
    toAddress = '0x1234567890abcdef1234567890abcdef12345678'; // Replace with a valid address
    uri = 'https://ipfs.io/ipfs/sample-metadata'; // Replace with a valid IPFS URI
  });

  it('should mint an NFT successfully', async () => {
    const mintSpy = jest.spyOn(mockContract, 'mint').mockResolvedValueOnce(true);

    const result = await mintNft(toAddress, uri);

    expect(mintSpy).toHaveBeenCalledWith(toAddress, uri);
    expect(result).toBe(true);
  });

  it('should throw an error if minting fails', async () => {
    const mintSpy = jest.spyOn(mockContract, 'mint').mockRejectedValueOnce(new Error('Minting failed'));

    await expect(mintNft(toAddress, uri)).rejects.toThrow('Minting failed');
    expect(mintSpy).toHaveBeenCalledWith(toAddress, uri);
  });
});