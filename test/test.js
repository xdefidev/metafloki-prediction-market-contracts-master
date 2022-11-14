const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Avax Prediction Market", function () {

  const zeroAddress = '0x0000000000000000000000000000000000000000';
  let AvaxPredictionFactory;
  let avaxPredictionContract;

  // depoyment parameters
  let oracle;
  let admin;
  let operator;
  let intervalSeconds;
  let bufferSeconds;
  let minBetAmount;
  let oracleUpdateAllowance;
  let treasuryFee;

  // setup factory and contracts
  beforeEach(async function () {
    [oracle, admin, operator] = await ethers.getSigners();
    intervalSeconds = 5 * 60;
    bufferSeconds = 1 * 60;
    minBetAmount = 100 // wei
    oracleUpdateAllowance = 1 * 60;
    treasuryFee = 500; // 5%

    AvaxPredictionFactory = await ethers.getContractFactory("AvaxPrediction");
    avaxPredictionContract = await AvaxPredictionFactory.deploy(
      oracle.address,
      admin.address,
      operator.address,
      intervalSeconds,
      bufferSeconds,
      minBetAmount,
      oracleUpdateAllowance,
      treasuryFee
    );
  });

  it("Should revert deployment if treasury fee too high", async function () {
    await expect(
      AvaxPredictionFactory.deploy(
        oracle.address,
        admin.address,
        operator.address,
        intervalSeconds,
        bufferSeconds,
        minBetAmount,
        oracleUpdateAllowance,
        2000 // 20%
      )
    ).to.be.revertedWith("Treasury fee too high");
  });

  describe("pause", async () => {
    it("Should be pausable only by admin or operator", async function () {
      const [, , , newAcc] = await ethers.getSigners();

      // fails
      await expect(
        avaxPredictionContract.connect(newAcc).pause()
      ).to.be.revertedWith("Not operator/admin");

      // passes
      await avaxPredictionContract.connect(admin).pause();
    });

    it("Should reject if trying to pause an already paused market", async function () {
      await avaxPredictionContract.connect(admin).pause();

      await expect(
        avaxPredictionContract.connect(admin).pause()
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should unpause an already paused market", async function () {
      await avaxPredictionContract.connect(admin).pause();

      // operator can pause but cannot "unpause"
      await expect(
        avaxPredictionContract.connect(operator).unpause()
      ).to.be.revertedWith("Not admin");

      // only admin can unpause
      await avaxPredictionContract.connect(admin).unpause();
      expect(await avaxPredictionContract.genesisLockOnce()).to.equal(false);
      expect(await avaxPredictionContract.genesisStartOnce()).to.equal(false);
    });
  });

  describe("setMinBetAmount", async () => {
    it("should revert if not market not paused", async function () {
      await expect(
        avaxPredictionContract.setMinBetAmount(100)
      ).to.be.revertedWith("Pausable: not paused");
    });

    it("should revert if msg.sender is not admin", async function () {
      const [, , addr] = await ethers.getSigners();
      await avaxPredictionContract.connect(admin).pause();

      await expect(
        avaxPredictionContract.connect(addr).setMinBetAmount(0)
      ).to.be.revertedWith("Not admin");
    });

    it("should revert if betAmount == 0", async function () {
      await avaxPredictionContract.connect(admin).pause();

      await expect(
        avaxPredictionContract.connect(admin).setMinBetAmount(0)
      ).to.be.revertedWith("Must be superior to 0");
    });

    it("should set minBetAmount", async function () {
      await avaxPredictionContract.connect(admin).pause();

      // set new amount as 211 wei
      await avaxPredictionContract.connect(admin).setMinBetAmount(211);

      // assert amount is updated in contract
      expect(await avaxPredictionContract.minBetAmount()).to.equal(211);
    });
  });

  describe("setOperator", async () => {
    it("should revert if not market not paused", async function () {
      await expect(
        avaxPredictionContract.setMinBetAmount(100)
      ).to.be.revertedWith("Pausable: not paused");
    });

    it("should revert if msg.sender is not admin", async function () {
      const [, , addr, newOp] = await ethers.getSigners();

      await expect(
        avaxPredictionContract.connect(addr).setOperator(newOp.address)
      ).to.be.revertedWith("Not admin");
    });

    it("should revert if admin tries to set new operator as zero address", async function () {
      await expect(
        avaxPredictionContract.connect(admin).setOperator(zeroAddress)
      ).to.be.revertedWith("Cannot be zero address");
    });

    it("should set new operator address", async function () {
      const [, , , newOp] = await ethers.getSigners();

      // set new address as newOp.address
      await avaxPredictionContract.connect(admin).setOperator(newOp.address);

      // assert new address is reflected in contract
      expect(await avaxPredictionContract.operatorAddress()).to.equal(newOp.address);
    });
  });

  describe("setOracle", async () => {
    it("should revert if not market not paused", async function () {
      const [, , , addr] = await ethers.getSigners();
      await expect(
        avaxPredictionContract.connect(admin).setOracle(addr.address)
      ).to.be.revertedWith("Pausable: not paused");
    });

    it("should revert if msg.sender is not admin", async function () {
      await avaxPredictionContract.connect(admin).pause();

      const [, , operator, addr] = await ethers.getSigners();
      await expect(
        avaxPredictionContract.connect(operator).setOracle(addr.address)
      ).to.be.revertedWith("Not admin");
    });

    it("should revert if new oracle address is set as zeroAddress", async function () {
      await avaxPredictionContract.connect(admin).pause();

      await expect(
        avaxPredictionContract.connect(admin).setOracle(zeroAddress)
      ).to.be.revertedWith("Cannot be zero address");
    });

    // it("should set new oracle address", async function () {
    //   const [, , , addr1] = await ethers.getSigners();
    //   await avaxPredictionContract.connect(admin).pause();

    //   // set new oracle address
    //   await avaxPredictionContract.connect(admin).setOracle(oracle.address);

     // console.log('-> ', await avaxPredictionContract.oracle);
      // // assert address is updated
      // expect(await avaxPredictionContract.minBetAmount()).to.equal(211);
    // });
  });
});
