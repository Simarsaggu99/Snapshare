import { globalSearch, userCrux } from "@/services/common";
import { useQuery } from "@tanstack/react-query";

export function useGlobalSearch(payload: any) {
  return useQuery(["globalSearch", payload], () => globalSearch(payload), {
    refetchOnWindowFocus: false,
  });
}
export function useUserCrux() {
  return useQuery(["userCrux"], () => userCrux(), {
    refetchOnWindowFocus: false,
  });
}
