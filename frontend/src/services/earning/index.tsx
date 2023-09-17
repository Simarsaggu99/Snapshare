import { callApi } from "@/utils/apiUtils";
import earningEndpoints from "@/utils/endpoints/earning";

export const getEarningSummary = async ({ query }: any) => {
  return callApi({
    uriEndPoint: {
      ...earningEndpoints.getEarningSummary,
    },
    query,
  });
};
export const getEarningStatics = async ({ query }: any) => {
  return callApi({
    uriEndPoint: {
      ...earningEndpoints.getEarningStatics,
    },
    query,
  });
};
