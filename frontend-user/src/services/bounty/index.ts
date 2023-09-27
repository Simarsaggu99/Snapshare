import { callApi } from "@/utils/apiUtils";
import bountyEndpoints from "@/utils/endpoints/bounty";

export const getBounty = async () => {
  return callApi({
    uriEndPoint: {
      ...bountyEndpoints.getBounty,
    },
  });
};
export const performBounty = async ({ body }: any) => {
  return callApi({
    uriEndPoint: {
      ...bountyEndpoints.performBounty,
    },
    body,
  });
};
export const checkBountyPerform = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...bountyEndpoints.checkBountyPerform,
    },
    pathParams,
  });
};

export const bountyHistory = async () => {
  return callApi({
    uriEndPoint: {
      ...bountyEndpoints.bountyHistory,
    },
  });
};
export const contestWinnerList = async () => {
  return callApi({
    uriEndPoint: {
      ...bountyEndpoints.contestWinnerList,
    },
  });
};
