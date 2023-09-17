import { EndPoint } from "@/types/index";
const earningEndpoints: EndPoint = {
  getEarningSummary: {
    uri: "/earning/summary",
    method: "GET",
    version: "/api",
  },
  getEarningStatics: {
    uri: "/earning/statics",
    method: "GET",
    version: "/api",
  },
};
export default earningEndpoints;
