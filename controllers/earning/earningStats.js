const dayjs = require("dayjs");
const PostLike = require("../../models/Post-like.model");
const Userbounty = require("../../models/UserBountyModel");
const User = require("../../models/User.model");
const PostView = require("../../models/Post-view.model");
const { ObjectId } = require("mongoose").Types;

const getEarnings = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    console.log(userId);

    const today = dayjs().format();
    console.log(today, "today");

    let conditionDate;

    if (req.query.stats === "weekly") {
      conditionDate = new Date(dayjs().subtract(7, "day"));
    } else if (req.query.stats === "monthly") {
      conditionDate = new Date(dayjs().subtract(1, "month"));
    } else if (req.query.stats === "yearly") {
      conditionDate = new Date(dayjs().subtract(1, "year"));
    } else {
      conditionDate = new Date(dayjs().subtract(1, "day"));
    }

    let user = await User.findOne({ _id: ObjectId(userId) });

    const UserLike = await PostLike.countDocuments({
      postUser: ObjectId(userId),
      created_at: {
        $lte: dayjs(),
        $gte: dayjs(conditionDate),
      },
    });

    const UserViews = await PostView.countDocuments({
      postUser: ObjectId(userId),
      created_at: {
        $lte: dayjs(),
        $gte: dayjs(conditionDate),
      },
    });
    const UserBounty = await Userbounty.aggregate([
      {
        $match: {
          userId: ObjectId(userId),
          date: {
            $lte: dayjs().format("DD MM YYYY"),
            $gte: dayjs(conditionDate).format("DD MM YYYY"),
          },
        },
      },
      {
        $lookup: {
          from: "bounty",
          let: { id: "$bountyProgramId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$id"] }],
                },
              },
            },

            // {
            //   $lookup: {
            //     from: "gift",
            //     localField: "gift",
            //     foreignField: "_id",
            //     as: "gift",
            //   },
            // },
            // {
            //   $unwind: "$gift",
            // },
          ],
          as: "bounty",
        },
      },
      {
        $unwind: "$bounty",
        // preserveNullAndEmptyArrays: true,
      },
      {
        $group: {
          _id: null,
          coins: { $sum: "$bounty.meme_coins" },
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("Bounty ", UserBounty);
    res.status(200).json({
      message: "success",
      UserLike: UserLike * 0.002,
      UserLikeCount: UserLike,
      UserViewsCount: UserViews,
      UserViews: UserViews * 0.002,
      UserBounty: UserBounty?.[0] || 0,
      UserBountiesWon: UserBounty?.length,
      cruxLevelAchieved: user.cruxLevel,
      totalCruxEarnings: user.cruxAwardedMemeCoins,
      totalInvite: 0,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};
module.exports = getEarnings;
