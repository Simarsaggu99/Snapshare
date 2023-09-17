const createError = require("http-errors");
const dayjs = require("dayjs");
const Bounty = require("../models/Bounty.model");
const { ObjectId } = require("mongoose").Types;

const startBounty = async () => {
  try {
    let bounty = await Bounty.find({
      bountyType: "pending",
    });

    if (!bounty) {
      throw createError(404, "No tasks found");
    }

    await Promise.all(
      bounty?.map(async (item) => {
        if (
          new Date() >= new Date(item.startDate) &&
          item?.bountyType === "pending"
        ) {
          item.bountyType = "live";
          await item.save();
        }
        return item;
      })
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = startBounty;
