import { callApi } from "@/utils/apiUtils";
import walletEndpoints from "@/utils/endpoints/wallet";

export const getWallet = async () => {
  return callApi({
    uriEndPoint: {
      ...walletEndpoints.getWallet,
    },
  });
};
export const redeemRequest = async ({ body }: any) => {
  return callApi({
    uriEndPoint: {
      ...walletEndpoints.redeemRequest,
    },
    body,
  });
};
export const getUserTransaction = async ({ query }: any) => {
  return callApi({
    uriEndPoint: {
      ...walletEndpoints.getUserTransaction,
    },
    query,
  });
};
