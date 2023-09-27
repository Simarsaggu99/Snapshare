import { EndPoint } from "@/types/index";

const walletEndpoints: EndPoint = {
  getWallet: {
    uri: "/wallet",
    method: "GET",
    version: "/api",
  },
  redeemRequest: {
    uri: "/wallet/redeemRequest",
    method: "POST",
    version: "/api",
  },
  getUserTransaction: {
    uri: "/transaction",
    method: "GET",
    version: "/api",
  },
};
export default walletEndpoints;
