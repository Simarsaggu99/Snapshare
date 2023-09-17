import { useMutation } from "@tanstack/react-query";
import {
  deleteCover,
  deleteProfile,
  deleteUser,
  logOutUser,
  updateCover,
  updateProfile,
  updateUserDetails,
} from "../../services/user/index";

export function useUpdateProfile() {
  return useMutation((payload: any) => updateProfile(payload));
}
export function useUpdateCover() {
  return useMutation((payload: any) => updateCover(payload));
}
export function useUpdateUserDetails() {
  return useMutation((payload: any) => updateUserDetails(payload));
}
export function useLogOutUser() {
  return useMutation(() => logOutUser());
}
export function useDeleteUser() {
  return useMutation(() => deleteUser());
}
export function useDeleteProfile() {
  return useMutation(() => deleteProfile());
}
export function useDeleteCover() {
  return useMutation(() => deleteCover());
}
