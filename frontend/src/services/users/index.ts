import { callApi } from "@/utils/apiUtils";
import usersEndpoints from "@/utils/endpoints/users";

export const getSingleUser = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.getSingleUser,
    },
    pathParams,
  });
};
export const getUsersFollowers = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.getUsersFollowers,
    },
    pathParams,
  });
};

export const blockUser = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.blockUser,
    },
    pathParams,
  });
};

export const unblockUser = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.unblockUser,
    },
    pathParams,
  });
};
export const followUser = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.followUser,
    },
    pathParams,
  });
};

export const getBlockedUserList = async () => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.getBlockedUserList,
    },
  });
};
export const unfollowUser = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.unfollowUser,
    },
    pathParams,
  });
};
export const getFollowingList = async ({ pathParams, query }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.getFollowingList,
    },
    pathParams,
    query,
  });
};
export const removeFollower = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.removeFollower,
    },
    pathParams,
  });
};
export const paymentMethod = async ({ pathParams, body }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.paymentMethod,
    },
    pathParams,
    body,
  });
};
export const getPaymentDetails = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.getPaymentDetails,
    },
    pathParams,
  });
};
export const updatePaymentDetails = async ({ pathParams, body }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.updatePaymentDetails,
    },
    pathParams,
    body,
  });
};
export const getSuggestedFollowersList = async ({ query }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.getSuggestedFollowersList,
    },
    query,
  });
};
export const getSingleUserWarning = async ({ query }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.getSingleUserWarning,
    },
    query,
  });
};
export const getSingleUserSpankee = async ({ query }: any) => {
  return callApi({
    uriEndPoint: {
      ...usersEndpoints.getSingleUserSpankee,
    },
    query,
  });
};
