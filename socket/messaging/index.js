// const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");

const markNotificationReadService = require("../../services/notifications/markNotificationRead");
const addNotification = require("../../services/notifications/addNotification");
const saveMessage = require("../../services/messages/saveMessage");
const unsendMessage = require("../../services/messages/unsendMessage");
const markMessageReadService = require("../../services/messages/markMessageRead");
const markConversationReadService = require("../../services/messages/markConversationRead");
const newMessageNotification = require("../../services/notifications/message/getMessageNotification");
const User = require("../../models/User.model");
const { post } = require("../../routes");
const Post = require("../../models/Post.model");
const PostView = require("../../models/Post-view.model");
const dayjs = require("dayjs");
const NotificationSettings = require("../../models/NotificationSetting.model");
const { ObjectId } = require("mongoose").Types;

module.exports = (io) => {
  io.on("connect", (socket) => {
    console.log("socket is connected");
    socket.on("join-conversation", async (data, callback) => {
      const { userId, conversationId } = data;
      socket.join(conversationId);

      // Also mark the conversation read by this user
      const { messages, conversation } = await markConversationReadService({
        userId,
        conversationId,
      });

      if (conversation?._id && messages?.length > 0) {
        io.to(conversationId.toString()).emit("mark-conversation-read", {
          userId,
          messages,
          conversationId,
        });
      }
      if (callback) callback();
    });

    socket.on("leave-conversation", (data, callback) => {
      const { userId, conversationId } = data;
      console.log(userId, "left the conversation");
      socket.leave(conversationId);

      if (callback) callback();
    });

    socket.on("join", async (userId, callback) => {
      socket.join(userId);
      if (userId) {
        await User.findOneAndUpdate(
          {
            _id: ObjectId(userId),
          },
          {
            socketId: socket.id.toString(),
          },
          {
            new: true,
          }
        );
      }
      if (callback) callback();
    });

    socket.on("start-type", (message, callback) => {
      socket
        .to(message.conversationId.toString())
        .emit("start-type", message.name);
      if (callback) callback();
    });

    socket.on("send-message", async (messageData, callback) => {
      const {
        conversationId,
        message,
        type,
        sender,
        reference_id,
        postMessage,
        receiver,
      } = messageData;
      let referenceId = uuidv4();
      if (reference_id) referenceId = reference_id;

      const { message: savedMessage, conversation } = await saveMessage({
        conversationId,
        type,
        message,
        sender,
        referenceId: referenceId,
        read_by: [
          {
            user: sender,
          },
        ],
        postMessage,
      });

      io.to(conversationId.toString()).emit("message", {
        type,
        message,
        sender: {
          _id: sender,
        },
        reference_id: referenceId,
      });
      const receiverId = receiver?.filter((fil) => fil !== sender);
      const notification = await NotificationSettings.findOne({
        userId: receiverId,
      });
      if (notification?.notifications?.message) {
        newMessageNotification(sender, receiverId, io);
      }

      conversation?.members?.forEach((id) => {
        io.to(id.toString()).emit("new-conversation-message", {
          conversation: {
            type: conversation.type,
            id: conversationId,
            group_name: conversation.group_name,
            group_description: conversation.group_description,
          },
          message: {
            type: savedMessage.type,
            message: savedMessage.message,
          },
        });
      });
      if (callback) callback(savedMessage);
    });

    socket.on("unsend-message", async (data, callback) => {
      const { userId, messageId, conversationId, referenceId } = data || {};
      if ((userId, messageId, conversationId)) {
        // TODO: handle edge cases
        await unsendMessage({
          userId,
          messageId,
          conversationId,
        });

        io.to(conversationId.toString()).emit("unsend-message", {
          messageId,
          conversationId,
          messageUnSendingUser: userId,
          referenceId,
        });
        if (callback) callback();
      }
    });

    socket.on("read-message", async (data) => {
      const { userId, conversationId, messageId, referenceId } = data;
      try {
        const res = await markMessageReadService(
          userId,
          messageId,
          conversationId,
          referenceId
        );
        const { message } = res || {};

        if (message) {
          console.log("mark message read");
          socket.to(conversationId.toString()).emit("mark-message-read", {
            message,
            conversationId,
          });
        }
      } catch (error) {
        console.log("inside error catch block!, ", error);
      }
    });

    socket.on("read-conversation", async (userId, conversationId) => {
      // TODO: handle edge cases
      const { messages, conversation } = await markConversationReadService({
        userId,
        conversationId,
      });

      if (conversation?._id) {
        io.to(conversationId.toString()).emit("mark-conversation-read", {
          userId,
          messages,
          conversationId,
        });
      }
    });

    socket.on("add-post-notification", async (data, callback) => {
      // TODO: handle edge cases
      const notification = await addNotification(data);

      if (notification) {
        socket.to(notification.receiver.toString());
      }

      if (callback) callback();
    });

    socket.on("read-notification", async (data) => {
      const { notificationId, userId } = data;
      markNotificationReadService(userId, notificationId);
    });
    socket.on("heartbeat", async (data) => {
      if (data.userId) {
        await User.findOneAndUpdate(
          {
            socketId: socket.id,
          },
          {
            status: "online",
          },
          {
            new: true,
          }
        );
      }
    });
    // socket.on("post-reach", async (data) => {
    //   const { userId } = data;

    //   const postData = await Post.find({ _id: { $in: userId } });
    //   if (postData) {
    //     postData?.map(async (item) => {
    //       const postView = await PostView.countDocuments({
    //         post_id: ObjectId(item?._id),
    //       });
    //       const date1 = dayjs(item?.created_at);
    //       const date2 = dayjs();

    //       let hours = date2.diff(date1, "hours");

    //       let popularity = 0;
    //       if (postView && item?.postReach && item?.like_count) {
    //         const viewsPerReach = postView / item?.postReach;

    //         // Calculate the Likes/Hours ratio
    //         const likesPerHours = item?.like_count / hours;

    //         // Calculate the Popularity score by adding the two ratios
    //         popularity = viewsPerReach + likesPerHours;
    //       }
    //       await Post.findOneAndUpdate(
    //         {
    //           _id: ObjectId(item?._id),
    //         },
    //         {
    //           postReach: item?.postReach + 1,
    //           postPopularity: item?.postPopularity + popularity,
    //         },
    //         {
    //           new: true,
    //         }
    //       );
    //     });
    //   }
    // });

    socket.on("disconnect", async () => {
      await User.findOneAndUpdate(
        {
          socketId: socket.id,
        },
        {
          status: "offline",
        },
        {
          new: true,
        }
      );
      console.log("socket is disconnected");
    });
  });
};
