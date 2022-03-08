const hre = require("hardhat");

const main = async () => {
  const SendEthContractFactory = await hre.ethers.getContractFactory("SendEth");
  const sendEthContract = await SendEthContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await sendEthContract.deployed();
  console.log("Contract deployed to:", sendEthContract.address);
  let contractBalance = await hre.ethers.provider.getBalance(
    sendEthContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  const sendEthTxn = await sendEthContract.sendEth();
  await sendEthTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(
    sendEthContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
