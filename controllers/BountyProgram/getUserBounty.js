const Bounty = require("../../models/Bounty.model");

const getUserBounty = async (req, res, next) => {
  const searchCriteria = {};

  const { _id: userId } = req.user.data;

  try {
    // const findPost = await Post.countDocuments({
    //   user: ObjectId(userId),
    //   date: dayjs().format("DD MM YYYY"),
    // });

    // if (findPost >= 10) {
    //   throw createError.BadRequest("You have posted 10 posts!");
    // }

    const bountyData = await Bounty.aggregate([
      {
        $match: {
          bountyType: "live",
        },
      },
    ]);

    res.status(200).json({
      data: bountyData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserBounty;
