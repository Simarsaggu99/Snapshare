const Wallet = require("../../models/Wallet.model");
const { ObjectId } = require("mongoose").Types;
const createError = require("http-errors");

const deductCoins = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const walletData = await Wallet.findOne({ user: userId });
    if (!walletData) {
      throw createError(400, "wallet not found");
    }
    const updateWallet = await Wallet.findOneAndUpdate(
      { user: userId },
      { $inc: { meme_coins: -req.body.amount } },
      { new: true }
    );

    if (!updateWallet) {
      return res.status(404).send({ messege: "wallet not found" });
    }
    await updateWallet.save();
    console.log(updateWallet, "oh ho");
    res.json({
      success: true,
      message: "wallets updated successfully",
      walletData: updateWallet,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deductCoins;
