# Components 組件描述

> 一行一句，依目錄分組；僅整理排版未額外添加新說明。

## layout
src/components/layout/Footer.jsx: 全站共用頁腳容器，呈現站點底部資訊與版權。（若有）
src/components/layout/Navbar.jsx: 全站頂部導覽列外層組件，整合桌機與行動選單結構。
src/components/layout/ScrollManager.jsx: 監控或管理捲動行為（滾動定位/狀態用途）。

### layout/navbar
src/components/layout/navbar/MegaPanel.jsx: 桌面版多層級商品分類 mega menu 面板。
src/components/layout/navbar/NavActions.jsx: 導覽列右側動作區（搜尋、收藏、購物車、帳號、行動選單按鈕）。
src/components/layout/navbar/MobileMenu.jsx: 行動版漢堡選單與分類展開介面。

## ui
src/components/ui/GlassModal.jsx: 半透明玻璃感浮層通用模態視窗容器。
src/components/ui/SortDropdown.jsx: 商品列表排序下拉選單元件。
src/components/ui/StandardTable.jsx: 通用標準表格呈現組件。

## product
src/components/product/CategorySidebar.jsx: 商品列表側邊分類/篩選側欄（預留/擴充用）。
src/components/product/FourLevelCategoryMenu.jsx: 四層級分類瀑布式選單（供導航或篩選）。
src/components/product/MobileFilterPanel.jsx: 行動版商品篩選/分類抽屜式面板。
src/components/product/ProductCard.jsx: 商品卡片（圖片、名稱、價格、互動）展示。
src/components/product/ProductQuickAddModal.jsx: 快速加入購物車的商品細節簡易浮層。
src/components/product/ProductsHeader.jsx: 商品列表頁面頂部標題與控制列。

### product/Detail
src/components/product/Detail/ProductBreadcrumb.jsx: 商品詳情頁導覽麵包屑顯示目前分類層級。
src/components/product/Detail/ProductImageGallery.jsx: 商品詳情頁主要圖片與縮圖瀏覽畫廊。
src/components/product/Detail/ProductPurchasePanel.jsx: 商品詳情購買操作區（價格、數量、加入購物車等）。
src/components/product/Detail/ProductTabs.jsx: 商品詳情分頁區（描述 / 規格 / 其他資訊）。
src/components/product/Detail/RelatedProducts.jsx: 商品詳情下方的關聯或推薦商品列表。

## home
src/components/home/FeaturedProducts.jsx: 首頁精選商品區塊展示。
src/components/home/FeaturesSection.jsx: 首頁功能/賣點特色說明區塊。
src/components/home/HeroSection.jsx: 首頁頂部主視覺宣傳橫幅區域。
src/components/home/NewsletterSection.jsx: 首頁電子報/訂閱 CTA 區域。

## favorites
src/components/favorites/FavoritesHeader.jsx: 收藏清單頁標題區塊。
src/components/favorites/FavoritesList.jsx: 收藏商品列表格狀呈現（含空狀態）。

## member/account
src/components/member/account/ProfileInfo.jsx: 會員個人資料資訊區（帳號、建立時間、登入狀態）。
src/components/member/account/ProfileNotice.jsx: 個人資料頁的通知 / 假資料說明區塊。
src/components/member/account/ProfileQuickLinks.jsx: 個人資料頁右側快速導向連結集合。

## member/order
src/components/member/order/OrdersEmpty.jsx: 訂單中心空狀態顯示組件。

## member/vip
src/components/member/vip/VipCoupons.jsx: VIP 專區專屬優惠券列表 (示意/空狀態)。
src/components/member/vip/VipActivities.jsx: VIP 專區最新活動資訊區 (示意/空狀態)。

## auth
src/components/auth/LoginForm.jsx: 登入頁核心表單（帳號、密碼、提交與錯誤顯示）。
src/components/auth/LoginLogo.jsx: 登入頁頂部 Logo 與標題視覺區塊。
src/components/auth/LoginRegisterInvite.jsx: 登入頁底部導引使用者前往註冊的區塊。
src/components/auth/LoginSocialButton.jsx: 第三方（Line）社群登入按鈕示意元件。
