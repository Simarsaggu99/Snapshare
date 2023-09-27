import { EndPoint } from "@/types/index";
const myCollectionEndpoints: EndPoint = {
  createMyCollection: {
    uri: "/folder",
    method: "POST",
    version: "/api",
  },
  getCollectionFolders: {
    uri: "/folder/",
    method: "GET",
    version: "/api",
  },
  addPostInCollection: {
    uri: "/folder/:folderId/post/:postId",
    method: "POST",
    version: "/api",
  },
  getCollectionPosts: {
    uri: "/folder/:folderId",
    method: "GET",
    version: "/api",
  },
  removePostFromCollection: {
    uri: "/folder/:folderId/post/:postId",
    method: "DELETE",
    version: "/api",
  },
};

export default myCollectionEndpoints;
