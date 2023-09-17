import { callApi } from "@/utils/apiUtils";
import commonEndpoints from "@/utils/endpoints/common";

export const globalSearch = async ({ query }: any) => {
  return callApi({
    uriEndPoint: {
      ...commonEndpoints.globalSearch,
    },
    query,
  });
};
export const userCrux = async () => {
  return callApi({
    uriEndPoint: {
      ...commonEndpoints.userCrux,
    },
  });
};
