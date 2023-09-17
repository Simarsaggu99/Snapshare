const createError = require("http-errors");
const User = require("../../models/User.model");
const cruxLevel = require("../../services/notifications/post/cruxLevelNotification");
const { updateUserValidation } = require("../../services/validation_schema");
var ObjectId = require("mongodb").ObjectID;
const syncCrux = require("../../services/crux/syncCrux");

const updateUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    //const { dateOfBirth } = req.body ;

    //converting the date into GMT format
    // const dob= new Date(dateOfBirth);
    // delete req.body['dateOfBirth'];
    // req.body["dob"] = dob.toString();

    //Validation of Request Body
    const result = req.body;

    const contacts = await User.findOne({ _id: ObjectId(userId) });
    if (!contacts) {
      throw createError(404, "Contact not found");
    }

    //Updating the fields into dataBase
    const updateContacts = await User.findOneAndUpdate(
      { _id: ObjectId(userId) },
      result,
      { new: true }
    );
    if (updateContacts.cruxLevel < 1) {
      //syncing the crux and the associated earnings
      syncCrux(userId, req.io);
    }
    await updateContacts.save();
    res.json({
      success: true,
      message: "Contact updated successfully",
      data: updateContacts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateUser;
