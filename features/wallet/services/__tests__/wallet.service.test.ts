import { WalletService } from '../wallet.service';
import { WalletConnectorsService } from '../wallet-connectors.service';
import { WalletType } from '@/features/wallet/types/wallet.types';

// Mock the WalletConnectorsService
jest.mock('../wallet-connectors.service');

describe('WalletService', () => {
  let walletService: WalletService;
  let mockGetConnector: jest.Mock;

  beforeEach(() => {
    // Clear mocks and create a new service instance before each test
    mockGetConnector = (WalletConnectorsService.getConnector as jest.Mock);
    mockGetConnector.mockClear();
    walletService = new WalletService();
  });

  it('should call WalletConnectorsService.getConnector with the correct wallet type and return initial connecting state', async () => {
    // Arrange
    const walletType: WalletType = 'metaMask';
    const mockConnector = { /* mock connector object */ };
    mockGetConnector.mockReturnValue(mockConnector);

    // Act
    const result = await walletService.connectWallet(walletType);

    // Assert
    expect(mockGetConnector).toHaveBeenCalledTimes(1);
    expect(mockGetConnector).toHaveBeenCalledWith(walletType);
    expect(result).toEqual({
      isConnected: false,
      isConnecting: true,
    });
  });

  it('should handle errors from WalletConnectorsService.getConnector', async () => {
    // Arrange
    const walletType: WalletType = 'unsupported' as WalletType; // Simulate an unsupported type
    const mockError = new Error('Unsupported wallet type: unsupported');
    mockGetConnector.mockImplementation(() => {
      throw mockError;
    });

    // Act
    const result = await walletService.connectWallet(walletType);

    // Assert
    expect(mockGetConnector).toHaveBeenCalledTimes(1);
    expect(mockGetConnector).toHaveBeenCalledWith(walletType);
    expect(result).toEqual({
      isConnected: false,
      isConnecting: false,
      error: mockError.message,
    });
  });

  // Note: disconnectWallet and switchNetwork are planned to be implemented via Wagmi hooks
  // Unit tests for their current empty implementation are not necessary.
}); 