import {
  markSingleNotificaitonRead,
  notificationMarkRead,
} from "@/services/notification";
import { useMutation } from "@tanstack/react-query";

export function useNotificationMarkRead() {
  return useMutation(() => notificationMarkRead());
}
export function useMarkSingleNotificationRead() {
  return useMutation((payload: any) => markSingleNotificaitonRead(payload));
}
