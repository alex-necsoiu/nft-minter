require('@testing-library/jest-dom');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
  useDisconnect: jest.fn(),
  useSwitchChain: jest.fn(),
  useChainId: jest.fn(),
}));

// Mock wagmi/connectors
jest.mock('wagmi/connectors', () => ({
  injected: jest.fn(),
}));

// Mock wagmi/chains
jest.mock('wagmi/chains', () => ({
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    network: 'sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ['https://rpc.sepolia.org'] },
      public: { http: ['https://rpc.sepolia.org'] },
    },
    blockExplorers: {
      default: { name: 'Sepolia Etherscan', url: 'https://sepolia.etherscan.io' },
    },
  },
}));

// Mock contract configuration
jest.mock('@/lib/config/contract', () => ({
  CONTRACT_CONFIG: {
    address: '0xc507d4FbD9b5Bd102668c00a3eF7ec68bF95C6A1',
    abi: [],
    chainId: 11155111, // Sepolia chain ID
  },
}));

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: {
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  },
}); 