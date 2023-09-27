import { EndPoint } from "@/types/index";
const userEndpoints: EndPoint = {
  userOnBoarding: {
    uri: "/auth/onBoarding",
    method: "PUT",
    version: "/api",
  },
  updateProfile: {
    uri: "/user/uploadAvatar",
    method: "PUT",
    version: "/api",
  },
  updateCover: {
    uri: "/user/uploadCoverPhoto",
    method: "PUT",
    version: "/api",
  },
  currentUser: {
    uri: "/me",
    method: "GET",
    version: "/api",
  },
  getSingleUser: {
    uri: "/user/:id",
    method: "GET",
    version: "/api",
  },
  getUsersFollowers: {
    uri: "/user/:userId/followers",
    method: "GET",
    version: "/api",
  },
  updateUserDetails: {
    uri: "/user",
    method: "PUT",
    version: "/api",
  },
  logOutUser: {
    uri: "/auth/logout",
    method: "DELETE",
    version: "/api",
  },
  checkUserNameExist: {
    uri: "/userHandle",
    method: "GET",
    version: "/api",
  },
  deleteUser: {
    uri: "/user/delete",
    method: "DELETE",
    version: "/api",
  },
  deleteProfile: {
    uri: "/user/remove/avatar",
    method: "DELETE",
    version: "/api",
  },
  deleteCover: {
    uri: "/user/remove/cover",
    method: "DELETE",
    version: "/api",
  },
  getCountry: {
    uri: "/country/get",
    method: "GET",
    version: "/api",
  },

};

export default userEndpoints;
