import { io } from "socket.io-client";
// This file is used to create a Socket.IO client instance for real-time communication with the server.
export const socket = io("https://udsmtaarifalive.adlewolf.com", {
  transports: ["websocket"],
});
