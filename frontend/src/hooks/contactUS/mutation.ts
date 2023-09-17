import { contactUs } from "@/services/contactUs";
import { useMutation } from "@tanstack/react-query";

export function useContactUs() {
  return useMutation((payload: any) => contactUs(payload));
}
