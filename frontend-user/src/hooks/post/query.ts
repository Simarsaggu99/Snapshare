import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getComments,
  getPost,
  reportedPost,
  singlePost,
  allPost,
  checkTodayPostCount,
  getSinglePostData,
} from "../../services/post/index";
// import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
// import { allPost, } from "../../services/post/index";

export function useAllPost(payload: any) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery(
    ["getAllPost", payload],
    () =>
      allPost(
        payload
        // query: {
        //   keyword: payload.keyword,
        // },
      ),
    { refetchOnWindowFocus: false }
  );
}
export function useGetAllPost(
  { keyword, user, status, filterBy, pageSize }: any,
  options?: {}
) {
  return useInfiniteQuery(
    ["Posts", keyword, status, filterBy],
    () => {
      if (filterBy) {
        return getPost({
          startIndex: pageSize,
          // viewSize: 5,
          keyword,
          user,
          status,
          filterBy,
        });
      }
    },
    {
      getNextPageParam: (lastPage: any, pages: any) => lastPage?.nextCursor,
      refetchOnWindowFocus: false,
    }
  );
}
export function useGetSingleUserPost(
  { user, filterBy, startIndex }: any,
  options?: {}
) {
  return useInfiniteQuery(
    ["userPosts", filterBy, user, startIndex],
    ({ pageParam = 0 }) => {
      if (filterBy) {
        return getPost({
          startIndex: pageParam * 6,
          // viewSize: 5
          user,
          filterBy,
        });
      }
    },
    {
      getNextPageParam: (lastPage: any, pages: any) => lastPage?.nextCursor,
      refetchOnWindowFocus: false,
      enabled: !!user,
    }
  );
}
export function useGetPopularPost({ user, filterBy }: any, options?: {}) {
  return useInfiniteQuery(
    ["popularPosts", filterBy, user],
    ({ pageParam = 0 }) => {
      if (filterBy) {
        return getPost({
          startIndex: pageParam * 16,
          user,
          filterBy,
        });
      }
    },
    {
      getNextPageParam: (lastPage: any, pages: any) => lastPage?.nextCursor,
      refetchOnWindowFocus: false,
    }
  );
}
export function useGetComments(payload: any) {
  return useQuery(["getPostComments", payload], () => getComments(payload), {
    refetchOnWindowFocus: false,
  });
}
export function useSinglePost(payload: any) {
  return useQuery(["getSinglePost", payload], () => singlePost(payload), {
    refetchOnWindowFocus: false,
  });
}
export function useGetReportedPost(payload: any) {
  return useQuery(["getReportedPost", payload], () => reportedPost(payload), {
    refetchOnWindowFocus: false,
  });
}
export function useCheckTodayPostCount(payload: any) {
  return useQuery(["checkTodayPostCount"], () => checkTodayPostCount(), {
    refetchOnWindowFocus: false,
    enabled: !!payload?.currentUser?.data?._id,
  });
}
export function useGetSinglePostData(payload: any) {
  return useQuery(
    ["getSinglePostData", payload],
    () => getSinglePostData(payload),
    {
      refetchOnWindowFocus: false,
      enabled: !!payload?.pathParams?.postId,
    }
  );
}
