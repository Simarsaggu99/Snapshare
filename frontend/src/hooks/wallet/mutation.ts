import { redeemRequest } from "@/services/wallet";
import { useMutation } from "@tanstack/react-query";

export function useRedeemRequest() {
    return useMutation((payload: any) => redeemRequest(payload));
  }