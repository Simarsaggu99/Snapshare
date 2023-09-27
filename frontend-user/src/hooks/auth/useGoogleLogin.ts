import { useQuery } from "@tanstack/react-query";
import { googleLogin, userOnBoarding } from "../../services/auth/index";

export function useLoginWithGoogle(payload: any) {
  return useQuery(["loginWithGoogle", payload], () => googleLogin(), {
    enabled: payload,
    refetchOnWindowFocus: false,
  });
}
