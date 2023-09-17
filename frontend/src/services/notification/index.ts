import { callApi } from "@/utils/apiUtils";
import notificationEndpoints from "@/utils/endpoints/notification";

export const getNotification = async ({ query }: any) => {
  return callApi({
    uriEndPoint: {
      ...notificationEndpoints.getNotification,
    },
    query,
  });
};
export const changeNotification = async ({ body }: any) => {
  return callApi({
    uriEndPoint: {
      ...notificationEndpoints.changeNotification,
    },
    body,
  });
};
export const getNotificationStatus = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...notificationEndpoints.getNotificationStatus,
    },
    pathParams,
  });
};
export const notificationMarkRead = async () => {
  return callApi({
    uriEndPoint: {
      ...notificationEndpoints.notificationMarkRead,
    },
  });
};
export const markSingleNotificaitonRead = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...notificationEndpoints.markSingleNotificaitonRead,
    },
    pathParams,
  });
};
