const Wallet = require("../../models/Wallet.model");
const { ObjectId } = require("mongoose").Types;

const getWallet = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    const wallet = await Wallet.aggregate([
      {
        $match: { user: ObjectId(userId) },
      },
    ]);

    if (!wallet) {
      return res.status(404).send({ messege: "wallet not found" });
    }
    res.json({
      success: true,
      message: "wallets fetched successfully",
      walletData: wallet[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getWallet;
