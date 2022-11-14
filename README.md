
# Harmony Price Prediction Market

[*Harmony Price Prediction Market*](https://blissful-wright-9add2f.netlify.app/prediction) is a fun and simple decentralized prediction market using `chainlink` oracle.

User Interface: https://blissful-wright-9add2f.netlify.app/prediction

# Dapp

#![pred-1](https://user-images.githubusercontent.com/26249903/135519747-54f5df89-2192-42af-b065-45f0f09f0ec6.png)

![pred-2](https://user-images.githubusercontent.com/26249903/135519769-11882e79-653e-4c40-a1ff-f48bc0573768.png)

![pred-3](https://user-images.githubusercontent.com/26249903/135519778-c6190b46-de52-4f09-bbff-184f4cc26bbd.png)


## Take part in market

It's easy to take part:

* Predict if the price of Harmony/USDT will be higher or lower than it was when the “LIVE” phase starts.
* If you enter an “UP” position, and the Harmony/USDT “Closed Price” is higher than the “Locked Price” at the end of the 5 minute LIVE phase, you WIN! And if it’s lower, you lose.
* If you enter a “DOWN” position, and the Harmony/USDT “Closed Price” is higher than the “Locked Price” at the end of the 5 minute LIVE phase, you LOSE! If it’s lower, you win.

## Guide

Check [prediction-guide.md](./prediction-guide.md) for detailed walkthrough of using Harmony prediction market.

## Config

The following config has been added to `config.json`:
* *HarmonyPredictionContract*: address of deployed contract
* *oracleAddress*: address of oracle (chainlink Harmony/USDT price feed)
* *adminAddress*: address of admin (and operator) which is the controller
* *interval*: interval of rounds (set to `30 min`)
* *bufferSeconds*: timeperiod for admin/operator to execute rounds
* *oracleUpdateAllowance*
* *treasuryFee*: set as 5%

The network config is set in `hardhat.config.js` (in networks.avalanche)

# UI

Frontend code for this project can be found [here](https://github.com/amityadav0/Prediction-market-ui/tree/harmony).
Dapp can be found at [https://blissful-wright-9add2f.netlify.app/prediction](https://blissful-wright-9add2f.netlify.app/prediction).

## RoadMap

UI is referenced from [pancakeswap.finance](https://pancakeswap.finance/), and our focus has been on contracts integration and a smooth flow of an automated price prediction market.

- Integrate HRC-20 support to UI, we have contracts for HRC20 tokens price prediction.
- Enhance UI
