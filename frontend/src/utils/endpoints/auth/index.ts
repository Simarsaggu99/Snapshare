import Cookies from "universal-cookie";

import { EndPoint } from "@/types/index";

const cookies = new Cookies();
const authEndpoints: EndPoint = {
  accessLogin: {
    uri: "/auth/login",
    method: "POST",
    version: "/api",
  },
  register: {
    uri: "/contact/create",
    method: "POST",
    version: "/api",
  },
  loginWithGoogle: {
    uri: "/auth/google",
    method: "GET",
    version: "/api",
  },
  userOnBoarding: {
    uri: "/auth/onBoarding",
    method: "PUT",
    version: "/api",
  },
};

export default authEndpoints;
