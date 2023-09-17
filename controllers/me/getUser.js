// import user model
const User = require("../../models/User.model");
const Post = require("../../models/Post.model");
const dayjs = require("dayjs");
// const PostGift = require("../../models/PostGift.model");
const { ObjectId } = require("mongoose").Types;

const getUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;

    const isUserExist = await User.findById({ _id: ObjectId(userId) });

    if (!isUserExist) {
      return res
        .status(404)
        .send({ status: false, message: "User does not exist" });
    }
    const user = await User.aggregate([
      {
        $match: {
          _id: ObjectId(userId),
        },
      },
    ]);

    const postCount = await Post.countDocuments({
      user: ObjectId(userId),
      date: dayjs().format("DD MM YYYY"),
    });

    return res.json({
      status: "success",
      data: { ...user[0], todaysPost: postCount },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching user",
      error: err,
    });
  }
};
module.exports = getUser;
