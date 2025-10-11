# external_mock 資料描述

> 每檔案一句話功用；僅前端 mock，不代表最終後端結構。

## data

external_mock/data/categories.js: 五層級巢狀商品分類樹與查找/展開路徑相關工具 (flatten/find/path 等)。
external_mock/data/products.mock.js: 根據分類模板生成 mock 產品清單與篩選/統計工具函式（含 isOnSale、originalPrice、discountPercent、promotion 等促銷欄位；slug 與 urlKey 同步，統一採用 #146 筆記本邏輯如 146notebook）。已新增依 urlKey 掛載的五層規格樹 p.variants（目前示範 146notebook；葉節點含 payload: { sku, stock, price }）。詳：產品詳情網址固定為「分類層級 + 單一 urlKey」，並依分支截斷到最終掛載層級：

- leather-goods/travel 僅到 /leather-goods/travel
- leather-goods/bags 到 /leather-goods/bags/{briefcases|backpacks}
- writing-instruments/pens 到 /writing-instruments/pens/{fountain-pens|ballpoint-pens|rollerball-pens}
- writing-instruments/refills notebooks 到 /.../refills/notebooks；其它補充品到 /.../refills/pen-refills/...（第 4 層）
- accessories/watches 到 /accessories/watches；accessories/audio 到 /accessories/audio/headphones
- fragrance 到 /fragrance/{mens-fragrance|womens-fragrance}/{legend|signature|explorer...}

external_mock/data/productTags.js: 產品標籤類型、顯示配置與取得/新增標籤工具。
external_mock/data/stockStatus.js: 庫存狀態枚舉及對應標籤/顏色與判斷工具。
external_mock/data/navigation.js: 由分類轉換成導覽列 (mega menu) 使用的結構格式化函式。
external_mock/data/format.js: 金額格式化工具（NT$ 千分位）。

## state

external_mock/state/cart.jsx: 前端購物車 Context (加入/移除/更新/清空與合計計算)。
external_mock/state/users.js: 使用者 mock 資料層（種子帳號、註冊、登入驗證、session 讀寫）。
