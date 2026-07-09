import { io } from "socket.io-client";


export const initializeSocketConnection = () => {

    const socket = io("https://perplexity-project-awlr.onrender.com", {
        withCredentials: true,
    })

    socket.on("connect", () => {
        console.log("Connected to Socket.IO server")
    })

    return socket
}
