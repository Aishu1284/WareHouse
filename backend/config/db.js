import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

export const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
});

export async function connectDB() {
  try {
    await sql`SELECT NOW()`;
    console.log("✅ Connected to Neon PostgreSQL");
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
}