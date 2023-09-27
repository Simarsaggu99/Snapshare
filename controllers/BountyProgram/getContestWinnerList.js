const MemeContestWinnerModel = require("../../models/MemeContestWinner");
const getContestWinner = async (req, res, next) => {
  try {
    const contestWinner = await MemeContestWinnerModel.aggregate([
      {
        $sort: {
          created_at: -1,
        },
      },

      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "post",
          localField: "postId",
          foreignField: "_id",
          as: "postDetails",
        },
      },
      {
        $unwind: {
          path: "$postDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          userId: 1,
          created_at: 1,
          postId: 1,
          endDate: 1,
          _id: 1,
          meme_coins: 1,
          meme_contest_like: 1,
          updated_at: 1,
          postDetails: {
            description: 1,
            meme_coins: 1,
            type: 1,
            _id: 1,
            media: 1,
          },
          userDetails: {
            name: 1,
            user_handle: 1,
            email: 1,
            _id: 1,
            avatar_url: 1,
          },
        },
      },
    ]).limit(3);

    res.status(200).json({
      data: contestWinner,
      success: true,
    });
  } catch (error) {
    console.log(error, "err");
    next(error);
  }
};

module.exports = getContestWinner;
