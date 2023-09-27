const CruxThreshold = require("../../models/CruxThreshold.model");

const getCruxLevels = async (req, res, next) => {
  try {
    const cruxLevels = await CruxThreshold.find(
      {},
      {
        _id: 0,
        label: 1,
        description: 1,
        level: 1,
      }
    ).sort({ level: 1 });

    res.json({
      success: true,
      message: "Crux levels fetched successfully",
      crux: cruxLevels,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getCruxLevels;
