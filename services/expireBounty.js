const createError = require("http-errors");
const dayjs = require("dayjs");
const Bounty = require("../models/Bounty.model");
const Post = require("../models/Post.model");
const MemeContestWinnerModel = require("../models/MemeContestWinner");
const { ObjectId } = require("mongoose").Types;

const expireBounty = async () => {
  try {
    let bounty = await Bounty.find({ bountyType: "live" });
    if (!bounty) {
      throw createError(404, "No tasks found");
    }

    await Promise.all(
      bounty?.map(async (item) => {
        if (dayjs() >= dayjs(item.endDate)) {
          if (item?.type === "Meme_contest" && item?.bountyType === "live") {
            const winnerPost = await Post.aggregate([
              { $match: { bounty: ObjectId(item?._id) } },
              { $sort: { memeContestLikes: -1 } },
            ]).limit(1);
            if (winnerPost) {
              const winner = new MemeContestWinnerModel({
                postId: winnerPost?.[0]?._id,
                endDate: item?.endDate,
                meme_coins: item?.meme_coins,
                meme_contest_like: winnerPost?.[0]?.like_count || 0,
                userId: winnerPost?.[0]?.user?._id,
              });
              await winner.save();
            }
          }
          item.bountyType = "expire";
          await item.save();
        }
        return item;
      })
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = expireBounty;
