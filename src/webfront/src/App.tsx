import React, { useEffect, useState } from "react";
import { Heading, Text, Stack, Box } from "@chakra-ui/react";
import { ethers } from "ethers";
import abi from "./utils/SendEth.json";
import "./App.css";
import Bounty from "./components/Bounty";
import { BountyItem } from "./types/BountyItem";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const props1: BountyItem = {
    imageUrl:
      "https://news.mynavi.jp/article/20210809-1942830/images/000b_l.jpg",
    headMessage: "Tweet about project",
    textMessage: "0.001 ETH",
  };
  const props2: BountyItem = {
    imageUrl:
      "https://www.preface.ai/blog/wp-content/uploads/2021/05/photo-1610563166150-b34df4f3bcd6.jpeg",
    headMessage: "Create New Function",
    textMessage: "0.005 ETH",
  };
  const props3: BountyItem = {
    imageUrl:
      "https://www.ldaustralia.org/app/uploads/2021/08/kid-writing-in-notebook-TX2KE7V-1536x1024.jpg",
    headMessage: "Write New Article",
    textMessage: "0.002 ETH",
  };

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
    <>
      <Stack
        as={Box}
        textAlign="center"
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          lineHeight="110%"
        >
          Bounty Board <br />
        </Heading>
        <Text as="span" fontSize={{ base: "1xl", sm: "2xl", md: "3xl" }}>
          New Bounties
        </Text>
        <Bounty
          imageUrl={props2.imageUrl}
          headMessage={props2.headMessage}
          textMessage={props2.textMessage}
        />
        <Bounty
          imageUrl={props3.imageUrl}
          headMessage={props3.headMessage}
          textMessage={props3.textMessage}
        />
        <Text as="span" fontSize={{ base: "1xl", sm: "2xl", md: "3xl" }}>
          You Completed
        </Text>
        <Bounty
          imageUrl={props1.imageUrl}
          headMessage={props1.headMessage}
          textMessage={props1.textMessage}
        />
      </Stack>
      ;
    </>
  );
}

export default App;
