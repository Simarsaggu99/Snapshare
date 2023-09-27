const dayjs = require("dayjs");
const PostLike = require("../../models/Post-like.model");
const PostShare = require("../../models/PostShare");
const PostView = require("../../models/Post-view.model");
const UserFollow = require("../../models/UserFollow.model");
const { ObjectId } = require("mongoose").Types;

const getStatics = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    console.log(userId);

    const today = dayjs().format();
    console.log(today, "today");

    let startDate;

    if (req.query.stats === "weekly") {
      startDate = new Date(dayjs().subtract(7, "day"));
    } else if (req.query.stats === "monthly") {
      startDate = new Date(dayjs().subtract(1, "month"));
    } else if (req.query.stats === "yearly") {
      startDate = new Date(dayjs().subtract(1, "year"));
    } else {
      startDate = new Date(dayjs());
    }

    let endDate = new Date(dayjs());

    let days = [];
    let day = startDate;

    let data = [];

    while (day <= endDate) {
      // days.push(day);
      var start = new Date(day);
      start.setUTCHours(0, 0, 0, 0);

      var end = new Date(day);
      end.setUTCHours(23, 59, 59, 999);

      const likes = await PostLike.countDocuments({
        postUser: ObjectId(userId),
        created_at: {
          $lte: end.toISOString(),
          $gte: start.toISOString(),
        },
        // date: dayjs(e).format("DD MM YYYY"),
      });

      const views = await PostView.countDocuments({
        postUser: ObjectId(userId),
        created_at: {
          $lte: end.toISOString(),
          $gte: start.toISOString(),
        },
        // date: dayjs(e).format("DD MM YYYY"),
      });

      const shares = await PostShare.countDocuments({
        postUser: ObjectId(userId),
        created_at: {
          $lte: end.toISOString(),
          $gte: start.toISOString(),
        },
        // date: dayjs(e).format("DD MM YYYY"),
      });

      const follows = await UserFollow.countDocuments({
        to: ObjectId(userId),
        created_at: {
          $lte: end.toISOString(),
          $gte: start.toISOString(),
        },
        // date: dayjs(e).format("DD MM YYYY"),
      });

      data.push({
        date: dayjs(day).format("DD MM YYYY"),
        likes: likes,
        views: views,
        shares: shares,
        follows: follows,
        total: likes + views + shares + follows,
      });
      day = new Date(dayjs(day).add(1, "day"));
    }

    res.status(200).json({
      message: "success",
      data: data,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};
module.exports = getStatics;
