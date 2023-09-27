const dayjs = require("dayjs");
const PostLike = require("../../models/Post-like.model");
const PostShare = require("../../models/PostShare");
const PostView = require("../../models/Post-view.model");
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const Wallet = require("../../models/Wallet.model");
const { ObjectId } = require("mongoose").Types;

const dashboardStats = async (req, res, next) => {
  try {
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

    let endDate = new Date(dayjs());

    let days = [];
    let day = conditionDate;

    while (day <= endDate) {
      days.push(day);
      day = new Date(dayjs(day).add(1, "day"));
    }

    let newUsers;
    let totalPosts;
    let newUsersData = [];
    let totalPostsData = [];

    for (x of days) {
      newUsers = await User.countDocuments({
        isDeleted: {
          $nin: true,
        },
        date: dayjs(x).format("DD MM YYYY"),
      });

      totalPosts = await Post.countDocuments({
        date: dayjs(x).format("DD MM YYYY"),
      });
      newUsersData.push({
        count:newUsers,
        date:x,
      });
      totalPostsData.push({
        count: totalPosts,
        date: x,
      });
    }

    const hiddenReportedPosts = await Post.countDocuments({
      reportExceed: true,
    });
    const deletedReportedPostsByAdmin = await Post.countDocuments({
      reportExceed: true,
      isDeleted: true,
    });

    const deletedUsers = await User.countDocuments({
      isDeleted: true,
    });

    const memeCoins = await Wallet.find();
    let totalEarnings = 0;
    memeCoins?.map((item) => {
      totalEarnings = totalEarnings + item?.meme_coins;
    });

    res.status(200).json({
      message: "success",
      newUsers: newUsersData,
      totalPosts: totalPostsData,
      deletedUsers: deletedUsers,
      totalEarnings: totalEarnings,
      hiddenReportedPosts: hiddenReportedPosts,
      deletedReportedPostsByAdmin: deletedReportedPostsByAdmin,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};
module.exports = dashboardStats;
