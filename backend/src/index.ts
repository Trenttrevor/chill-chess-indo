import express from "express";
import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

import userRoutes from "./routes/userRoutes";

const app = express();

const allowedOrigins = ["https://chill-chess-indo.vercel.app"]; // Your exact Vercel URL

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Required for cookies/sessions
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Explicitly handle OPTIONS preflight requests for all routes
app.options("*", cors());

app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: ENV.URL_FRONTEND, credentials: true }));

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
