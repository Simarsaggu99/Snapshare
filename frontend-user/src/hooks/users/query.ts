import {
  getBlockedUserList,
  getFollowingList,
  getPaymentDetails,
  getSingleUser,
  getSuggestedFollowersList,
  getUsersFollowers,
} from "@/services/users";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useGetSingleUser(payload: any) {
  return useQuery(["getSinlgeUser", payload], () => getSingleUser(payload), {
    refetchOnWindowFocus: false,
  });
}
export function useGetUserFollower(payload: any) {
  return useQuery(
    ["getUsersFollowers", payload],
    () => getUsersFollowers(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
export function useGetBlockedUserList() {
  return useQuery(["getBlockedUserList"], () => getBlockedUserList(), {
    refetchOnWindowFocus: false,
  });
}
// export function useGetFollowingList(payload: any) {
//   return useQuery(
//     ["getFollowingList", payload],
//     () => getFollowingList(payload),
//     {
//       refetchOnWindowFocus: false,
//     }
//   );
// }
export function useGetFollowingList({ userId }: any, options?: {}) {
  console.log("userId", userId);
  return useInfiniteQuery(
    ["usersFollower", userId],
    ({ pageParam = 0 }) => {
      return getFollowingList({
        query: {
          startIndex: pageParam * 5,
          viewSize: 5,
        },
        pathParams: {
          userId,
        },
      });
    },
    {
      getNextPageParam: (lastPage: any, pages: any) => lastPage?.nextCursor,
      refetchOnWindowFocus: false,
    }
  );
}
export function useGetPaymentDetails(payload: any) {
  return useQuery(
    ["getPaymentDetails", payload],
    () => getPaymentDetails(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
export function useGetSuggestedFollowersList(payload: any) {
  return useQuery(
    ["getSuggestedFollowersList", payload],
    () => getSuggestedFollowersList(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
