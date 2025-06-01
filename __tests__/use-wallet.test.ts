import { renderHook } from '@testing-library/react';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { useWallet } from '../src/features/wallet/use-wallet';

jest.mock('wagmi');

describe('useWallet', () => {
  beforeEach(() => {
    (useAccount as jest.Mock).mockReturnValue({ address: '0xabc', isConnected: true });
    (useConnect as jest.Mock).mockReturnValue({ connect: jest.fn(), isLoading: false });
    (useDisconnect as jest.Mock).mockReturnValue({ disconnect: jest.fn() });
    (useChainId as jest.Mock).mockReturnValue(11155111);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct wallet state', () => {
    const { result } = renderHook(() => useWallet());
    expect(result.current.isConnected).toBe(true);
    expect(result.current.address).toBe('0xabc');
    expect(result.current.isCorrectNetwork).toBe(true);
  });
});