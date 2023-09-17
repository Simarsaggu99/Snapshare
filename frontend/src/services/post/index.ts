import { callApi } from "@/utils/apiUtils";
import posts from "@/utils/endpoints/Posts";

export const addPost = async ({ body }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.addPosts,
    },
    body,
  });
};
export const allPost = ({ query }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.getPosts,
    },
    query,
  });
};
export const getPost = (payload: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.getPosts,
    },
    query: payload,
  });
};
export const likePost = async ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts?.likePost,
    },
    pathParams,
  });
};
export const dislikePost = ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts?.dislikePost,
    },
    pathParams,
  });
};
export const addcomment = ({ pathParams, body }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts?.addComment,
    },
    pathParams,
    body,
  });
};
export const getComments = ({ pathParams, query }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.getComments,
    },
    query,
    pathParams,
  });
};
export const deleteComments = ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.deleteComments,
    },
    pathParams,
  });
};
export const editComment = ({ pathParams, body }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.editComment,
    },
    pathParams,
    body,
  });
};
export const deletePost = ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.deletePost,
    },
    pathParams,
  });
};
export const singlePost = ({ pathParams, query }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.singlePost,
    },
    pathParams,
    query,
  });
};

export const reportPost = ({ pathParams, body }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.reportPost,
    },
    pathParams,
    body,
  });
};
export const editPost = ({ pathParams, body }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.editPost,
    },
    pathParams,
    body,
  });
};
export const reportedPost = ({ pathParams, query }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.reportedPost,
    },
    pathParams,
    query,
  });
};
export const viewPost = ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.viewPost,
    },
    pathParams,
  });
};
export const getTags = ({ query }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.getTags,
    },
    query,
  });
};
export const checkTodayPostCount = () => {
  return callApi({
    uriEndPoint: {
      ...posts.checkTodayPostCount,
    },
  });
};
export const getSinglePostData = ({ pathParams }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.getSinglePostData,
    },
    pathParams,
  });
};
export const getAllTags = ({ query }: any) => {
  return callApi({
    uriEndPoint: {
      ...posts.getAllTags,
    },
    query,
  });
};
