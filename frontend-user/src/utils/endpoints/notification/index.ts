import { EndPoint } from "@/types/index";

const notificationEndpoints: EndPoint = {
  getNotification: {
    uri: "/notifications",
    method: "GET",
    version: "/api",
  },
  changeNotification: {
    uri: "/notifications",
    method: "PUT",
    version: "/api",
  },
  getNotificationStatus: {
    uri: "/notifications/:id",
    method: "GET",
    version: "/api",
  },
  notificationMarkRead: {
    uri: "/notifications/read",
    method: "POST",
    version: "/api",
  },
  markSingleNotificaitonRead: {
    uri: "/notifications/read/:id",
    method: "POST",
    version: "/api",
  },
};
export default notificationEndpoints;
