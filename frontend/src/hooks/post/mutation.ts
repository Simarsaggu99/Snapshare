import SinglePostCard from "@/components/singlePostCard";
import { useMutation } from "@tanstack/react-query";
import {
  addcomment,
  addPost,
  deleteComments,
  deletePost,
  dislikePost,
  editComment,
  editPost,
  likePost,
  singlePost,
  reportPost,
  reportedPost,
  viewPost,
} from "../../services/post/index";

export function useCreatePost() {
  return useMutation((payload: any) => addPost(payload));
}

export function useLikePost() {
  return useMutation((payload: any) => likePost(payload));
}
export function useDislikePost() {
  return useMutation((payload: any) => dislikePost(payload));
}
export function useAddComments() {
  return useMutation((payload: any) => addcomment(payload));
}

export function useDeleteComment() {
  return useMutation((payload: any) => deleteComments(payload));
}
export function useEditComment() {
  return useMutation((payload: any) => editComment(payload));
}
export function useDeltePost() {
  return useMutation((payload: any) => deletePost(payload));
}
export function useSinglePost() {
  return useMutation((payload: any) => singlePost(payload));
}
export function useReportPost() {
  return useMutation((payload: any) => reportPost(payload));
}
export function useEditPost() {
  return useMutation((payload: any) => editPost(payload));
}
export function useViewPost() {
  return useMutation((payload: any) => viewPost(payload));
}
