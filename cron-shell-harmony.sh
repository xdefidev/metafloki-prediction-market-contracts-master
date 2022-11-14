#!/bin/bash
# setup command(for every 5min) in "crontab -e": */5 * * * * sh /tmp/Prediction-market-contracts/cron-shell-<network>.sh
. $HOME/.bashrc
cd /tmp/Prediction-market-contracts
npx hardhat run scripts/cron-single.js --network harmony