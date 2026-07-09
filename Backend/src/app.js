import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");
const indexFile = path.join(publicDir, "index.html");

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: [ "GET", "POST", "PUT", "DELETE" ],
}))
app.use(express.static(publicDir))

// Health check
app.get("/api/health", (req, res) => {
    res.json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

app.get(/^(?!\/api).*/, (req, res, next) => {
    if (path.extname(req.path)) {
        return next();
    }

    res.sendFile(indexFile);
});

export default app;
