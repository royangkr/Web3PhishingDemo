#  Signature-phishing PBM transfer demo
Demo phishing site that is supposed to transfer PBM tokens from one wallet to another but can be configured to steal wallet contents.
![Demo phishing site](https://raw.githubusercontent.com/royangkr/Web3PhishingDemo/main/transferPBMdemo.PNG "Demo phishing site")
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
open the dApp in your browser at http://localhost:3000/.

## Scam configuration
In `interact.js`, 
- set `PBMcontractAddress` to the ERC20 PBM token contract address to be transfered
- set `NFTcontractAddress` to the ERC1155 NFT contract address to be stolen
- set `NFTtokenID` to the ERC1155 NFT tokenID to be stolen

Configure `action` and `thief` in `interact.js` by setting  lines 22-23. The StealOptions are:
- honestTransfer: transfers PBM tokens as user intended
- stealPBM: drains user's PBM balance to thief wallet
- stealPBMbyApprove: grant thief approval to transfer user's PBM
- stealMatic: steal user's MATIC
- stealNFT: steal user's NFT
- stealNFTbyApprove: grant thief approval to transfer user's NFTs

### References
https://github.com/alchemyplatform/hello-world-part-four-tutorial