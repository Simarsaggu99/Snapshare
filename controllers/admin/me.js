const adminInfo = async (req, res, next) => {
  try {
    const info = req.user.data;

    res.status(200).json({
      message: "success",
      info,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = adminInfo;
