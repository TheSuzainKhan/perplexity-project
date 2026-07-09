import "dotenv/config";
import dns from "dns";
import app from "./src/app.js";
import http from "http";
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";
import { verifyMailTransporter } from "./src/services/mail.service.js";

const PORT = process.env.PORT || 8000;

dns.setDefaultResultOrder("ipv4first");

const httpServer = http.createServer(app);

initSocket(httpServer);

connectDB()
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });

verifyMailTransporter()
    .catch((err) => {
        console.error("Email transporter verification failed:", err);
    });

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
