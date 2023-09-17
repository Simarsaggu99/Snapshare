import { EndPoint } from "@/types/index";
const usersEndpoints: EndPoint = {
  getSingleUser: {
    uri: "/user/:id",
    method: "GET",
    version: "/api",
  },
  getUsersFollowers: {
    uri: "/me/:userId/followers",
    method: "GET",
    version: "/api",
  },
  blockUser: {
    uri: "/user/:userId/block",
    method: "POST",
    version: "/api",
  },
  unblockUser: {
    uri: "/setting/user/:userId/unblock",
    method: "DELETE",
    version: "/api",
  },
  followUser: {
    uri: "/user/:userId/follow",
    method: "POST",
    version: "/api",
  },
  getBlockedUserList: {
    uri: "/setting/block",
    method: "GET",
    version: "/api",
  },
  unfollowUser: {
    uri: "/user/:userId/unfollow",
    method: "DELETE",
    version: "/api",
  },
  getFollowingList: {
    uri: "/user/:userId/following",
    method: "GET",
    version: "/api",
  },
  removeFollower: {
    uri: "/user/:id/removeFollower",
    method: "DELETE",
    version: "/api",
  },
  paymentMethod: {
    uri: "/user/payment/method",
    method: "POST",
    version: "/api",
  },
  getPaymentDetails: {
    uri: "/user/payment/details",
    method: "GET",
    version: "/api",
  },
  updatePaymentDetails: {
    uri: "/user/payment/details/:paymentId",
    method: "PUT",
    version: "/api",
  },
  getSuggestedFollowersList: {
    uri: "/user/suggestions/all",
    method: "GET",
    version: "/api",
  },
  getSingleUserWarning: {
    uri: "/notifications/user/warning",
    method: "GET",
    version: "/api",
  },
  getSingleUserSpankee: {
    uri: "/notifications/user/spankee",
    method: "GET",
    version: "/api",
  },
};

export default usersEndpoints;
