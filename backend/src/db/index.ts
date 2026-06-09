import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env";

if (!ENV.DATABASE_URL) {
  throw new Error("database url is not found");
}

const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Database connected succesfully");
});

pool.on("error", (error) => {
  console.log("Database is error", error.message);
});

export const db = drizzle({ client: pool, schema });

//db.users.create
