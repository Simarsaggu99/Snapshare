const createError = require("http-errors");
const RedeemRequest = require("../../models/RedeemRequest");
const User = require("../../models/User.model");
const Wallet = require("../../models/Wallet.model");
const cruxLevel = require("../../services/notifications/post/cruxLevelNotification");
const { updateUserValidation } = require("../../services/validation_schema");
var ObjectId = require("mongodb").ObjectID;

const transactionStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = req.body;

    //Updating the feilds into dataBase
    const updatetransactionStatus = await RedeemRequest.findOneAndUpdate(
      { _id: ObjectId(userId) },
      result,
      { new: true }
    );

    await updatetransactionStatus.save();
    res.json({
      success: true,
      message: "transation updated successfully",
      data: updatetransactionStatus,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = transactionStatus;
