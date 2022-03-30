import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Stack,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Link,
} from "@chakra-ui/react";
import { ethers } from "ethers";

function TransferCoin() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [transferValue, setTransferValue] = useState("");
  const [sendCoinTxnHash, setSendCoinTxnHash] = useState("");

  const innAddress = "0xc35B48Fe8CC02BdF813a8F3c7feAcA7a20307831";

  const minABI = [
    // transfer
    {
      constant: false,
      inputs: [
        {
          name: "_to",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      type: "function",
    },
  ];

  const handleToAddressChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setToAddress(e.target.value);

  const handleTransferValueChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setTransferValue(e.target.value);

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

  const transferCoin = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const transferEthTxn = await signer.sendTransaction({
          to: toAddress,
          value: ethers.utils.parseEther(transferValue),
        });
        setSendCoinTxnHash(transferEthTxn.hash);
        console.log("Mining...", transferEthTxn.hash);
        await transferEthTxn.wait();
        console.log("Mined -- ", transferEthTxn.hash);
        console.log("sent eth");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const transferToken = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(innAddress, minABI, signer);
        const transferEthTxn = await contract.transfer(
          toAddress,
          ethers.utils.parseEther(transferValue)
        );
        setSendCoinTxnHash(transferEthTxn.hash);
        console.log("Mining...", transferEthTxn.hash);
        await transferEthTxn.wait();
        console.log("Mined -- ", transferEthTxn.hash);
        console.log("sent eth");
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
      <Box>
        <Flex
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle="solid"
          align="center"
          borderColor={useColorModeValue("gray.200", "gray.900")}
        >
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", md: "none" }}
          />
          <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
            <Flex display={{ base: "none", md: "flex" }} ml={10} />
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify="flex-end"
            direction="row"
            spacing={6}
          >
            {!currentAccount && (
              <Button
                onClick={connectWallet}
                display={{ base: "none", md: "inline-flex" }}
                fontSize="sm"
                fontWeight={600}
                color="white"
                bg="blue.400"
                _hover={{
                  bg: "blue.300",
                }}
              >
                Connect Wallet
              </Button>
            )}
            {currentAccount && (
              <Button
                display={{ base: "none", md: "inline-flex" }}
                fontSize="sm"
                fontWeight={600}
                color="white"
                bg="blue.400"
                _hover={{
                  bg: "blue.300",
                }}
              >
                {currentAccount}
              </Button>
            )}
          </Stack>
        </Flex>
      </Box>

      <Box w={500} p={4} m="20px auto">
        <Heading as="h1" size="xl" textAlign="center">
          Transfer Coin
        </Heading>
        <Box
          as="form"
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="1px 1px 3px rgba(0,0,0,0.3)"
        >
          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input value={toAddress} onChange={handleToAddressChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Amount</FormLabel>
            <Input value={transferValue} onChange={handleTransferValueChange} />
          </FormControl>
          <Button onClick={transferCoin}>Transfer Eth</Button>
          <Button onClick={transferToken}>Transfer Token</Button>
          {sendCoinTxnHash && (
            <Link href={`https://rinkeby.etherscan.io/tx/${sendCoinTxnHash}`}>
              View in Etherscan
            </Link>
          )}
        </Box>
      </Box>
    </>
  );
}

export default TransferCoin;
