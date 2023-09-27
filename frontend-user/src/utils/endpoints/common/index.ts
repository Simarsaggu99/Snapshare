import { EndPoint } from "@/types/index";

const CommonEndpoints: EndPoint = {
  getTopDevelopers: {
    uri: "/user/getTopDevelopers",
    method: "GET",
    version: "/api",
  },
  globalSearch: {
    uri: "/post/search/filterUser",
    method: "GET",
    version: "/api",
  },
  userCrux: {
    uri: "/crux",
    method: "GET",
    version: "/api",
  },
};

export default CommonEndpoints;
