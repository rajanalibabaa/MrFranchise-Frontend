import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000", {
  withCredentials: true,   // important if you use sessions
  transports: ["websocket"], // force websocket (more stable)
});

export default socket;
