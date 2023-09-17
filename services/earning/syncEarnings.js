const Wallet = require("../../models/Wallet.model");
const EarningThreshold = require("../../models/EarningThreshold.model");
const { ObjectId } = require("mongoose").Types;

/**
 *
 * @param {*} user represents the user whose earnings needs to be updated
 * @param {*} likesFlag - indicates likes action is took place and need to update the earnings by the number of likes
 * @param {*} viewFlag - indicates view action is took place and need to update the earnings by the number of view
 * @param {*} inviteFlag - indicates view action is took place and need to update the earnings by the number of view
 * @param {*} surveyFlag - indicates the survey has been submitted by the user and admin has credited some MC to the user
 * @param {*} questionAnsweredFlag  - indicates the survey question has been answered by the user and admin is crediting some MC,
 * @param {*} bountyFlag  - indicates the bounty flag i.e attempted by user and admin is crediting some configured MC,
 * @param {*} data - indicates the data i.e. being sent to sync or update the MC, mainly utilized for the surveyFlag or questionAnsweredFlag
 */
const syncEarning = async ({
  userId,
  likesFlag,
  dislikeFlag,
  viewFlag,
  inviteFlag,
  surveyFlag,
  questionAnsweredFlag,
  bountyFlag,
  data,
}) => {
  try {
    if (userId) {
      let currentEarning = await Wallet.findOne({ user: ObjectId(userId) });

      if (!currentEarning) {
        currentEarning = await Wallet.create({
          user: ObjectId(userId),
          meme_coins: 1,
        });
      }

      let currentEarnedCoins = currentEarning.meme_coins || 0.0;
      if (!currentEarnedCoins) {
        currentEarnedCoins = 0.0;
      }

      let earningThresholdList = await EarningThreshold.find();
      // sync earnings
      if (likesFlag) {
        let currentAddition = 0.002; // 1000 likes = 2 MC - setting a default value
        if (earningThresholdList) {
          let earningThresholdObj = earningThresholdList.find(
            (earningThreshold) => earningThreshold.type === "LIKE"
          );
          if (earningThresholdObj) {
            currentAddition = earningThresholdObj.ratioPerUnit;
          }
        }

        currentEarnedCoins = currentEarnedCoins + currentAddition;

        console.log("currentAddition", currentAddition);
      } else if (dislikeFlag) {
        let currentSubtraction = 0.002; // 1000 likes = 2 MC - setting a default value
        if (earningThresholdList) {
          let earningThresholdObj = earningThresholdList.find(
            (earningThreshold) => earningThreshold.type === "LIKE"
          );
          if (earningThresholdObj) {
            currentSubtraction = earningThresholdObj.ratioPerUnit;
          }
        }
        currentEarnedCoins = currentEarnedCoins - currentSubtraction;
        console.log("currentSubtraction", currentSubtraction);
      } else if (viewFlag) {
        let currentAddition = 0.002; // 1000 views = 2 MC
        if (earningThresholdList) {
          let earningThresholdObj = earningThresholdList.find(
            (earningThreshold) => earningThreshold.type === "VIEW"
          );
          if (earningThresholdObj) {
            currentAddition = earningThresholdObj.ratioPerUnit;
          }
        }
        currentEarnedCoins = currentEarnedCoins + currentAddition;
        console.log("currentAddition", currentAddition);
      } else if (inviteFlag) {
        let currentAddition = 5; // 1 Successful invite = 5 MC - setting a default value

        if (earningThresholdList) {
          let earningThresholdObj = earningThresholdList.find(
            (earningThreshold) => earningThreshold.type === "INVITE"
          );
          if (earningThresholdObj) {
            currentAddition = earningThresholdObj.ratioPerUnit;
          }
        }
        currentEarnedCoins = currentEarnedCoins + currentAddition;
        console.log("currentAddition", currentAddition);
      } else if (surveyFlag) {
        let currentAddition = data?.coinsRewarded || 0.0;
        currentEarnedCoins = currentEarnedCoins + currentAddition;
        console.log("currentAddition", currentAddition);
      } else if (questionAnsweredFlag) {
        let currentAddition = data?.coinsRewarded || 0.0;
        currentEarnedCoins = currentEarnedCoins + currentAddition;
        console.log("currentAddition", currentAddition);
      } else if (bountyFlag) {
        let currentAddition = data?.coinsRewarded || 0.0;
        currentEarnedCoins = currentEarnedCoins + currentAddition;
        console.log("currentAddition", currentAddition);
      }

      console.log("currentEarnedCoins", currentEarnedCoins);
      currentEarnedCoins = Number(currentEarnedCoins.toFixed(3));
      //save the Meme and earnings information
      currentEarning = await Wallet.findOneAndUpdate(
        {
          user: ObjectId(userId),
        },
        {
          meme_coins: currentEarnedCoins,
        },
        {
          new: true,
        }
      );
    }
  } catch (err) {
    console.log("Error while syncing earnings ", err);
    return err;
  }
};

module.exports = syncEarning;
