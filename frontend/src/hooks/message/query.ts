import {
  checkIfConversationExists,
  conversationMedia,
  createConversation,
  getConversationList,
  getUserForConversation,
} from "@/services/message";

import { useQuery } from "@tanstack/react-query";

export function useGetUserForConversation(payload: any) {
  return useQuery(
    ["getUserForConversation", payload],
    () => getUserForConversation(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
export function useCheckIfConversationExists(payload: any) {
  return useQuery(
    ["checkIfConversationExists", payload],
    () => checkIfConversationExists(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
export function useGetConversationList(payload: any) {
  return useQuery(
    ["getConversationList", payload],
    () => getConversationList(payload),
    {
      refetchOnWindowFocus: true,
    }
  );
}
export function useConversationMedia(payload: any) {
  return useQuery(
    ["conversationMedia", payload],
    () => conversationMedia(payload),
    {
      refetchOnWindowFocus: false,
    }
  );
}
