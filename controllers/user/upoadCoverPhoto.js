const createError = require("http-errors");
const formidable = require("formidable");
const jwt = require("jsonwebtoken");
const { accessSecret } = require("../../config/keys").jwt;
const crypto = require("crypto");

// import verify token model and user model
const uploadFiles = require("../../services/upload-files");
const UserModel = require("../../models/User.model");

const uploadAvatar = async (req, res, next) => {
  try {
    // const { _id: userId } = req.user.data;
    let bearerToken, token, userId;

    if (req.query.Authorization) {
      let algorithm = "aes256"; // or any other algorithm supported by OpenSSL
      let key = "ExchangePasswordPasswordExchange"; // or any key from .env
      let encrypted = req.query.Authorization;
      let iv = "75ee244a7c9857f8";

      //let decryptedUserId
      let decipher = crypto.createDecipheriv(algorithm, key, iv);
      userId =
        decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
    } else {
      bearerToken = req.headers["authorization"];
      token =
        bearerToken.split(" ")[0] === "Bearer"
          ? bearerToken.split(" ")[1]
          : bearerToken;
      payload = jwt.verify(token, accessSecret);
      userId = payload.data._id;
    }
    console.log(userId, "cover image user id ");
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      console.log(files);
      if (err) {
        res.status(400);
        res.send(err);
      }

      try {
        const { description } = fields;

        // upload files to s3
        const filesArray = Object.values(files);

        const allFileUploadedArray = await Promise.all(
          filesArray?.map(async (item) => {
            let location = item.path;
            const originalFileName = item.name;
            const fileType = item.type;
            // uploads file.
            const data = await uploadFiles.upload(
              location,
              originalFileName,
              `users/${userId}/posts`,
              null
            );
            return {
              url: data.Location,
              type: fileType,
            };
          })
        );

        const uploadCoverPhoto = await UserModel.findOneAndUpdate(
          { _id: userId },
          { cover_url: allFileUploadedArray[0].url },
          { new: true }
        );

        res.status(200).json({
          success: true,
          data: uploadCoverPhoto,
        });
      } catch (error) {
        console.error("error in create post: ", error);
      }
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = uploadAvatar;
