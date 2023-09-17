const User = require("../../models/User.model");
const ObjectId = require("mongodb").ObjectID;

const suspendUser = async (req, res, next) => {
  try {
    const userIds = req.body;
    console.log(userIds, "aaaa");
    // const { _id: userId } = req.user.data;
    const data = await userIds?.userId?.map(async (item) => {
      console.log(item, "item");
      await User.findOneAndUpdate(
        {
          _id: ObjectId(item),
        },
        {
          isSuspended: true,
        },
        {
          new: true,
        }
      );
    });
    console.log(data, "aaa");

    res.status(200).json({
      message: "user deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = suspendUser;
