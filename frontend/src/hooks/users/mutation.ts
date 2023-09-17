import {
  blockUser,
  followUser,
  paymentMethod,
  removeFollower,
  unblockUser,
  unfollowUser,
  updatePaymentDetails,
} from "@/services/users";
import { useMutation } from "@tanstack/react-query";

export function useBlockUser() {
  return useMutation((payload: any) => blockUser(payload));
}
export function useUnblockUser() {
  return useMutation((payload: any) => unblockUser(payload));
}
export function useFollowUser() {
  return useMutation((payload: any) => followUser(payload));
}
export function useUnfollowUser() {
  return useMutation((payload: any) => unfollowUser(payload));
}
export function useRemoveFollower() {
  return useMutation((payload: any) => removeFollower(payload));
}
export function usePaymentMethod() {
  return useMutation((payload: any) => paymentMethod(payload));
}
export function useUpdatePaymentDetails() {
  return useMutation((payload: any) => updatePaymentDetails(payload));
}
