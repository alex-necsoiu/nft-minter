import React from "react";

interface NftOverviewModalProps {
  imageUrl: string;
  title: string;
  description: string;
  txHash: string;
  onClose: () => void;
}

/**
 * Modal to display NFT details and transaction info after minting.
 * Figma parity: NFT overview modal.
 */
const NftOverviewModal: React.FC<NftOverviewModalProps> = ({
  imageUrl,
  title,
  description,
  txHash,
  onClose,
}) => {
  // Etherscan link for Sepolia
  const etherscanUrl = `https://sepolia.etherscan.io/tx/${txHash}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative bg-[#18181b] rounded-xl shadow-lg w-full max-w-3xl p-8">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          {/* NFT Image */}
          <div className="flex-shrink-0 flex justify-center items-center">
            <img
              src={imageUrl}
              alt={title}
              className="w-64 h-64 object-contain rounded-lg shadow"
            />
          </div>
          {/* NFT Details */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <h3 className="text-lg font-semibold text-gray-300 mb-1">Description</h3>
            <p className="text-gray-400 mb-4">{description}</p>
            <div className="mt-4">
              <span className="text-gray-400">Transaction: </span>
              <a
                href={etherscanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline break-all"
              >
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftOverviewModal;