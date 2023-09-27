import { callApi } from "@/utils/apiUtils";
import messageEndpoints from "@/utils/endpoints/message/index";

export const getUserForConversation = async ({ pathParams, query }: any) => {
  return callApi({
    uriEndPoint: {
      ...messageEndpoints.getUserForConversation,
    },
    pathParams,
    query,
  });
};
export const checkIfConversationExists = async (payload: any) => {
  return callApi({
    uriEndPoint: {
      ...messageEndpoints.checkIfConversationExists,
    },
    query: payload,
  });
};
export const createConversation = async ({ body }: any) => {
  return callApi({
    uriEndPoint: {
      ...messageEndpoints.createConversation,
    },
    body,
  });
};

export const getMessages = async (payload: any) =>
  callApi({
    uriEndPoint: {
      ...messageEndpoints.getMessages,
    },
    query: payload,
  });
export const getConversation = ({ pathParams }: any) =>
  callApi({ uriEndPoint: { ...messageEndpoints.getConversation }, pathParams });

export const getConversationList = async ({ query }: any) =>
  callApi({
    uriEndPoint: {
      ...messageEndpoints.getConversationList,
    },
    query,
  });
export const uploadAttachments = async ({ pathParams, body }: any) =>
  callApi({
    uriEndPoint: {
      ...messageEndpoints.uploadAttachments,
    },
    pathParams,
    body,
  });
export const conversationMedia = ({ pathParams }: any) =>
  callApi({
    uriEndPoint: { ...messageEndpoints.conversationMedia },
    pathParams,
  });
export const deleteConversation = ({ pathParams }: any) =>
  callApi({
    uriEndPoint: { ...messageEndpoints.deleteConversation },
    pathParams,
  });
export const archiveConversation = ({ pathParams, body }: any) =>
  callApi({
    uriEndPoint: { ...messageEndpoints.archiveConversation },
    pathParams,
    body,
  });
export const unArchiveConversation = ({ pathParams }: any) =>
  callApi({
    uriEndPoint: { ...messageEndpoints.unArchiveConversation },
    pathParams,
  });
