User requirement

As a user I want to be able to connect my wallet to an application and mint new nft.

On this application we will require a minting page where the user will add title, description and upload a photo. And at the end of the process to call the minting function on the provided contract.

Minting function should be disabled if the user has not connected his/hers wallet on the app.

After successful minting the user should be notified that nft has minted successfully or if some error occurred notify the user about the error in the ui.

ERC721 Mint function parameters:
mint(to: string, uri: string);

Acceptance criteria:

Create page for minting nft.
It should contain inputs for title, description and image.
Create function to upload image from local storage and store it to decentralised storage. (IPFS)
Use https://docs.opensea.io/docs/metadata-standards to create standardised json object and store the json object to decentralised storage.
Create service call to contracts
use wagmi integration to call minting function.
Implementation of figma design
Figma

From figma implement the following:

Minting
Confirmation
Wallet
Figma design:
https://www.figma.com/design/vX6RLjk87SFnhZVoIajbes/Untitled?node-id=0-1&t=zPd2PfvUSZxBPGIB-1

Needed variables

Contracts are deployed on sepolia network:
ERC721

env var:

NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_ALCHEMY_ENDPOINT= https://eth-sepolia.g.alchemy.com/v2/id
NEXT_PUBLIC_NFT_ADDRESS="0xc507d4FbD9b5Bd102668c00a3eF7ec68bF95C6A1"

Needed INFO:
IPFS_NODE = 'https://ipfs.io/ipfs';

Contract: https://sepolia.etherscan.io/address/0xc507d4FbD9b5Bd102668c00a3eF7ec68bF95C6A1
ABI:
https://github.com/LinumLabs/web3-task-abi/blob/dev/Musharka721.json

Use Pinata to store the files. https://www.pinata.cloud/

When review is needed add @saksijas to your repo.

Requirements

React, Typescript, NextJS, wagmi & tailwind