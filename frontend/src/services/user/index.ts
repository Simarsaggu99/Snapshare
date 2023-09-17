import { callApi } from "@/utils/apiUtils";
import user from "@/utils/endpoints/user";

export const updateProfile = async ({ body, query }: any) => {
  return callApi({
    uriEndPoint: {
      ...user.updateProfile,
    },
    body,
    query,
  });
};
export const updateCover = async ({ body ,query}: any) => {
  return callApi({
    uriEndPoint: {
      ...user.updateCover,
    },
    body,
    query
  });
};
export const currentUser = async () => {
  return callApi({
    uriEndPoint: {
      ...user.currentUser,
    },
  });
};
export const getSingleUser = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...user.getSingleUser,
    },
    pathParams,
  });
};
export const getUsersFollowers = async ({ pathParams, query }: any) => {
  return callApi({
    uriEndPoint: {
      ...user.getUsersFollowers,
    },
    pathParams,
    query,
  });
};
export const updateUserDetails = async ({ body }: any) => {
  return callApi({
    uriEndPoint: {
      ...user.updateUserDetails,
    },
    body,
  });
};
export const logOutUser = async () => {
  localStorage.removeItem("authorization");
  try {
    await callApi({
      uriEndPoint: {
        ...user.logOutUser,
      },
    });
  } catch (error) {}
  return { value: false };
};
export const checkUserNameExist = async (payload: any) => {
  return callApi({
    uriEndPoint: {
      ...user.checkUserNameExist,
    },
    query: payload,
  });
};
export const deleteUser = async () => {
  return callApi({
    uriEndPoint: {
      ...user.deleteUser,
    },
  });
};
export const deleteProfile = async () => {
  return callApi({
    uriEndPoint: {
      ...user.deleteProfile,
    },
  });
};
export const deleteCover = async () => {
  return callApi({
    uriEndPoint: {
      ...user.deleteCover,
    },
  });
};
export const getCountry = async () => {
  return callApi({
    uriEndPoint: {
      ...user.getCountry,
    },
 
  });
};
