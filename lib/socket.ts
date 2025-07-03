import { io } from "socket.io-client";
// This file is used to create a Socket.IO client instance for real-time communication with the server.
// It connects to the live server specified in the environment variable `EXPO_PUBLIC_LIVE_SERVER
export const socket = io(process.env.EXPO_PUBLIC_LIVE_SERVER as string, {
  transports: ["websocket"],
});
