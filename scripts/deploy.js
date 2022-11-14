const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [admin] = await hre.ethers.getSigners();

  const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

  // We get the contract to deploy
  const HarmonyPrediction = await hre.ethers.getContractFactory("HarmonyPrediction");
  const harmonyPredictionContract = await HarmonyPrediction.deploy(
    config.oracleAddress,
    admin.address,
    admin.address, // admin == operator
    config.interval,
    config.bufferSeconds,
    config.minBetAmount,
    config.oracleUpdateAllowance,
    config.treasuryFee
  );

  await harmonyPredictionContract.deployed();
  deployedContractAddress = harmonyPredictionContract.address;
  console.log('harmonyPredictionContract deployed at: ', harmonyPredictionContract.address);

  // set admin and prediction contract address in config
  config.adminAddress = admin.address;
  config.harmonyPredictionContract = harmonyPredictionContract.address;
  fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });