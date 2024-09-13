import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "~/env";

const sql = neon(env.NEON_DATABASE_URL);
const db = drizzle(sql);

export default db;
