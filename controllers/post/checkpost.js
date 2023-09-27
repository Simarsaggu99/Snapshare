const createError = require("http-errors");
var ObjectId = require("mongodb").ObjectID;
const Post = require("../../models/Post.model");
const CheckPosts = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  // const todayDate = dayjs().format("DD MM YYYY");
  const todayPosts = await Post.countDocuments({
    $and: [
      {
        user: ObjectId(userId),
      },
      {
        created_at: {
          $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setUTCHours(23, 59, 59, 999)),
        },
      },
    ],
  });

  res.status(200).json({
    success: true,
    todayPost: todayPosts > 9 ? false : true,
    postCount: 10 - Number(todayPosts),
  });
};
module.exports = CheckPosts;
