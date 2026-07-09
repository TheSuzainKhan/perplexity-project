import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;

export const initializeSocketConnection = () => {

    const socket = io(socketUrl, {
        withCredentials: true,
    })

    socket.on("connect", () => {
        console.log("Connected to Socket.IO server")
    })

    return socket
}
