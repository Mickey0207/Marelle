# Experiments

本資料夾用於存放臨時/實驗性方案（PoC），例如暫時替代 KV/DO 的 in-memory 令牌桶。原則：
- 不得被 apps/web 或 apps/worker 直接 import。
- 僅供本地測試或設計討論參考；正式上線請使用 Cloudflare 原生能力（KV、Durable Objects、Queues 等）。
- 方案落地後請移除此處的實驗程式碼。
