import { EndPoint } from "@/types/index";
const bountyEndpoints: EndPoint = {
  getBounty: {
    uri: "/bounty/user/bounty",
    method: "GET",
    version: "/api",
  },
  performBounty: {
    uri: "/bounty/perform/user",
    method: "POST",
    version: "/api",
  },
  checkBountyPerform: {
    uri: "/bounty/user/bounty/:id",
    method: "GET",
    version: "/api",
  },
  bountyHistory: {
    uri: "/bounty/user/history",
    method: "GET",
    version: "/api",
  },
  contestWinnerList: {
    uri: "/bounty/contest/winner",
    method: "GET",
    version: "/api",
  },
};
export default bountyEndpoints;
