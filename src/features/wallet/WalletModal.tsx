import React from "react";

interface WalletModalProps {
  onClose: () => void;
  onConnect: (provider: string) => void;
}

const WALLET_OPTIONS = [
  { name: "Metamask", icon: "/icons/metamask.svg", provider: "metamask" },
  { name: "Portis", icon: "/icons/portis.svg", provider: "portis" },
  { name: "Torus", icon: "/icons/torus.svg", provider: "torus" },
  { name: "Walletlink", icon: "/icons/walletlink.svg", provider: "walletlink" },
];

const WalletModal: React.FC<WalletModalProps> = ({ onClose, onConnect }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-60">
    <div className="relative bg-[#18181b] w-full max-w-sm h-full md:h-auto md:rounded-l-2xl shadow-2xl flex flex-col p-8 animate-slide-in-right">
      {/* Close button */}
      <button
        className="absolute top-6 right-6 text-white text-3xl hover:text-accent transition"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold text-white mb-8 mt-2">Connect Wallet</h2>
      <div className="flex flex-col gap-4">
        {WALLET_OPTIONS.map((wallet) => (
          <button
            key={wallet.provider}
            onClick={() => onConnect(wallet.provider)}
            className="flex items-center gap-3 bg-[#23232a] border border-gray-700 hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white text-white rounded-lg px-5 py-4 font-semibold transition"
          >
            <img src={wallet.icon} alt={wallet.name} className="w-6 h-6" />
            {wallet.name}
          </button>
        ))}
      </div>
      <div className="mt-8 text-gray-400 text-sm">
        Don&apos;t have a wallet?{" "}
        <a
          href="https://ethereum.org/en/wallets/find-wallet/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          Learn more
        </a>
      </div>
    </div>
  </div>
);

export default WalletModal;

