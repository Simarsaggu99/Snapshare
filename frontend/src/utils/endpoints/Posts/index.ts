import { EndPoint } from "@/types/index";

const posts: EndPoint = {
  addPosts: {
    uri: "/post/create",
    method: "POST",
    version: "/api",
  },
  getPosts: {
    uri: "/posts",
    method: "GET",
    version: "/api",
  },
  likePost: {
    uri: "/post/:id/like",
    method: "POST",
    version: "/api",
  },
  dislikePost: {
    uri: "/post/:id/dislike",
    method: "DELETE",
    version: "/api",
  },
  addComment: {
    uri: "/post/:id/comment",
    method: "POST",
    version: "/api",
  },
  getComments: {
    uri: "/post/:id/comments",
    method: "GET",
    version: "/api",
  },
  deleteComments: {
    uri: "/post/comment/:commentId",
    method: "DELETE",
    version: "/api",
  },
  editComment: {
    uri: "/post/comment/:commentId",
    method: "PUT",
    version: "/api",
  },
  deletePost: {
    uri: "/post/:id",
    method: "DELETE",
    version: "/api",
  },
  singlePost: {
    uri: "/posts",
    method: "GET",
    version: "/api",
  },
  reportPost: {
    uri: "/post/:id/report",
    method: "POST",
    version: "/api",
  },
  editPost: {
    uri: "/post/:id",
    method: "PUT",
    version: "/api",
  },
  reportedPost: {
    uri: "/post/reported/user",
    method: "GET",
    version: "/api",
  },
  viewPost: {
    uri: "/post/view/:id",
    method: "POST",
    version: "/api",
  },
  getTags: {
    uri: "/user/popular/tags",
    method: "GET",
    version: "/api",
  },
  getAllTags: {
    uri: "/user/tags/all",
    method: "GET",
    version: "/api",
  },
  checkTodayPostCount: {
    uri: "/post/check/todayPost",
    method: "GET",
    version: "/api",
  },
  getSinglePostData: {
    uri: "/post/:postId",
    method: "GET",
    version: "/api",
  },
};

export default posts;
