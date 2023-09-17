const createError = require("http-errors");
const UserModel = require("../../models/User.model");
const { ObjectId } = require("mongoose").Types;

const deleteAvatar = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    if (!userId) {
      throw createError.Unauthorized("Please login first!");
    }

    const checkUser = await UserModel.findOne({ _id: ObjectId(userId) });

    if (!checkUser) {
      throw createError.NotFound("User not Found!");
    }

    if (!checkUser.avatar_url) {
      throw createError.NotFound("User does not have any avatar!");
    }

    await UserModel.findOneAndUpdate(
      { _id: ObjectId(userId) },
      { $unset: { avatar_url: "" } },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Avatar removed successfully!",
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = deleteAvatar;
