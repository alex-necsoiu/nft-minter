import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

/**
 * WalletConnect component allows users to connect their wallet to the application.
 * It handles wallet connection state and provides UI for connecting and disconnecting.
 */
const WalletConnect: React.FC = () => {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="wallet-connect">
      {isConnected ? (
        <div>
          <p>Wallet connected</p>
          <button onClick={() => disconnect()} className="btn-disconnect">
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <p>Please connect your wallet</p>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect(connector)}
              className="btn-connect"
            >
              Connect with {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;