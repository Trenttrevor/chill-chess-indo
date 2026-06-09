import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || "3000",
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  URL_FRONTEND: process.env.URL_FRONTEND,
};
