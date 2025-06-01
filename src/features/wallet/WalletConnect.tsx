import React from 'react'
import { useWallet } from './use-wallet'


/**
 * WalletConnect handles Ethereum wallet connection and network validation.
 * Shows the connected address, network status, or a connect button.
 */
const WalletConnect: React.FC = () => {
  const {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    isCorrectNetwork,
  } = useWallet()

  return (
    <div className="flex justify-end items-center p-6">
      {isConnected ? (
        <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg">
          <span className="text-white font-mono text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <button
            className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:opacity-90 transition"
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
          {!isCorrectNetwork && (
            <span className="text-yellow-400 font-semibold ml-2">
              Switch to Sepolia
            </span>
          )}
        </div>
      ) : (
        <button
          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-2 rounded-md font-semibold shadow-lg hover:opacity-90 transition"
          onClick={() => connect()}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  )
}

export default WalletConnect