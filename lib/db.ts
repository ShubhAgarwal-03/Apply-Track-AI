import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  ssl: "require",
  max: 1, // critical for serverless — one connection per function invocation
});

export const db = drizzle(client, { schema });
