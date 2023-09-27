import {
  getCollectionFolders,
  getCollectionPosts,
} from "@/services/mycollection";

import { useQuery } from "@tanstack/react-query";

export function useGetCollectionFolders(payload: any) {
  return useQuery(
    ["getCollectionFolders", payload],
    () => getCollectionFolders(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
export function useGetHeaderCollectionFolders(payload: any) {
  return useQuery(
    ["getCollectionFolders", payload],
    () => getCollectionFolders(payload),
    {
      refetchOnWindowFocus: false,
      enabled: !!payload?.query?.isLogged,
    }
  );
}
export function useGetCollectionPosts(payload: any) {
  return useQuery(
    ["getCollectionFolders", payload],
    () => getCollectionPosts(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
