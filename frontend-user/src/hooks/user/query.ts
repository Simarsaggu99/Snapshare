import { getAllTags, getTags } from "@/services/post";
import {
  currentUser,
  getCountry,
  getSingleUser,
  getUsersFollowers,
} from "@/services/user";
import { getSingleUserSpankee, getSingleUserWarning } from "@/services/users";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  return useQuery(["currentUser"], () => currentUser(), {
    refetchOnWindowFocus: false,

    // refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
  });
}
export function useGetSingleUser(payload: any) {
  return useQuery(["getSinlgeUser", payload], () => getSingleUser(payload), {
    refetchOnWindowFocus: false,
    enabled: !payload.error,
  });
}
export function useGetSingleForPost(payload: any) {
  return useQuery(["getSinlgeUser", payload], () => getSingleUser(payload), {
    refetchOnWindowFocus: false,
    enabled: !!payload.pathParams.id,
  });
}
// export function useCurrentUser() {
//   return useMutation(() => currentUser());
// }

export function useGetUserFollower(payload: any) {
  return useQuery(
    ["getUsersFollowers", payload],
    () => getUsersFollowers(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
export function useGetTags(payload: any) {
  return useQuery(["getTags", payload], () => getTags(payload), {
    refetchOnWindowFocus: false,
  });
}
export function useGetAllTags(payload: any) {
  return useQuery(["getAllTags", payload], () => getAllTags(payload), {
    refetchOnWindowFocus: false,
  });
}

export function useGetCountry() {
  return useQuery(["getCountry"], () => getCountry(), {
    refetchOnWindowFocus: false,
  });
}
export function useGetSingleUserWarning(payload: any) {
  return useQuery(
    ["getSingleUserWarning", payload],
    () => getSingleUserWarning(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
export function useGetSingleUserSpankee(payload: any) {
  return useQuery(
    ["getSingleUserSpankee", payload],
    () => getSingleUserSpankee(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
