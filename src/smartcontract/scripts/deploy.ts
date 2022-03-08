/* eslint-disable no-undef */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// import { ethers } from "hardhat";

async function mainFunc() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const SendEthContractFactory = await hre.ethers.getContractFactory("SendEth");
  const sendEth = await SendEthContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.05"),
  });
  await sendEth.deployed();
  console.log("Contract deployed to:", sendEth.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mainFunc().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
