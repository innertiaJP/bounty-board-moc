import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/SendEth.json";
import "./App.css";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      }
      console.log("We have the ethereum object", ethereum);

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const sendEth = async () => {
    try {
      const { ethereum } = window;
      const contractAddress = "0x805cDbe3B88fC703C2cE26C08826Ca390cC5B530";
      const contractABI = abi.abi;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const sendEthPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const sendEthTxn = await sendEthPortalContract.sendEth();
        console.log("Mining...", sendEthTxn.hash);
        await sendEthTxn.wait();
        console.log("Mined -- ", sendEthTxn.hash);
        console.log("sendEth");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="bio">
          I am farza and I worked on self-driving cars so thats pretty cool
          right? Connect your Ethereum wallet and wave at me!
        </div>

        <button type="button" className="waveButton" onClick={sendEth}>
          sendEth
        </button>

        {!currentAccount && (
          <button type="button" className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
