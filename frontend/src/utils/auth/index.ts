import { EndPoint } from "../../types/index";

const authEndpoints: EndPoint = {
  accessLogin: {
    uri: "/auth/login",
    method: "POST",
    version: "/api",
  },
  accessLogout: {
    uri: "/auth/logout",
    method: "POST",
    version: "/api",
  },
};

export default authEndpoints;
