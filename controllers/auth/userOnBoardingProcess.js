const User = require("../../models/User.model");
const createError = require("http-errors");
const folderModel = require("../../models/folder.model");
const crypto = require("crypto");
const Wallet = require("../../models/Wallet.model");
const UserAccountPreferenceSchema = require("../../models/NotificationSetting.model");
var ObjectId = require("mongodb").ObjectID;
const { accessTokenLife, refreshTokenLife } = require("../../config/keys").jwt;
const { baseUrl } = require("../../config/keys");

const {
  // generateCryptoKey,
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/generate_token");
const { sendEmail } = require("../../services/sendEmail");
const loginTemplate = require("../../services/templates/regristration");
const cruxLevel = require("../../services/notifications/post/cruxLevelNotification");
const syncCrux = require("../../services/crux/syncCrux");

const updateOnBoarding = async (req, res, next) => {
  try {
    let algorithm = "aes256"; // or any other algorithm supported by OpenSSL
    let key = "ExchangePasswordPasswordExchange"; // or any key from .env
    let encrypted = req.query.Authorization;
    let iv = "75ee244a7c9857f8";

    //let decryptedUserId
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decryptedUserId =
      decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");

    const { dob, bio, gender, country, city, user_handle } = req.body;

    var date1 = dob ? new Date(dob) : ""; //!"3 march 2015"

    const onBoarding = await User.findOneAndUpdate(
      {
        _id: ObjectId(decryptedUserId),
      },
      {
        user_handle: user_handle,
        onBoarding: true,
        dob: date1,
        bio: bio,
        gender: gender,
        country: country,
        city: city,
      },
      { new: true }
    );

    const walletCreation = await Wallet.create({
      user: ObjectId(decryptedUserId),
    });
    if (onBoarding.cruxLevel < 1) {
      //syncing the crux and the associated earnings
      await syncCrux(decryptedUserId, req.io);
    }

    //! generation of token and saving in cookies
    const payload = {
      data: {
        _id: decryptedUserId.toString(),
      },
    };

    //Generate new access and refresh tokens
    const accessToken = generateAccessToken(payload, accessTokenLife);
    const refreshToken = generateRefreshToken(payload, refreshTokenLife);

    //Default Notification
    const createNotificationSetting = await UserAccountPreferenceSchema.create({
      userId: ObjectId(decryptedUserId),
    });
    const createFolder = new folderModel({
      folder_name: "default folder",
      user: decryptedUserId.toString(),
    });
    await createFolder.save();
    res.json({ message: "success", data: onBoarding, auth: accessToken });
    // res.redirect(`${baseUrl.base_client_url}/auth-verify?token=${accessToken}`);
  } catch (error) {
    next(error);
  }
};

module.exports = updateOnBoarding;
