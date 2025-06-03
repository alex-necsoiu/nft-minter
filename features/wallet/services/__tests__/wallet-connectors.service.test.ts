import { WalletConnectorsService } from '../wallet-connectors.service';
import { WalletType } from '@/features/wallet/types/wallet.types';
import { injected } from 'wagmi/connectors';

// Mock the global fetch function


// Mock the wagmi/connectors module to control the injected function
jest.mock('wagmi/connectors', () => ({
  injected: jest.fn((config) => ({
    // Mock connector object structure
    ...config,
    name: `Mock ${config.target} Connector`,
    id: config.target,
    type: 'injected',
    shimDisconnect: config.shimDisconnect,
    isReady: true,
    connect: jest.fn(),
    disconnect: jest.fn(),
    getAccounts: jest.fn(),
    getChainId: jest.fn(),
    isAuthorized: jest.fn(),
    watchAsset: jest.fn(),
    switchChain: jest.fn(),
    getProvider: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  })),
}));

describe('WalletConnectorsService', () => {
  let mockInjected: jest.MockedFunction<typeof injected>;

  beforeEach(() => {
    // Clear mock before each test
    mockInjected = injected as unknown as jest.MockedFunction<typeof injected>; // Explicitly cast to unknown first
    mockInjected.mockClear();
  });

  it('should return injected connector for metaMask', () => {
    const walletType: WalletType = 'metaMask';
    const connector = WalletConnectorsService.getConnector(walletType);

    expect(mockInjected).toHaveBeenCalledTimes(1);
    expect(mockInjected).toHaveBeenCalledWith({
      target: 'metaMask',
      shimDisconnect: true,
    });
    expect(connector).toHaveProperty('id', 'metaMask');
    expect(connector).toHaveProperty('type', 'injected');
    expect(connector).toHaveProperty('shimDisconnect', true);
  });

  it('should return injected connector for portis', () => {
    const walletType: WalletType = 'portis';
    const connector = WalletConnectorsService.getConnector(walletType);

    expect(mockInjected).toHaveBeenCalledTimes(1);
    expect(mockInjected).toHaveBeenCalledWith({
      target: 'portis',
      shimDisconnect: true,
    });
    expect(connector).toHaveProperty('id', 'portis');
    expect(connector).toHaveProperty('type', 'injected');
    expect(connector).toHaveProperty('shimDisconnect', true);
  });

  it('should return injected connector for torus', () => {
    const walletType: WalletType = 'torus';
    const connector = WalletConnectorsService.getConnector(walletType);

    expect(mockInjected).toHaveBeenCalledTimes(1);
    expect(mockInjected).toHaveBeenCalledWith({
      target: 'torus',
      shimDisconnect: true,
    });
    expect(connector).toHaveProperty('id', 'torus');
    expect(connector).toHaveProperty('type', 'injected');
    expect(connector).toHaveProperty('shimDisconnect', true);
  });

  it('should return injected connector for walletlink', () => {
    const walletType: WalletType = 'walletlink';
    const connector = WalletConnectorsService.getConnector(walletType);

    expect(mockInjected).toHaveBeenCalledTimes(1);
    expect(mockInjected).toHaveBeenCalledWith({
      target: 'walletlink',
      shimDisconnect: true,
    });
    expect(connector).toHaveProperty('id', 'walletlink');
    expect(connector).toHaveProperty('type', 'injected');
    expect(connector).toHaveProperty('shimDisconnect', true);
  });

  it('should throw an error for unsupported wallet type', () => {
    const walletType = 'unsupported' as WalletType; // Cast to WalletType for testing unsupported case

    expect(() => WalletConnectorsService.getConnector(walletType))
      .toThrow(`Unsupported wallet type: ${walletType}`);
    expect(mockInjected).not.toHaveBeenCalled();
  });
});

// Helper type to satisfy the injected connector return type for mocking 