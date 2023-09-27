import { performBounty } from "@/services/bounty";
import { useMutation } from "@tanstack/react-query";

export function usePerformBounty() {
  return useMutation((payload: any) => performBounty(payload));
}
