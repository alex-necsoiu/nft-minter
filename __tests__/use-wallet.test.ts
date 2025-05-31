import { renderHook, act } from '@testing-library/react-hooks';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWallet } from '../src/features/wallet/use-wallet';

jest.mock('wagmi');

describe('useWallet', () => {
  const mockConnect = jest.fn();
  const mockDisconnect = jest.fn();
  const mockUseAccount = jest.fn();
  const mockUseConnect = jest.fn();
  const mockUseDisconnect = jest.fn();

  beforeEach(() => {
    (useAccount as jest.Mock).mockReturnValue({ isConnected: false });
    (useConnect as jest.Mock).mockReturnValue({ connect: mockConnect });
    (useDisconnect as jest.Mock).mockReturnValue({ disconnect: mockDisconnect });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect wallet', async () => {
    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connectWallet();
    });

    expect(mockConnect).toHaveBeenCalled();
  });

  it('should disconnect wallet', async () => {
    (useAccount as jest.Mock).mockReturnValue({ isConnected: true });

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.disconnectWallet();
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should return wallet connection status', () => {
    (useAccount as jest.Mock).mockReturnValue({ isConnected: true });

    const { result } = renderHook(() => useWallet());

    expect(result.current.isConnected).toBe(true);
  });
});