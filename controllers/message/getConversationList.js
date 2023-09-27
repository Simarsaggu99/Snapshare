// const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

const ArchiveConversation = require("../../models/ArchiveConversation");
const Conversation = require("../../models/Conversation.model");
const UserFollow = require("../../models/UserFollow.model");

const getConversationList = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  let searchCriteria = {};
  searchCriteria["current_follow.isPrimary"] = true;

  const archive = await ArchiveConversation.find({
    from: ObjectId(userId),
  });

  const archiveIds = archive?.map((item) => {
    return item?.conversationId;
  });

  const countDocQuery = {
    $expr: {
      $and: [
        { $in: [ObjectId(userId), "$members"] },
        { $not: { $in: [ObjectId(userId), "$hidden_by"] } },
      ],
    },
  };

  try {
    let conversationList;

    switch (req.query.type) {
      case "Primary":
        conversationList = await Conversation.aggregate([
          {
            $match: {
              _id: {
                $nin: archiveIds,
              },
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  { $in: [ObjectId(userId), "$members"] },
                  { $not: { $in: [ObjectId(userId), "$hidden_by"] } },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "message",
              let: { conversation_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$conversation", "$$conversation_id"] },
                        {
                          $not: {
                            $in: [ObjectId(userId), "$deleted_by"],
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  $match: {
                    read_by: {
                      $not: { $elemMatch: { user: ObjectId(userId) } },
                    },
                  },
                },
                {
                  $count: "total_count",
                },
              ],
              as: "unread_count",
            },
          },
          {
            $unwind: {
              path: "$unread_count",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "user",
              // localField: "members",
              // foreignField: "_id",
              let: { id: "$members" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $in: ["$_id", "$$id"] },
                        { $ne: ["$_id", ObjectId(userId)] },
                        // { $eq: ["$to", "$$user_followed"] },
                      ],
                    },
                  },
                },
              ],
              as: "type",
            },
          },
          {
            $unwind: {
              path: "$type",
            },
          },
          {
            $lookup: {
              from: "userfollows",
              let: { user_follow: "$type._id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$from", ObjectId(userId)] }],
                    },
                  },
                },
                {
                  $addFields: {
                    isPrimary: {
                      $cond: [
                        { $eq: ["$from", ObjectId(userId)] },
                        { $eq: ["$to", "$$user_follow"] },
                        true,
                      ],
                    },
                  },
                },
              ],
              as: "current_follow",
            },
          },
          {
            $unwind: {
              path: "$current_follow",
            },
          },
          {
            $match: searchCriteria,
          },
          {
            $lookup: {
              from: "user",
              localField: "members",
              foreignField: "_id",
              as: "members",
            },
          },

          {
            $lookup: {
              from: "message",
              localField: "last_message",
              foreignField: "_id",
              as: "last_message",
            },
          },
          {
            $unwind: {
              path: "$last_message",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              type: 1,
              created_at: 1,
              updated_at: 1,
              last_message: 1,
              unread_count: "$unread_count.total_count",
              // unread_count: 1,
              // recentMessages: 1,
              // owner: 1,
              members: {
                _id: 1,
                name: 1,
                avatar_url: 1,
                status: 1,
                user_handle: 1,
              },
            },
          },
          { $sort: { updated_at: -1 } },
        ]);
        break;
      case "Unknown":
        const primary = await Conversation.aggregate([
          {
            $match: {
              _id: {
                $nin: archiveIds,
              },
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  { $in: [ObjectId(userId), "$members"] },
                  { $not: { $in: [ObjectId(userId), "$hidden_by"] } },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "message",
              let: { conversation_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$conversation", "$$conversation_id"] },
                        {
                          $not: {
                            $in: [ObjectId(userId), "$deleted_by"],
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  $match: {
                    read_by: {
                      $not: { $elemMatch: { user: ObjectId(userId) } },
                    },
                  },
                },
                {
                  $count: "total_count",
                },
              ],
              as: "unread_count",
            },
          },
          {
            $unwind: {
              path: "$unread_count",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "user",
              // localField: "members",
              // foreignField: "_id",
              let: { id: "$members" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $in: ["$_id", "$$id"] },
                        { $ne: ["$_id", ObjectId(userId)] },
                        // { $eq: ["$to", "$$user_followed"] },
                      ],
                    },
                  },
                },
              ],
              as: "type",
            },
          },
          {
            $unwind: {
              path: "$type",
            },
          },
          {
            $lookup: {
              from: "userfollows",
              let: { user_follow: "$type._id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$from", ObjectId(userId)] }],
                    },
                  },
                },
                {
                  $addFields: {
                    isPrimary: {
                      $cond: [
                        { $eq: ["$from", ObjectId(userId)] },
                        { $eq: ["$to", "$$user_follow"] },
                        true,
                      ],
                    },
                  },
                },
              ],
              as: "current_follow",
            },
          },
          {
            $unwind: {
              path: "$current_follow",
            },
          },
          {
            $match: searchCriteria,
          },
          {
            $lookup: {
              from: "user",
              localField: "members",
              foreignField: "_id",
              as: "members",
            },
          },

          {
            $lookup: {
              from: "message",
              localField: "last_message",
              foreignField: "_id",
              as: "last_message",
            },
          },
          {
            $unwind: {
              path: "$last_message",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              type: 1,
              created_at: 1,
              updated_at: 1,
              last_message: 1,
              unread_count: "$unread_count.total_count",
              // unread_count: 1,
              // recentMessages: 1,
              // owner: 1,
              members: {
                _id: 1,
                name: 1,
                avatar_url: 1,
              },
            },
          },
          { $sort: { updated_at: -1 } },
        ]);
        const primaryIds = primary?.map((item) => {
          return item?._id;
        });
        conversationList = await Conversation.aggregate([
          {
            $match: {
              _id: {
                $nin: [...archiveIds, ...primaryIds],
              },
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  { $in: [ObjectId(userId), "$members"] },
                  { $not: { $in: [ObjectId(userId), "$hidden_by"] } },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "message",
              let: { conversation_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$conversation", "$$conversation_id"] },
                        { $not: { $in: [ObjectId(userId), "$deleted_by"] } },
                      ],
                    },
                  },
                },
                {
                  $match: {
                    read_by: {
                      $not: { $elemMatch: { user: ObjectId(userId) } },
                    },
                  },
                },
                {
                  $count: "total_count",
                },
              ],
              as: "unread_count",
            },
          },
          {
            $unwind: {
              path: "$unread_count",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "user",
              // localField: "members",
              // foreignField: "_id",
              let: { id: "$members" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $in: ["$_id", "$$id"] },
                        { $ne: ["$_id", ObjectId(userId)] },
                        // { $eq: ["$to", "$$user_followed"] },
                      ],
                    },
                  },
                },
              ],
              as: "type",
            },
          },
          {
            $unwind: {
              path: "$type",
            },
          },
          {
            $lookup: {
              from: "user",
              localField: "members",
              foreignField: "_id",
              as: "members",
            },
          },

          {
            $lookup: {
              from: "message",
              localField: "last_message",
              foreignField: "_id",
              as: "last_message",
            },
          },
          {
            $unwind: {
              path: "$last_message",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              created_at: 1,
              updated_at: 1,
              last_message: 1,
              archive: {
                isArchived: 1,
              },
              unread_count: "$unread_count.total_count",
              // unread_count: 1,
              // recentMessages: 1,
              // owner: 1,
              members: {
                _id: 1,
                name: 1,
                avatar_url: 1,
                status: 1,
                user_handle: 1,
              },
            },
          },
          { $sort: { updated_at: -1 } },
        ]);
        break;
      case "Archived":
        conversationList = await Conversation.aggregate([
          {
            $match: {
              _id: {
                $in: archiveIds,
              },
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  { $in: [ObjectId(userId), "$members"] },
                  { $not: { $in: [ObjectId(userId), "$hidden_by"] } },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "message",
              let: { conversation_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$conversation", "$$conversation_id"] },
                        { $not: { $in: [ObjectId(userId), "$deleted_by"] } },
                      ],
                    },
                  },
                },
                {
                  $match: {
                    read_by: {
                      $not: { $elemMatch: { user: ObjectId(userId) } },
                    },
                  },
                },
                {
                  $count: "total_count",
                },
              ],
              as: "unread_count",
            },
          },
          {
            $unwind: {
              path: "$unread_count",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: "user",
              localField: "members",
              foreignField: "_id",
              as: "members",
            },
          },

          {
            $lookup: {
              from: "message",
              localField: "last_message",
              foreignField: "_id",
              as: "last_message",
            },
          },
          {
            $unwind: {
              path: "$last_message",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              created_at: 1,
              updated_at: 1,
              last_message: 1,
              unread_count: "$unread_count.total_count",
              // unread_count: 1,
              // recentMessages: 1,
              // owner: 1,
              members: {
                _id: 1,
                name: 1,
                avatar_url: 1,
                status: 1,
                user_handle: 1,
              },
            },
          },
          { $sort: { updated_at: -1 } },
        ]);
        break;
      case "All":
        conversationList = await Conversation.aggregate([
          {
            $match: {
              _id: {
                $nin: archiveIds,
              },
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  { $in: [ObjectId(userId), "$members"] },
                  { $not: { $in: [ObjectId(userId), "$hidden_by"] } },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "message",
              let: { conversation_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$conversation", "$$conversation_id"] },
                        { $not: { $in: [ObjectId(userId), "$deleted_by"] } },
                      ],
                    },
                  },
                },
                {
                  $match: {
                    read_by: {
                      $not: { $elemMatch: { user: ObjectId(userId) } },
                    },
                  },
                },
                {
                  $count: "total_count",
                },
              ],
              as: "unread_count",
            },
          },
          {
            $unwind: {
              path: "$unread_count",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "user",
              // localField: "members",
              // foreignField: "_id",
              let: { id: "$members" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $in: ["$_id", "$$id"] },
                        { $ne: ["$_id", ObjectId(userId)] },
                        // { $eq: ["$to", "$$user_followed"] },
                      ],
                    },
                  },
                },
              ],
              as: "type",
            },
          },
          {
            $unwind: {
              path: "$type",
            },
          },
          {
            $lookup: {
              from: "user",
              localField: "members",
              foreignField: "_id",
              as: "members",
            },
          },

          {
            $lookup: {
              from: "message",
              localField: "last_message",
              foreignField: "_id",
              as: "last_message",
            },
          },
          {
            $unwind: {
              path: "$last_message",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              created_at: 1,
              updated_at: 1,
              last_message: 1,
              unread_count: "$unread_count.total_count",
              // unread_count: 1,
              // recentMessages: 1,
              // owner: 1,
              members: {
                _id: 1,
                name: 1,
                avatar_url: 1,
                status: 1,
                user_handle: 1,
              },
            },
          },
          { $sort: { updated_at: -1 } },
        ]);
        break;
    }
    const count = await Conversation.countDocuments(countDocQuery);

    res.status(200).json({
      message: "success",
      data: { conversationList, total_count: count },
    });
  } catch (error) {
    console.log("get conversation list error: ", error);
    next(error);
  }
};

module.exports = getConversationList;
