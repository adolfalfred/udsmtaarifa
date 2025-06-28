import type * as Notifications from "expo-notifications";
import { create } from "zustand";

interface NotificationProps {
  expoPushToken: string;
  setExpoPushToken: (e: string) => void;
  notification: Notifications.Notification | undefined;
  setNotification: (e: Notifications.Notification | undefined) => void;
}

export const useExpoNotificationState = create<NotificationProps>((set) => ({
  expoPushToken: "",
  setExpoPushToken: (e) => set(() => ({ expoPushToken: e })),
  notification: undefined,
  setNotification: (e) => set(() => ({ notification: e })),
}));
