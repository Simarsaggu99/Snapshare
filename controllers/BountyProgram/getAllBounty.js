const Bounty = require("../../models/Bounty.model");

const getAllBounty = async (req, res, next) => {
  const searchCriteria = {};
  if (req.query.type) {
    type = req.query.type;
    if (type === "Survey") {
      searchCriteria.type = "Survey";
    }
    if (type === "Question") {
      searchCriteria.type = "Question";
    }
    if (type === "Meme_contest") {
      searchCriteria.type = "Meme_contest";
    }
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const viewSize = parseInt(req.query.viewSize) || 10;
    const { bounty } = req.query;
    if (type === "upcoming") {
      searchCriteria.bountyType = "pending";
    } else {
      if (bounty === "live" || bounty === "expire") {
        searchCriteria.bountyType = bounty;
      }
    }
    const getBounty = await Bounty.aggregate([
      {
        $match: { ...searchCriteria },
      },
      {
        $sort: {
          created_at: -1,
        },
      },
      { $skip: startIndex },
      { $limit: viewSize },
    ]);

    const totalCount = await Bounty.countDocuments(searchCriteria);

    res.status(200).json({
      success: true,
      data: getBounty,
      totalCount,
      count: getBounty?.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllBounty;
