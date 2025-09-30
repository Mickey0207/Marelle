import React, { useState, useRef } from 'react';
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

const ImageUpload = ({ images = [], onChange, maxImages = 10 }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // 檢查文件類型
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} 不是有效的圖片文件`);
        return false;
      }
      
      // 檢查文件大小 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} 文件過大，請選擇小於 10MB 的圖片`);
        return false;
      }
      return true;
    });

    const remainingSlots = Math.max(0, maxImages - images.length);
    if (remainingSlots === 0) {
      alert(`最多只能上傳 ${maxImages} 張圖片`);
      return;
    }

    const filesToAdd = validFiles.slice(0, remainingSlots);
    if (validFiles.length > remainingSlots) {
      alert(`已達上限，只加入前 ${remainingSlots} 張圖片`);
    }

    // 以批次方式加入，避免多次 onChange 造成狀態不同步
    const readers = filesToAdd.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          id: Date.now() + Math.random(),
          file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }));

    Promise.all(readers).then(newImages => {
      onChange([...images, ...newImages]);
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (imageId) => {
    onChange(images.filter(img => img.id !== imageId));
  };

  const moveImage = (dragIndex, hoverIndex) => {
    const dragImage = images[dragIndex];
    const newImages = [...images];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, dragImage);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* 圖片預覽區域 */}
      {images.length > 0 && (
  <div className="grid grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
            >
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
              />
              
              {/* 主圖標示 */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  主圖
                </div>
              )}
              
              {/* 刪除按鈕 */}
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
              
              {/* 圖片資訊 */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="truncate">{image.name}</div>
                <div>{(image.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 上傳區域 */}
      {images.length < maxImages && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive 
              ? 'border-[#cc824d] bg-[#cc824d]/5' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            拖拽圖片到此處或點擊上傳
          </p>
          <p className="text-xs text-gray-500 mt-1">
            支援 PNG, JPG, GIF 格式，最大 10MB
          </p>
          <p className="text-xs text-gray-500">
            還可以上傳 {maxImages - images.length} 張圖片
          </p>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
            選擇圖片
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* 圖片說明 */}
      <div className="text-sm text-gray-500">
        <ul className="space-y-1">
          <li>• 第一張圖片將作為主圖顯示</li>
          <li>• 可以拖拽圖片調整順序</li>
          <li>• 建議圖片比例為 1:1 (正方形)</li>
          <li>• 最佳解析度：800x800 像素以上</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;