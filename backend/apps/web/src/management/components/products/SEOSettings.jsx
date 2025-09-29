import React, { useState, useEffect } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from '../../../adminStyles';

const SEOSettings = ({ 
  productData, 
  onChange, 
  errors = {},
  categories = [] 
}) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploadingOG, setIsUploadingOG] = useState(false);
  const [isUploadingSearch, setIsUploadingSearch] = useState(false);

  // 生成預覽 URL
  useEffect(() => {
    const categorySlug = categories.length > 0 ? categories[0].slug || 'category' : 'products';
    const productSlug = productData.slug || 'product-slug';
    setPreviewUrl(`${window.location.origin}/${categorySlug}/${productSlug}`);
  }, [productData.slug, categories]);

  // 處理圖片上傳
  const handleImageUpload = async (file, field, setUploading) => {
    if (!file) return;

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      alert('請選擇圖片檔案');
      return;
    }

    // 檢查檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('圖片檔案不能超過 5MB');
      return;
    }

    setUploading(true);

    try {
      // 創建預覽 URL
      const previewUrl = URL.createObjectURL(file);
      
      // 模擬上傳過程 (實際專案中應該上傳到服務器)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新圖片 URL (實際專案中這應該是服務器返回的 URL)
      onChange(field, previewUrl);
      
    } catch (error) {
      console.error('圖片上傳失敗:', error);
      alert('圖片上傳失敗，請稍後再試');
    } finally {
      setUploading(false);
    }
  };

  // 移除圖片
  const removeImage = (field) => {
    onChange(field, '');
  };

  // 自動生成 meta title
  const generateMetaTitle = () => {
    if (productData.name) {
      const title = `${productData.name} - Marelle`;
      onChange('metaTitle', title);
    }
  };

  // 自動生成 meta description
  const generateMetaDescription = () => {
    if (productData.description) {
      const description = productData.description
        .replace(/\n/g, ' ')
        .substring(0, 150) + (productData.description.length > 150 ? '...' : '');
      onChange('metaDescription', description);
    }
  };

  return (
    <div className="space-y-6">
      {/* 搜尋結果預覽 */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-4">搜尋結果預覽</h4>
        <div className="bg-white border rounded-lg p-4 max-w-lg">
          <div className="text-blue-600 text-lg font-medium leading-tight hover:underline cursor-pointer">
            {productData.metaTitle || productData.name || 'Spring - Ecommerce website template'}
          </div>
          <div className="text-green-700 text-sm mt-1">
            {previewUrl}
          </div>
          <div className="text-gray-600 text-sm mt-2 leading-relaxed">
            {productData.metaDescription || productData.shortDescription || 
             'Discover Beautifully designed Template for retail store with a distinct design and subtle animations. You will be able to set up your new store website in no ...'}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          此預覽使用 Google 搜尋結果頁面的典型字符限制。搜尋引擎會實驗性調整其字符限制，可能決定顯示不同內容。
        </p>
      </div>

      {/* Title Tag */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            標題標籤 (Title Tag)
          </label>
          <button
            type="button"
            onClick={generateMetaTitle}
            className="text-xs text-blue-600 hover:text-blue-800"
            disabled={!productData.name}
          >
            自動生成
          </button>
        </div>
        <input
          type="text"
          value={productData.metaTitle || ''}
          onChange={(e) => onChange('metaTitle', e.target.value)}
          className={`${ADMIN_STYLES.input} ${errors.metaTitle ? 'border-red-500' : ''}`}
          placeholder="搜尋引擎顯示的標題"
          maxLength="60"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>建議長度：50-60 字符</span>
          <span>{(productData.metaTitle || '').length}/60</span>
        </div>
        {errors.metaTitle && <p className="mt-1 text-sm text-red-600">{errors.metaTitle}</p>}
      </div>

      {/* Meta Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            元描述 (Meta Description)
          </label>
          <button
            type="button"
            onClick={generateMetaDescription}
            className="text-xs text-blue-600 hover:text-blue-800"
            disabled={!productData.description}
          >
            自動生成
          </button>
        </div>
        <textarea
          value={productData.metaDescription || ''}
          onChange={(e) => onChange('metaDescription', e.target.value)}
          rows={3}
          className={`${ADMIN_STYLES.input} ${errors.metaDescription ? 'border-red-500' : ''}`}
          placeholder="搜尋引擎顯示的描述"
          maxLength="160"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>建議長度：150-160 字符</span>
          <span>{(productData.metaDescription || '').length}/160</span>
        </div>
        {errors.metaDescription && <p className="mt-1 text-sm text-red-600">{errors.metaDescription}</p>}
      </div>

      {/* Sitemap Indexing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          網站地圖索引 (Sitemap Indexing)
        </label>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="radio"
                id="sitemap-on"
                name="sitemapIndexing"
                checked={productData.sitemapIndexing !== false}
                onChange={() => onChange('sitemapIndexing', true)}
                className="h-4 w-4 text-[#cc824d] border-gray-300 focus:ring-[#cc824d]"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="sitemap-on" className="text-sm font-medium text-gray-700">
                開啟
              </label>
              <p className="text-xs text-gray-500">
                允許搜尋引擎在搜尋結果中返回使用此模板的靜態頁面
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="radio"
                id="sitemap-off"
                name="sitemapIndexing"
                checked={productData.sitemapIndexing === false}
                onChange={() => onChange('sitemapIndexing', false)}
                className="h-4 w-4 text-[#cc824d] border-gray-300 focus:ring-[#cc824d]"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="sitemap-off" className="text-sm font-medium text-gray-700">
                關閉
              </label>
              <p className="text-xs text-gray-500">
                此頁面模板永遠不會出現在搜尋結果或您的網站地圖中
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          控制搜尋引擎是否可以在搜尋結果中返回使用此模板的靜態頁面。
        </p>
      </div>

      {/* Page Canonical URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          頁面規範網址 (Page Canonical URL)
        </label>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="radio"
                id="canonical-auto"
                name="canonicalType"
                checked={!productData.customCanonicalUrl}
                onChange={() => onChange('customCanonicalUrl', '')}
                className="h-4 w-4 text-[#cc824d] border-gray-300 focus:ring-[#cc824d]"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="canonical-auto" className="text-sm font-medium text-gray-700">
                自動生成
              </label>
              <p className="text-xs text-gray-500">
                使用頁面的默認網址作為規範網址
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="radio"
                id="canonical-custom"
                name="canonicalType"
                checked={!!productData.customCanonicalUrl}
                onChange={() => {
                  if (!productData.customCanonicalUrl) {
                    onChange('customCanonicalUrl', previewUrl);
                  }
                }}
                className="h-4 w-4 text-[#cc824d] border-gray-300 focus:ring-[#cc824d]"
              />
            </div>
            <div className="ml-3 flex-1">
              <label htmlFor="canonical-custom" className="text-sm font-medium text-gray-700">
                自定義規範網址
              </label>
              <p className="text-xs text-gray-500 mb-2">
                指定自定義的規範網址以避免重複內容
              </p>
              {productData.customCanonicalUrl !== undefined && (
                <input
                  type="url"
                  value={productData.customCanonicalUrl || ''}
                  onChange={(e) => onChange('customCanonicalUrl', e.target.value)}
                  className={`${ADMIN_STYLES.input} text-sm`}
                  placeholder="https://"
                />
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          指引搜尋引擎到您偏好的頁面網址以避免重複內容。這將覆蓋網站設定中的全域規範標籤。
        </p>
      </div>

      {/* 開放圖表設定 */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">開放圖表設定</h4>
        <p className="text-sm text-gray-600 mb-4">
          在 Facebook、X (Twitter)、LinkedIn 和 Pinterest 上分享時容器顯示的資訊。
        </p>
        
        {/* 開放圖片預覽 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            開放圖片預覽
          </label>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start space-x-4">
              <div className="w-32 h-20 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {productData.openGraphImage ? (
                  <img 
                    src={productData.openGraphImage} 
                    alt="Open Graph" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-500 text-center">預覽圖片</span>
                )}
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">
                  {productData.openGraphTitle || productData.metaTitle || productData.name || 'Springring - 電子商務網站模板'}
                </h5>
                <p className="text-sm text-gray-600 mb-1">
                  {productData.openGraphDescription || productData.metaDescription || productData.shortDescription || '探索設計精美的零售商店模板，它擁有獨特的設計和精緻的動畫效果。'}
                </p>
                <p className="text-xs text-gray-500">marelle.com.tw/</p>
              </div>
            </div>
          </div>
        </div>

        {/* 開放圖片網址 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            開放圖片
          </label>
          
          {/* 圖片上傳區域 */}
          <div className="space-y-3">
            {productData.openGraphImage ? (
              <div className="relative inline-block">
                <img 
                  src={productData.openGraphImage} 
                  alt="Open Graph" 
                  className="w-full max-w-md h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage('openGraphImage')}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="openGraphImageUpload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file, 'openGraphImage', setIsUploadingOG);
                    }
                  }}
                  className="hidden"
                  disabled={isUploadingOG}
                />
                <label 
                  htmlFor="openGraphImageUpload" 
                  className="cursor-pointer block"
                >
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {isUploadingOG ? '上傳中...' : '點擊上傳圖片或拖拽圖片到此處'}
                  </p>
                  <p className="text-xs text-gray-500">
                    支援 PNG, JPG, GIF 格式，最大 5MB
                  </p>
                </label>
              </div>
            )}
            
            {/* 或者輸入 URL */}
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs text-gray-500">或輸入圖片網址</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            
            <input
              type="url"
              value={productData.openGraphImage || ''}
              onChange={(e) => onChange('openGraphImage', e.target.value)}
              className={ADMIN_STYLES.input}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            為獲得最佳效果，請使用至少 1200px x 630px (1.9:1 比例) 的影像。
          </p>
        </div>

        {/* 開放圖表標題 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              搜尋標題
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useMetaTitleForOG"
                checked={productData.useMetaTitleForOG !== false}
                onChange={(e) => onChange('useMetaTitleForOG', e.target.checked)}
                className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]"
              />
              <label htmlFor="useMetaTitleForOG" className="text-xs text-gray-600">
                與 SEO 標題標籤相同
              </label>
            </div>
          </div>
          {productData.useMetaTitleForOG === false && (
            <input
              type="text"
              value={productData.openGraphTitle || ''}
              onChange={(e) => onChange('openGraphTitle', e.target.value)}
              className={ADMIN_STYLES.input}
              placeholder="開放圖表標題"
            />
          )}
        </div>

        {/* 搜尋描述 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              搜尋描述
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useMetaDescriptionForOG"
                checked={productData.useMetaDescriptionForOG !== false}
                onChange={(e) => onChange('useMetaDescriptionForOG', e.target.checked)}
                className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]"
              />
              <label htmlFor="useMetaDescriptionForOG" className="text-xs text-gray-600">
                與 SEO Meta 描述相同
              </label>
            </div>
          </div>
          {productData.useMetaDescriptionForOG === false && (
            <textarea
              value={productData.openGraphDescription || ''}
              onChange={(e) => onChange('openGraphDescription', e.target.value)}
              rows={3}
              className={ADMIN_STYLES.input}
              placeholder="開放圖表描述"
            />
          )}
        </div>
      </div>

      {/* 網站搜尋設定 */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">網站搜尋設定</h4>
        <p className="text-sm text-gray-600 mb-4">
          網站搜尋結果中顯示的資訊。在此處進行更改，請重新發布您的網站，然後在搜尋設定中開始重新索引您的網站。
        </p>

        {/* 從網站搜尋結果中排除網頁 */}
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="excludeFromSearch"
              checked={productData.excludeFromSearch || false}
              onChange={(e) => onChange('excludeFromSearch', e.target.checked)}
              className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]"
            />
            <label htmlFor="excludeFromSearch" className="ml-2 text-sm text-gray-700">
              從網站搜尋結果中排除網頁
            </label>
          </div>
        </div>

        {/* 搜尋標題 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              搜尋標題
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useMetaTitleForSearch"
                checked={productData.useMetaTitleForSearch !== false}
                onChange={(e) => onChange('useMetaTitleForSearch', e.target.checked)}
                className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]"
              />
              <label htmlFor="useMetaTitleForSearch" className="text-xs text-gray-600">
                與 SEO 標題標籤相同
              </label>
            </div>
          </div>
          {productData.useMetaTitleForSearch === false && (
            <input
              type="text"
              value={productData.searchTitle || ''}
              onChange={(e) => onChange('searchTitle', e.target.value)}
              className={ADMIN_STYLES.input}
              placeholder="搜尋標題"
            />
          )}
        </div>

        {/* 搜尋描述 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              搜尋描述
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useMetaDescriptionForSearch"
                checked={productData.useMetaDescriptionForSearch !== false}
                onChange={(e) => onChange('useMetaDescriptionForSearch', e.target.checked)}
                className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]"
              />
              <label htmlFor="useMetaDescriptionForSearch" className="text-xs text-gray-600">
                與 SEO 提述標籤相同
              </label>
            </div>
          </div>
          {productData.useMetaDescriptionForSearch === false && (
            <textarea
              value={productData.searchDescription || ''}
              onChange={(e) => onChange('searchDescription', e.target.value)}
              rows={3}
              className={ADMIN_STYLES.input}
              placeholder="搜尋描述"
            />
          )}
        </div>

        {/* 搜尋圖片 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              搜尋圖片
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useOpenGraphImageForSearch"
                checked={productData.useOpenGraphImageForSearch !== false}
                onChange={(e) => onChange('useOpenGraphImageForSearch', e.target.checked)}
                className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]"
              />
              <label htmlFor="useOpenGraphImageForSearch" className="text-xs text-gray-600">
                與 Open Graph 圖片 URL 相同
              </label>
            </div>
          </div>
          
          {productData.useOpenGraphImageForSearch === false && (
            <div className="space-y-3">
              {productData.searchImage ? (
                <div className="relative inline-block">
                  <img 
                    src={productData.searchImage} 
                    alt="搜尋圖片" 
                    className="w-full max-w-md h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage('searchImage')}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="searchImageUpload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, 'searchImage', setIsUploadingSearch);
                      }
                    }}
                    className="hidden"
                    disabled={isUploadingSearch}
                  />
                  <label 
                    htmlFor="searchImageUpload" 
                    className="cursor-pointer block"
                  >
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {isUploadingSearch ? '上傳中...' : '點擊上傳圖片或拖拽圖片到此處'}
                    </p>
                    <p className="text-xs text-gray-500">
                      支援 PNG, JPG, GIF 格式，最大 5MB
                    </p>
                  </label>
                </div>
              )}
              
              {/* 或者輸入 URL */}
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-xs text-gray-500">或輸入圖片網址</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              
              <input
                type="url"
                value={productData.searchImage || ''}
                onChange={(e) => onChange('searchImage', e.target.value)}
                className={ADMIN_STYLES.input}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}
        </div>
      </div>

      {/* 產品狀態和可見性 */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">發布設定</h4>
        
  <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              產品狀態
            </label>
            <select
              value={productData.status || 'draft'}
              onChange={(e) => onChange('status', e.target.value)}
              className={ADMIN_STYLES.select}
            >
              <option value="draft">草稿</option>
              <option value="active">上架</option>
              <option value="archived">下架</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              可見性
            </label>
            <select
              value={productData.visibility || 'visible'}
              onChange={(e) => onChange('visibility', e.target.value)}
              className={ADMIN_STYLES.select}
            >
              <option value="visible">公開</option>
              <option value="hidden">隱藏</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={productData.featured || false}
              onChange={(e) => onChange('featured', e.target.checked)}
              className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
              設為精選產品
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOSettings;