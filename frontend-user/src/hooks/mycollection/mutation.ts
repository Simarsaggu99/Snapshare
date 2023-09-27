import { removePostFromCollection } from "@/services/mycollection";
import {
  addPostInCollection,
  createMyCollection,
} from "@/services/mycollection";
// import { followUser } from "@/services/users";
import { useMutation } from "@tanstack/react-query";

export function useCreateMyCollection() {
  return useMutation((payload: any) => createMyCollection(payload));
}
export function useAddPostInCollection() {
  return useMutation((payload: any) => addPostInCollection(payload));
}
export function useRemovePostFromCollection() {
  return useMutation((payload: any) => removePostFromCollection(payload));
}
// export function useFollowUser() {
//   return useMutation((payload: any) => followUser(payload));
// }
