import { bountyHistory, contestWinnerList, getBounty } from "@/services/bounty";
import { useQuery } from "@tanstack/react-query";

export function useGetBounty() {
  return useQuery(["getBounty"], () => getBounty(), {
    refetchOnWindowFocus: false,
  });
}

export function useBounyHistory() {
  return useQuery(["getBountyHistory"], () => bountyHistory(), {
    refetchOnWindowFocus: false,
  });
}
export function useContestWinnerList() {
  return useQuery(["contestWinnerList"], () => contestWinnerList(), {
    refetchOnWindowFocus: false,
  });
}
