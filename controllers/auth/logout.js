const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");

const { refreshSecret, accessSecret } = require("../../config/keys").jwt;
const Blacklist = require("../../models/TokenBlackList");

const logoutUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    if (req.cookies) {
      const { accessToken } = req.cookies;

      if (accessToken) {
        const token =
          accessToken?.split(" ")[0] === "Bearer"
            ? accessToken.split(" ")[1]
            : accessToken;

        const blackListToken = new Blacklist({
          token: token,
          userId: userId,
        });

        await blackListToken.save();
        // const newAccess = accessToken.split("Bearer ");
        // const { data } = jwt.verify(token, accessSecret);
        // Token.findOneAndDelete({
        //   _userId: data._id,
        //   token: auth,
        // });
        // res.cookie("accessToken", "deleted", {
        //   expires: new Date(Date.now()),
        //   httpOnly: true,'

        // });
        // res.clearCookie("accessToken");
        // res.cookie("accessToken", "", { expires: new Date(0) });
        return res.status(200).json({
          success: true,
          message: "User logged out successfully",
        });
      }
    }
    res.status(500).json({
      message: "no cookies to remove",
    });
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
};

module.exports = logoutUser;
