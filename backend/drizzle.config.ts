import { defineConfig } from "drizzle-kit";

// 允許以環境變數指定本機 SQLite 檔案（例如指向 wrangler 的 .wrangler/state/**.sqlite）
const SQLITE_PATH = process.env.DRIZZLE_SQLITE_PATH || "./apps/worker/database/marelle-local.db";

export default defineConfig({
  dialect: "sqlite",
  schema: "./apps/worker/database/schema/index.ts",
  out: "./apps/worker/database/migrations",
  dbCredentials: {
    url: SQLITE_PATH,
  },
});