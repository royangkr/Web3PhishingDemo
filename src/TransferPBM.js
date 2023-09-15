import React from "react";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  getBalance,
  loadName,
  transfer
} from "./util/interact.js";

import  redeemSGLogo from "./logo.svg";

const TransferPBM = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("No connection to the network."); //default message
  const [balance, setBalance] = useState(" "); //default message
  const [transferAddress, setTransferAddress] = useState("");
  const [amount, setAmount] = useState("");
  const decimals=18;

  //called only once
  useEffect(async () => {
    const name = await loadName();
    setName(name);

    const { address, status } = await getCurrentWalletConnected();
    if(address.length>0){
      const balance= await getBalance(address);
      setBalance(balance/(10**decimals));
    }

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);


  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Enter the recipient address and amount in the text-fields above.");
          const balance=await getBalance(accounts[0]);
          setBalance(balance/(10**decimals));
        } else {
          setWallet("");
          setBalance("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onTransferPressed = async () => {
    const { status } = await transfer(walletAddress,transferAddress, amount,balance);
    setStatus(status);
  };

  //the UI of our component
  return (
    <div id="container" style={{overflow: 'auto'}}>
      <img id="logo" src={ redeemSGLogo}></img>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h2 style={{ paddingTop: "18px" }}>Token: {name}</h2>

      <h2>Balance: {balance}</h2>

      <h2>Transfer to:</h2>

      <div>
        <input
          type="text"
          placeholder="Wallet address"
          onChange={(e) => setTransferAddress(e.target.value)}
          value={transferAddress}
        />
        <h2>Amount:</h2>
        <input
          type="text"
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
        
        <p id="status">{status}</p>
        <button id="publish" onClick={onTransferPressed}>
          Send
        </button>
      </div>
    </div>
  );
};

export default TransferPBM;
