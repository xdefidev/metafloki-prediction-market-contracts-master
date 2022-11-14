require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    harmony: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [process.env.PRIVATE_KEY],
    },
    avalanche: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      gas: 3100000,
      gasPrice: 76000000000,
      accounts: [
        "69ca251a19064f103500412822a14b73ff73d4de4e2ca310bd9e1b599dbbb53c",
        "e75c8e43573aa5a64452a741fbcdc424ffc83dc66af04520906d04ceef8dc24a",
        "d07fa9bdb1c7abe353ae51681792d328a4749afee918dbdee58d61c715807d1c",
        "f82106aeea22687c1414fe6b237a1941d58130b2d57bc39b32a2873a78d79fc9",
      ],
    },
    rinkeby: {
      url: "https://ropsten.infura.io/v3/d5b63801f95e473db76a3ca98a7930f9",
      accounts: [
        "69ca251a19064f103500412822a14b73ff73d4de4e2ca310bd9e1b599dbbb53c",
      ],
    },
  },
  solidity: {
    version: "0.8.0",
    defaultNetwork: "harmony",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "istanbul",
    },
  },
};
