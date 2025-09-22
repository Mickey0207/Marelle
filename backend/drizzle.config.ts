import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./CloudflareWorkers/database/schema/index.ts",
  out: "./CloudflareWorkers/database/migrations",
  dbCredentials: {
    url: "./CloudflareWorkers/database/marelle-local.db"
  }
});