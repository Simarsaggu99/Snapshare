const Wallet = require("../../models/Wallet.model");
const User = require("../../models/User.model");
const Post = require("../../models/Post.model");
const postViewModel = require("../../models/Post-view.model");
const UserFollow = require("../../models/UserFollow.model");
const CruxThreshold = require("../../models/CruxThreshold.model");
const { ObjectId } = require("mongoose").Types;
const cruxLevelNotification = require("./../notifications/post/cruxLevelNotification");

/**
 *  profile completion, post count, view count, follower count,
 *  - CRUX 1 : Profile completion - on completion of all the fields in the bio -> 1 MC
 *  - CRUX 2 : Post count > 3 -> 2 MC
 *  - CRUX 3 : follower count > 2 -> 3 MC
 *  - CRUX 4 : views count > 5 -> 4 MC
 *  - CRUX 5 : followers count > 3 -> 5 MC
 *  - CRUX 6 : view count > 7 -> Open Marketplace
 *  - CRUX 7 : follower count > 4 -> 10 MC
 *  - CRUX 8 : views count > 9 -> 25 MC
 *  - CRUX 9 : post count > 5 -> 50 MC
 *  - CRUX 10 : views count > 10 -> Open Redeem Option
 *  - CRUX 11 : followers > 5 -> 50 MC
 *  - CRUX 12 : view count > 12 -> 100 MC
 *  - CRUX 13 : follower > 6 -> 250 MC
 *  - CRUX 14 : view count > 13 -> 500 MC
 *  - CRUX 15 : follower > 7 -> 1000 MC
 */
const syncCrux = async (userId, io) => {
  try {
    if (userId) {
      let user = await User.findOne({ _id: ObjectId(userId) });

      let cruxLevel;
      if (user?.cruxLevel || user?.cruxLevel == 0) {
        cruxLevel = user?.cruxLevel;
      }

      if (!cruxLevel) {
        cruxLevel == 0;
      }

      if ((cruxLevel || cruxLevel == 0) && cruxLevel < 15) {
        let message;
        let crux = await CruxThreshold.findOne({ level: cruxLevel + 1 });

        if (crux) {
          let cruxLevelAchieved;
          let memeCoinsRewarded;
          //check if user meets the CRUX criteria to reach this level

          if (crux?.cruxTrigger === "PROFILE_COMPLETE") {
            const userObj = await User.findOne({
              _id: ObjectId(userId),
            });

            if (
              userObj &&
              userObj.dob &&
              userObj.bio &&
              userObj.gender &&
              userObj.country &&
              userObj.user_handle
            ) {
              cruxLevelAchieved = crux.level;
              memeCoinsRewarded = crux.rewardCoins;
            }
          } else if (crux?.cruxTrigger === "POST") {
            let postCount = await Post.countDocuments({
              user: ObjectId(userId),
            });

            if (postCount >= crux.levelTriggerThreshold) {
              cruxLevelAchieved = crux.level;
              memeCoinsRewarded = crux.rewardCoins;
            }
          } else if (crux?.cruxTrigger === "FOLLOWER") {
            const followCount = await UserFollow.countDocuments({
              to: userId,
            });

            if (followCount >= crux.levelTriggerThreshold) {
              cruxLevelAchieved = crux.level;
              memeCoinsRewarded = crux.rewardCoins;
            }
          } else if (crux?.cruxTrigger === "VIEW") {
            let viewCount = await postViewModel.countDocuments({
              postUser: ObjectId(userId),
            });

            if (viewCount >= crux.levelTriggerThreshold) {
              cruxLevelAchieved = crux.level;
              memeCoinsRewarded = crux.rewardCoins;
            }
          }

          //save the Meme and earnings information
          if (cruxLevelAchieved) {
            await User.findOneAndUpdate(
              {
                _id: ObjectId(userId),
              },
              {
                cruxLevel: cruxLevelAchieved,
                $inc: { cruxAwardedMemeCoins: memeCoinsRewarded || 0 },
              },
              { new: true }
            );
            message = `Crux ${cruxLevelAchieved} achieved`;
            if (memeCoinsRewarded) {
              memeCoinsRewarded = Number(memeCoinsRewarded.toFixed(3));
              await Wallet.findOneAndUpdate(
                {
                  user: ObjectId(userId),
                },
                { $inc: { meme_coins: memeCoinsRewarded } },
                {
                  new: true,
                }
              );
              message += `, you have earned ${memeCoinsRewarded} MC.`;
            }

            //to check of any other reward needs to be processed for the CRUX level achievement

            if (crux?.service) {
              //service to be processed on reaching the CRUX level

              if (crux?.service === "openMarketPlace") {
                //DO NOTHING : NOT YET IMPLEMENTED
                // message += ` , will open market place for you!! (Wait while we bring best to you!).`;
              } else if (crux?.service === "openRedeemOption") {
                await User.findOneAndUpdate(
                  {
                    _id: ObjectId(userId),
                  },
                  {
                    redeem: true,
                  },
                  { new: true }
                );
                message += `, you can redeem your Meme Coins (MC) now!!.`;
              }
            }

            await cruxLevelNotification(userId, message, io);

            //call recursively to the syncCrux: to sync all the followed levels
            await syncCrux(userId, io);
          }
        }
      }
    }
  } catch (err) {
    console.log("Error while syncing earnings ", err);
    return err;
  }
};

module.exports = syncCrux;
