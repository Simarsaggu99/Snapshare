import { getEarningStatics, getEarningSummary } from "@/services/earning";
import { useQuery } from "@tanstack/react-query";

export function useGetEarningSummary(payload: any) {
  return useQuery(
    ["getEarningSummary", payload],
    () => getEarningSummary(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export function useGetEarningStatics(payload: any) {
  return useQuery(
    ["getEarningStatics", payload],
    () => getEarningStatics(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
