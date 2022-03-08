/* eslint-disable react/destructuring-assignment */
import { ethers } from "ethers";
import {
  Box,
  Link,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import abi from "../utils/SendEth.json";
import { BountyItem } from "../types/BountyItem";

// eslint-disable-next-line react/function-component-definition
const Bounty: FC<BountyItem> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sendEthTxnHash, setSendEthTxnHash] = useState("");
  const sendEth = async () => {
    try {
      const { ethereum } = window;
      const contractAddress = "0x6Aa1AE3605C7ce0038f97400FC7FCA718699bDB7";
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
        setSendEthTxnHash(sendEthTxn.hash);
        console.log("Mining...", sendEthTxn.hash);
        await sendEthTxn.wait();
        console.log("Mined -- ", sendEthTxn.hash);
        console.log("sent eth");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Center py={12}>
      <Box
        role="group"
        p={6}
        maxW="330px"
        w="full"
        bg={useColorModeValue("white", "gray.800")}
        boxShadow="2xl"
        rounded="lg"
        pos="relative"
        zIndex={1}
      >
        <Box
          rounded="lg"
          mt={-12}
          pos="relative"
          height="230px"
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            rounded="lg"
            height={230}
            width={282}
            objectFit="cover"
            src={props.imageUrl}
          />
        </Box>
        <Stack pt={10} align="center">
          <Heading fontSize="2xl" fontFamily="body" fontWeight={500}>
            {props.headMessage}
          </Heading>
          <Stack direction="row" align="center">
            <Text fontWeight={800} fontSize="xl">
              {props.textMessage}
            </Text>
          </Stack>
        </Stack>
        {props.canClaim && (
          <div>
            <Button onClick={onOpen}>Claim Rewords</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>You completed this task !</ModalHeader>
                <ModalBody>You can claim rewords.</ModalBody>
                <ModalCloseButton />
                <ModalFooter>
                  {sendEthTxnHash && (
                    <Link
                      href={`https://rinkeby.etherscan.io/tx/${sendEthTxnHash}`}
                    >
                      View in Etherscan
                    </Link>
                  )}
                  <Button variant="ghost" onClick={sendEth}>
                    Claim
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        )}
      </Box>
    </Center>
  );
};

export default Bounty;
