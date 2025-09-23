import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  // 使用相對路徑指向後台的資料庫 schema
  schema: "../backend/CloudflareWorkers/database/schema/index.ts",
  out: "./CloudflareWorkers/database/migrations",
  dbCredentials: {
    // 使用相對路徑指向後台的資料庫檔案
    url: "../backend/CloudflareWorkers/database/marelle-local.db"
  }
});