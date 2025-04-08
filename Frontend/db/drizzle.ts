import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import dotenv from "dotenv";

// Load .env file explicitly
dotenv.config();

if (!process.env.NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL is not defined in .env file");
}

const sql = neon(process.env.NEON_DATABASE_URL);
const db = drizzle(sql);

export default db;
