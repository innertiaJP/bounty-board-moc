import React, { useEffect, useState } from "react";
import {
  Heading,
  Text,
  Stack,
  Box,
  Button,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Bounty from "./components/Bounty";
import { BountyInfo } from "./types/BountyInfo";
import TransferCoin from "./components/TransferCoin";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const bounty1: BountyInfo = {
    imageUrl:
      "https://news.mynavi.jp/article/20210809-1942830/images/000b_l.jpg",
    title: "Tweet about the project",
    price: "0.001 ETH",
    canClaim: true,
  };
  const bounty2: BountyInfo = {
    imageUrl:
      "https://www.preface.ai/blog/wp-content/uploads/2021/05/photo-1610563166150-b34df4f3bcd6.jpeg",
    title: "Create New Function",
    price: "0.005 ETH",
    canClaim: false,
  };
  const bounty3: BountyInfo = {
    imageUrl:
      "https://www.ldaustralia.org/app/uploads/2021/08/kid-writing-in-notebook-TX2KE7V-1536x1024.jpg",
    title: "Write New Article",
    price: "0.002 ETH",
    canClaim: false,
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

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
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
                  <Flex
                    flex={{ base: 1 }}
                    justify={{ base: "center", md: "start" }}
                  >
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
                <Text
                  as="span"
                  fontSize={{ base: "1xl", sm: "2xl", md: "3xl" }}
                >
                  New Bounties
                </Text>
                <Bounty
                  imageUrl={bounty2.imageUrl}
                  title={bounty2.title}
                  price={bounty2.price}
                  canClaim={bounty2.canClaim}
                />
                <Bounty
                  imageUrl={bounty3.imageUrl}
                  title={bounty3.title}
                  price={bounty3.price}
                  canClaim={bounty3.canClaim}
                />
                <Text
                  as="span"
                  fontSize={{ base: "1xl", sm: "2xl", md: "3xl" }}
                >
                  You Completed
                </Text>
                <Bounty
                  imageUrl={bounty1.imageUrl}
                  title={bounty1.title}
                  price={bounty1.price}
                  canClaim={bounty1.canClaim}
                />
              </Stack>
            </>
          }
        />
        <Route path="/transfer-coin" element={<TransferCoin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
