import express from "express";
import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

import userRoutes from "./routes/userRoutes";

const app = express();

app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: ENV.URL_FRONTEND, credentials: true }));

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use("/api/users", userRoutes);

app.listen(ENV.PORT, () => {
  console.log(`listening port ${ENV.PORT}`);
});
