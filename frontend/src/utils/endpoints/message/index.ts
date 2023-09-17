import { EndPoint } from "@/types/index";

const messagesEndpoints: EndPoint = {
  getUserForConversation: {
    uri: "/user",
    method: "GET",
    version: "/api",
  },
  checkIfConversationExists: {
    uri: "/message/conversationExists",
    method: "GET",
    version: "/api",
  },
  createConversation: {
    uri: "/message/conversation",
    method: "POST",
    version: "/api",
  },
  getMessages: {
    uri: "/message",
    method: "GET",
    version: "/api",
  },
  getConversation: {
    uri: "/message/conversation/:id",
    method: "GET",
    version: "/api",
  },
  getConversationList: {
    uri: "/message/conversation",
    method: "GET",
    version: "/api",
  },
  uploadAttachments: {
    uri: "/message/conversation/:id/media",
    method: "POST",
    version: "/api",
  },
  conversationMedia: {
    uri: "/message/conversation/:conversationId/media",
    method: "GET",
    version: "/api",
  },
  deleteConversation: {
    uri: "/message/conversation/:conversationId",
    method: "DELETE",
    version: "/api",
  },
  archiveConversation: {
    uri: "/message/conversation/archive",
    method: "POST",
    version: "/api",
  },
  unArchiveConversation: {
    uri: "/message/conversation/:conversationId/unArchive",
    method: "DELETE",
    version: "/api",
  },
};
export default messagesEndpoints;
