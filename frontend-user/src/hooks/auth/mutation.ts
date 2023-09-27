import { useMutation } from "@tanstack/react-query";
import { userOnBoarding } from "../../services/auth/index";

export function useOnBoarding() {
  return useMutation((payload: any) => userOnBoarding(payload));
}
