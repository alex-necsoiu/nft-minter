import { renderHook, act } from '@testing-library/react';
import { useWallet } from '../use-wallet';
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from 'wagmi';
import { WalletConnectorsService } from '../../services/wallet-connectors.service';
import { WalletType } from '../../types/wallet.types';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
  useDisconnect: jest.fn(),
  useSwitchChain: jest.fn(),
  useChainId: jest.fn(),
}));

// Mock WalletConnectorsService
jest.mock('../../services/wallet-connectors.service');

describe('useWallet', () => {
  // Mocked wagmi hooks
  const mockUseAccount = useAccount as jest.Mock;
  const mockUseConnect = useConnect as jest.Mock;
  const mockUseDisconnect = useDisconnect as jest.Mock;
  const mockUseSwitchChain = useSwitchChain as jest.Mock;
  const mockUseChainId = useChainId as jest.Mock;

  // Mocked WalletConnectorsService method
  const mockGetConnector = WalletConnectorsService.getConnector as jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test
    mockUseAccount.mockReset();
    mockUseConnect.mockReset();
    mockUseDisconnect.mockReset();
    mockUseSwitchChain.mockReset();
    mockUseChainId.mockReset();
    mockGetConnector.mockReset();

    // Default mock implementations for wagmi hooks
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
      status: 'disconnected',
    });
    mockUseConnect.mockReturnValue({
      connect: jest.fn(),
      connectors: [],
      isPending: false,
      pendingConnector: undefined,
      error: null,
      variables: undefined,
    });
    mockUseDisconnect.mockReturnValue({
      disconnect: jest.fn(),
      isPending: false,
      variables: undefined,
    });
    mockUseSwitchChain.mockReturnValue({
      switchChain: jest.fn(),
      chains: [],
      isPending: false,
      variables: undefined,
      error: null,
    });
    mockUseChainId.mockReturnValue(undefined);

    // Default mock for getConnector
    mockGetConnector.mockReturnValue({ /* mock connector object */ });
  });

  it('should return initial wallet state', () => {
    const { result } = renderHook(() => useWallet());

    expect(result.current.walletState).toEqual({
      isConnected: false,
      address: undefined,
      chainId: undefined,
      error: undefined,
      isConnecting: false,
    });
  });

  it('should connect wallet successfully', async () => {
    const mockAddress = '0x123...';
    const mockChainId = 11155111; // Sepolia chain ID
    const mockConnector = { id: 'metaMask' };
    
    mockGetConnector.mockReturnValue(mockConnector);
    mockUseConnect.mockReturnValue({
      connect: jest.fn().mockResolvedValue(undefined),
      isPending: false,
      error: null,
    });
    mockUseAccount.mockReturnValue({
      address: mockAddress,
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      status: 'connected',
    });
    mockUseChainId.mockReturnValue(mockChainId);

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connectWallet('metaMask');
    });

    expect(result.current.walletState).toEqual({
      isConnected: true,
      address: mockAddress,
      chainId: mockChainId,
      error: undefined,
      isConnecting: false,
    });
  });

  it('should handle wallet connection error', async () => {
    const mockError = new Error('Failed to connect');
    mockGetConnector.mockReturnValue({ id: 'metaMask' });
    mockUseConnect.mockReturnValue({
      connect: jest.fn().mockRejectedValue(mockError),
      isPending: false,
      error: mockError,
    });

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connectWallet('metaMask');
    });

    expect(result.current.walletState).toEqual({
      isConnected: false,
      address: undefined,
      chainId: undefined,
      error: mockError.message,
      isConnecting: false,
    });
  });

  it('should disconnect wallet successfully', async () => {
    const mockDisconnect = jest.fn().mockResolvedValue(undefined);
    mockUseDisconnect.mockReturnValue({
      disconnect: mockDisconnect,
      isPending: false,
    });

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.disconnectWallet();
    });

    expect(mockDisconnect).toHaveBeenCalled();
    expect(result.current.walletState.isConnected).toBe(false);
  });

  it('should switch to Sepolia network successfully', async () => {
    const mockSwitchChain = jest.fn().mockResolvedValue(undefined);
    mockUseSwitchChain.mockReturnValue({
      switchChain: mockSwitchChain,
      isPending: false,
      error: null,
    });

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.switchToSepolia();
    });

    expect(mockSwitchChain).toHaveBeenCalledWith({ chainId: 11155111 });
  });

  it('should handle network switch error', async () => {
    const mockError = new Error('Failed to switch network');
    mockUseSwitchChain.mockReturnValue({
      switchChain: jest.fn().mockRejectedValue(mockError),
      isPending: false,
      error: mockError,
    });

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.switchToSepolia();
    });

    expect(result.current.walletState.error).toBe(mockError.message);
  });

  it('should update wallet state when account changes', () => {
    const mockAddress = '0x123...';
    const mockChainId = 11155111;

    mockUseAccount.mockReturnValue({
      address: mockAddress,
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      status: 'connected',
    });
    mockUseChainId.mockReturnValue(mockChainId);

    const { result } = renderHook(() => useWallet());

    expect(result.current.walletState).toEqual({
      isConnected: true,
      address: mockAddress,
      chainId: mockChainId,
      error: undefined,
      isConnecting: false,
    });
  });
}); 