const createError = require("http-errors");
const crypto = require("crypto");
const User = require("../../models/User.model");
const assert = require("assert");
var ObjectId = require("mongodb").ObjectID;

const { app, google, baseUrl } = require("../../config/keys");

const { accessTokenLife, refreshTokenLife } = require("../../config/keys").jwt;
const {
  // generateCryptoKey,
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/generate_token");

const { clientURL } = require("../../config/keys").app;

// import models
const VerifyToken = require("../../models/VerifyToken.model");
// const Token = require("../../models/Token.model");

const oAuthLogin = async (req, res, next) => {
  try {
    //! generation of token and saving in cookies
    // const payload = {
    //   data: {
    //     _id: req.user.id.toString()
    //   }
    // };

    // //Generate new access and refresh tokens
    // const accessToken = generateAccessToken(payload, accessTokenLife);
    // const refreshToken = generateRefreshToken(payload, refreshTokenLife);

    // if (accessToken && refreshToken) {

    //   res.cookie("accessToken", `Bearer ${accessToken}`, { httpOnly: true });

    //! Encryption of userId and sending it through through query params
    let algorithm = "aes256"; // or any other algorithm supported by OpenSSL
    let key = "ExchangePasswordPasswordExchange"; // or any key from .env
    let text = req.user.id.toString();
    let iv = "75ee244a7c9857f8";

    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");

    console.log(encrypted, text);

    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted =
      decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");

    // const userExist = await User.findOne({
    //   _id: ObjectId(text),
    // });

    // if (userExist?.isDeleted && userExist?.isSuspended) {
    //   if (userExist.isDeleted === true) {
    //     // throw createError.BadRequest("user does not exist");
    //     res.status(500).json({
    //       status: "user does not exist",
    //     });
    //   }
    //   if (userExist.isSuspended === true) {
    //     // throw createError.BadRequest("user is suspended!");
    //     res.status(500).json({
    //       status: "user is suspended",
    //     });
    //   }
    // }
    const checkOnBoarding = await User.findOne({
      _id: text,
      onBoarding: false,
    });
    const check = await User.findOne({
      _id: text,
    });

    if (!!checkOnBoarding == true) {
      //!redirecting to onBoarding page
      res.redirect(
        `${baseUrl.base_client_url}/user/registration?token=${encrypted}`
      );
      // res.send({
      //   url: "ok",
      // });
    } else {
      //! generation of token and saving in cookies
      const payload = {
        data: {
          _id: req.user.id.toString(),
        },
      };
      //Generate new access and refresh tokens
      const accessToken = generateAccessToken(payload, accessTokenLife);
      const refreshToken = generateRefreshToken(payload, refreshTokenLife);
      // if (accessToken && refreshToken) {
      //   res.cookie("accessToken", `Bearer ${accessToken}`, {
      //     secure: true,
      //     sameSite: "none",
      //   });
      // }

      // !redirecting to auth verify page
      res.redirect(
        `${baseUrl.base_client_url}/auth-verify?token=${accessToken}`
      );
    }
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};

module.exports = oAuthLogin;
