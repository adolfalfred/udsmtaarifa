import { io } from "socket.io-client";

export const socket = io(process.env.EXPO_PUBLIC_LIVE_SERVER as string, {
  transports: ["websocket"],
});
