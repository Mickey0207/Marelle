import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import Portal from './Portal';

const CustomSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "請選擇...", 
  className = "",
  disabled = false,
  size = "md" // sm, md, lg
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef(null);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base"
  };

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleToggleOpen = () => {
    if (disabled) return;
    
    if (!isOpen && selectRef.current) {
      // 計算下拉選單位置
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    
    setIsOpen(!isOpen);
  };

  return (
    <div ref={selectRef} className={`relative z-[99999] ${className}`}>{/* 大幅提高z-index */}
      <button
        type="button"
        onClick={handleToggleOpen}
        disabled={disabled}
        className={`
          w-full text-left bg-white border border-gray-300 rounded-xl
          ${sizeClasses[size]}
          font-chinese focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent 
          shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-amber-500 border-transparent' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? (
              <span className="flex items-center">
                {selectedOption.icon && <span className="mr-2">{selectedOption.icon}</span>}
                {selectedOption.label}
              </span>
            ) : placeholder}
          </span>
          <ChevronDownIcon 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {isOpen && (
        <Portal>
          <div 
            className="custom-select-dropdown bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm" 
            style={{ 
              position: 'absolute',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 999999 
            }}
          >
            <div className="max-h-60 overflow-y-auto bg-white">
              {options.map((option, index) => (
                <button
                  key={option.value || index}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full text-left px-4 py-3 hover:bg-amber-50 hover:text-amber-900
                    transition-colors duration-150 font-chinese
                  ${value === option.value ? 'bg-amber-100 text-amber-900' : 'text-gray-700'}
                  ${index !== options.length - 1 ? 'border-b border-gray-100' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    {option.icon && <span className="mr-3 text-lg">{option.icon}</span>}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                      )}
                    </div>
                  </span>
                  {value === option.value && (
                    <CheckIcon className="w-4 h-4 text-amber-600" />
                  )}
                </div>
              </button>
            ))}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default CustomSelect;