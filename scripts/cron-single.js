const hre = require("hardhat");
const cron = require("node-cron");
const fs = require("fs");

const sleep = async (ms) => {
  await new Promise((r) => setTimeout(r, ms));
};

const printTs = async (harmonyPredictionContract) => {
  console.log("\n\n-------ROUND INNFO START------");
  const currEpoch = await (
    await harmonyPredictionContract.currentEpoch()
  ).toNumber();
  const roundAtCurrEpoch = await harmonyPredictionContract.rounds(currEpoch);
  console.log(
    "Current Block TimeStamp ",
    await (await harmonyPredictionContract.getBlockTimestamp()).toNumber()
  );
  console.log(
    "roundAtCurrEpoch.lockTimestamp ",
    roundAtCurrEpoch.lockTimestamp.toNumber()
  );

  // https://stackoverflow.com/questions/68417684/how-can-i-make-the-data-provided-by-some-chainlink-aggregator-get-updated-every
  const oracleRounds = await harmonyPredictionContract.getLatestOracleRounds();
  console.log(
    "oracleRounds.roundID(latest round from oracle) ",
    oracleRounds[0].toString()
  );
  console.log(
    "oracleRounds.oracleLatestRoundId(last saved roundID in contract) ",
    oracleRounds[1].toString()
  );
  console.log("-------ROUND INNFO END------\n\n");
};

async function execute(harmonyPredictionContract) {
  const paused = await harmonyPredictionContract.paused();
  console.log("is_contract_paused ", paused);

  const currentEpoch = await (
    await harmonyPredictionContract.currentEpoch()
  ).toNumber();
  console.log("currentEpoch ", currentEpoch);

  let skipped = false;
  if (!paused) {
    const genesisStartOnce = await harmonyPredictionContract.genesisStartOnce();
    const genesisLockOnce = await harmonyPredictionContract.genesisLockOnce();
    console.log("genesisStartOnce ", genesisStartOnce);
    console.log("genesisLockOnce ", genesisLockOnce);

    if (genesisStartOnce === false) {
      console.log("\nstarting genesis round...");
      try {
        await printTs(harmonyPredictionContract);
        const tx = await harmonyPredictionContract.genesisStartRound();
        await tx.wait();
      } catch (error) {
        console.log("error ", error);
      }

      const newEpoch = await (
        await harmonyPredictionContract.currentEpoch()
      ).toNumber();
      console.log("Current epoch now: ", newEpoch);
      skipped = true;
    }

    if (!skipped && genesisLockOnce === false) {
      console.log("\nlocking genesis round...");
      try {
        await printTs(harmonyPredictionContract);
        const tx = await harmonyPredictionContract.genesisLockRound({
          from: config.adminAddress,
          gasLimit: 500000,
          gasPrice: _gasPrice.mul(2),
        });
        await tx.wait();
      } catch (error) {
        console.log("error ", error);
      }

      const newEpoch = await (
        await harmonyPredictionContract.currentEpoch()
      ).toNumber();
      console.log("Current epoch now: ", newEpoch);
      skipped = true;
    }

    if (!skipped && genesisStartOnce && genesisLockOnce) {
      console.log("\nExecuting round...");
      try {
        await printTs(harmonyPredictionContract);
        const tx = await harmonyPredictionContract.executeRound();
        await tx.wait();
      } catch (error) {
        console.log("error ", error);
      }

      const newEpoch = await (
        await harmonyPredictionContract.currentEpoch()
      ).toNumber();
      console.log("Current epoch now: ", newEpoch);
      skipped = true;
    }
  }
}

async function main() {
  const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

  const [signer] = await hre.ethers.getSigners();
  const harmonyPredictionContract = await hre.ethers.getContractAt(
    "MetaFlokiPrediction",
    config.harmonyPredictionContract,
    signer
  );

  // await sleep(12 * 1000); // sleep for 12s
  await execute(harmonyPredictionContract);

  setInterval(async () => {
    await execute(harmonyPredictionContract);
  }, (config.interval + 15) * 1000);
}
main();
