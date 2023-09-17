const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const { baseUrl } = require("../../config/keys");

// import models and helpers
const Token = require("../../models/Token.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/generate_token");
const Admin = require("../../models/Admin");

const { accessTokenLife, refreshTokenLife } = require("../../config/keys").jwt;

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userLogin = await Admin.findOne({ email: email });

    if (!userLogin) {
      throw createError(403, "Account not found!");
    }

    const isMatch = await bcrypt.compare(password, userLogin.password);
    if (!isMatch) {
      throw createError.Unauthorized("Incorrect password. Please try again.");
    }

    const payload = {
      data: {
        name: userLogin.name,
        _id: userLogin._id,
        role: userLogin.role,
        email: userLogin.email,
      },
    };

    const accessToken = generateAccessToken(payload, accessTokenLife);
    const refreshToken = generateRefreshToken(payload, refreshTokenLife);
    res.cookie("accessToken", `Bearer ${accessToken}`, {
      secure: true,
      sameSite: "none",
    });
    if (accessToken && refreshToken) {
      const token = new Token({
        _userId: userLogin._id,
        token: refreshToken,
      });
      await token.save();
      // res.redirect(`${baseUrl.base_admin_url}/`);

      res.status(200).json({
        success: true,
        accessToken,
        user: payload.data,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = adminLogin;
