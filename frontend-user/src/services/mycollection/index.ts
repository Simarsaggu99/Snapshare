import { callApi } from "@/utils/apiUtils";
import myCollectionEndpoints from "@/utils/endpoints/mycollection";

export const createMyCollection = async ({ pathParams, body }: any) => {
  return callApi({
    uriEndPoint: {
      ...myCollectionEndpoints.createMyCollection,
    },
    pathParams,
    body,
  });
};
export const getCollectionFolders = async ({ pathParams, body }: any) => {
  return callApi({
    uriEndPoint: {
      ...myCollectionEndpoints.getCollectionFolders,
    },
    pathParams,
    body,
  });
};
export const addPostInCollection = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...myCollectionEndpoints.addPostInCollection,
    },
    pathParams,
  });
};
export const getCollectionPosts = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...myCollectionEndpoints.getCollectionPosts,
    },
    pathParams,
  });
};

export const removePostFromCollection = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...myCollectionEndpoints.removePostFromCollection,
    },
    pathParams,
  });
};
