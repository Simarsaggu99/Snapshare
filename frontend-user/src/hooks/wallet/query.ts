import { getUserTransaction, getWallet } from "@/services/wallet";
import { useQuery } from "@tanstack/react-query";

export function useGetWallet() {
  return useQuery(["getWallet"], () => getWallet(), {
    refetchOnWindowFocus: false,
  });
}
export function useGetUserTransaction(payload: any) {
  return useQuery(
    ["getUserTransaction", payload],
    () => getUserTransaction(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
