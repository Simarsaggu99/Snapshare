import {
  archiveConversation,
  conversationMedia,
  createConversation,
  deleteConversation,
  unArchiveConversation,
} from "@/services/message";
import { useMutation } from "@tanstack/react-query";

export function useCreateConversation() {
  return useMutation((payload: any) => createConversation(payload));
}
export function useDeleteConversation() {
  return useMutation((payload: any) => deleteConversation(payload));
}
export function useArchiveConversation() {
  return useMutation((payload: any) => archiveConversation(payload));
}
export function useUnArchiveConversation() {
  return useMutation((payload: any) => unArchiveConversation(payload));
}
