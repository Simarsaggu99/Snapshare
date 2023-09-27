const dayjs = require("dayjs");
const RedeemRequest = require("../../models/RedeemRequest");
const User = require("../../models/User.model");
const Wallet = require("../../models/Wallet.model");
const { ObjectId } = require("mongoose").Types;

const redeemRequest = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    const data = req.body;
    const wallet = await Wallet.findOne({ user: ObjectId(userId) });

    if (!wallet) {
      return res.status(404).send({ messege: "wallet not found" });
    }
    const userDetails = await User.findById({
      _id: userId,
    });
    const dateDifferent = dayjs().diff(userDetails?.lastTransaction, "day");
    if (dateDifferent < 7) {
      return res.status(400).send({
        messege: "Your next request will after week from the last transaction.",
      });
    }
    if (data?.memeCoins > wallet?.meme_coins) {
      return res.status(409).send({ messege: "you don't have enough balance" });
    }
    const redeemRequest = RedeemRequest({
      ...data,
      userId,
    });
    await redeemRequest.save();
    const user = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        lastTransaction: redeemRequest?.createdAt,
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "successfully",
      walletData: redeemRequest,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = redeemRequest;
