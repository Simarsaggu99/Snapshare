const UserBounty = require("../../models/UserBountyModel");
const Bounty = require("../../models/Bounty.model");
const { ObjectId } = require("mongoose").Types;
const syncEarnings = require("../../services/earning/syncEarnings");

const createError = require("http-errors");
const { isValidObjectId } = require("mongoose");

const performBounty = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const { bountyProgramId, userAnswer } = req.body;

    const createdUserBounty = new UserBounty({
      userId,
      bountyProgramId,
      userAnswer,
    });

    const bounty = await Bounty.findById({
      _id: ObjectId(bountyProgramId),
    });

    if (bounty.count >= bounty.totalAttempts) {
      throw createError.BadRequest("Bounty has been ended");
    }

    const updateBounty = await Bounty.findOneAndUpdate(
      {
        _id: ObjectId(bountyProgramId),
      },
      {
        count: bounty.count + 1,
      },
      {
        new: true,
      }
    );

    if (updateBounty.count === updateBounty.totalAttempts) {
      const newBounty = await Bounty.findOneAndUpdate(
        {
          _id: ObjectId(bountyProgramId),
        },
        {
          status: "completed",
          bountyType: "expire",
        },
        {
          new: true,
        }
      );
    }

    const savedPerformedBounty = await createdUserBounty.save();

    const result = await UserBounty.findOneAndUpdate(
      {
        _id: ObjectId(savedPerformedBounty._id),
      },
      {
        result:
          updateBounty.correctAnswer === savedPerformedBounty.userAnswer
            ? "win"
            : "lose",
      },
      {
        new: true,
      }
    );

    let data = {
      coinsRewarded: bounty.meme_coins,
    };

    //sync up the the earnings
    syncEarnings({ userId, bountyFlag: true, data });

    res.status(201).send({ message: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = performBounty;
