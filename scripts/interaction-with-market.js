// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const sleep = async (ms) => {
  await new Promise((r)=>(setTimeout(r, ms)));
}

async function main() {

  const [admin, userA, userB, userC] = await hre.ethers.getSigners();
  const avaxPredictionContract = await hre.ethers.getContractAt(
    'AvaxPrediction',
    '0xE55FF0000baA6Ac473aE3296C13110445Ed68647', // hardcoded
  );

  console.log('------- Operator(admin) ---------');

  //await avaxPredictionContract.genesisStartRound();

  const currentEpoch = await (await avaxPredictionContract.currentEpoch()).toNumber();
  console.log('currentEpoch ', currentEpoch);

  const rounds = await avaxPredictionContract.rounds(currentEpoch);

  console.log('startTimestamp ', await (await rounds.startTimestamp).toNumber());
  console.log('lockTimestamp ', await (await rounds.lockTimestamp).toNumber());
  console.log('closeTimestamp ', await (await rounds.closeTimestamp).toNumber());

  const c = await hre.ethers.getContractAt(
    'AggregatorV3Interface',
    '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD', // hardcoded (BNB/USD)
  );

  const priceAsNum = await ((await c.latestRoundData()).answer).toNumber();
  const price = '$' + parseFloat((priceAsNum / 10 ** 8).toFixed(3));

  console.log('Current AVAX/USD price ', price);


  console.log('------ Betting Starts -------');

  console.log('UserA betting BEAR(DOWN) for amount 0.00001 BNB..');
  await avaxPredictionContract.betBear(currentEpoch, {
    value: hre.ethers.utils.parseEther("0.001") // 0.01 BNB
  });

  // console.log('UserB betting BULL(UP) for amount 0.1 BNB..');
  await avaxPredictionContract.connect(userB).betBull(currentEpoch, {
    value: hre.ethers.utils.parseEther("0.00001") // 0.1 BNB
  });


  console.log('UserC betting BEAR(DOWN) for amount 0.05 BNB..');
  await avaxPredictionContract.connect(userC).betBull(currentEpoch, {
    value: hre.ethers.utils.parseEther("0.0005") // 0.05 BNB
  });

  // console.log('------- Betting Ends -------');

  const rounds1 = await avaxPredictionContract.rounds(currentEpoch);
  console.log('totalAmount ', hre.ethers.utils.formatUnits(await rounds1.totalAmount, 18) + ' BNB');
  console.log('bullAmount ', hre.ethers.utils.formatUnits(await rounds1.bullAmount, 18) + ' BNB');
  console.log('bearAmount ', hre.ethers.utils.formatUnits(await rounds1.bearAmount, 18) + ' BNB');

  await sleep(10 * 1000);

  console.log('locking current round..');
  await avaxPredictionContract.connect(admin).genesisLockRound();
  await sleep(2000);

  console.log('currentEPOCH ', await avaxPredictionContract.currentEpoch());
  console.log('genesisLockOnce ', await avaxPredictionContract.genesisLockOnce());
  console.log('BNB/USD Locked At: ', '$' + hre.ethers.utils.formatUnits(await rounds.lockPrice, 8));


  // await sleep(20 * 1000);
  // console.log('Executing previous round, calculating rewards...');
  // await avaxPredictionContract.connect(admin).executeRound();

  // await sleep(2000);
  // const roundA = await avaxPredictionContract.rounds(currentEpoch);
  // console.log('roundA ', roundA);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
