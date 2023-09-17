const createError = require("http-errors");

// import user model
const User = require("../../models/User.model");
const convertParams = require("../../helpers/convertParams");

const getUsersList = async (req, res, next) => {
  try {
    const { query } = req;
    // const { _id: userId } = req.user.data;
    // const filters = convertParams(User, query);
    const startIndex = (query.startIndex && parseInt(query.startIndex)) || 0;
    const viewSize = (query.viewSize && parseInt(query.viewSize)) || 10;

    let searchCriteria = {};
    if (req.query.keyword) {
      // searchCriteria.name=req.query.keyword
      searchCriteria["$or"] = [
        {
          name: { $regex: `${req.query.keyword}`, $options: "i" },
        },
      ];
    }

    // const searchCriteria = { ...filters.where, ...filters.find };
    if (req.query.status === "deleted") {
      // searchCriteria.isDeleted = true;
      searchCriteria.isSuspended = true;
    } else {
      searchCriteria.isDeleted = {
        $ne: true,
      };
      searchCriteria.isSuspended = {
        $ne: true,
      };
    }
    searchCriteria.onBoarding = true;
    console.log(searchCriteria, "searchCriteria");

    const response = await User.aggregate([
      { $sort: { created_at: -1 } },
      { $match: searchCriteria },
      { $skip: startIndex },
      { $limit: viewSize },

      {
        $lookup: {
          from: "wallet",
          localField: "_id",
          foreignField: "user",
          as: "wallet",
        },
      },
      {
        $unwind: {
          path: "$wallet",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          avatar_url: 1,
          user_handle: 1,
          dob: 1,
          email: 1,
          city: 1,
          country: 1,
          gender: 1,
          wallet: 1,
          warning: 1,
          cruxLevel: 1,
          spankeeCount: 1,
        },
      },
      { $unset: ["wallet.updated_at", "wallet.__v"] },
    ]);
    if (!response)
      throw createError.InternalServerError("User details can not be fetched");

    const count = await User.countDocuments(searchCriteria);
    res.status(200).json({
      message: "success",
      data: { users: response, count: response.length, user_total: count },
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = getUsersList;
