import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ChevronDown, Search, Check, X } from 'lucide-react';

const SearchableSelect = ({ 
  options = [], 
  value = '', 
  onChange = () => {}, 
  placeholder = 'Ë´ãÈÅ∏??..',
  searchPlaceholder = '?úÂ??∏È?...',
  className = '',
  disabled = false,
  allowClear = false,
  multiple = false,
  maxDisplayOptions = 10,
  createNewOption = null // ?ΩÊï∏ÔºåÂ?Ë®±ÂâµÂª∫Êñ∞?∏È?
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedValues, setSelectedValues] = useState(multiple ? (Array.isArray(value) ? value : []) : [value]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // ?ïÁ??∏È??ºÂ???
  const formatOptions = (opts) => {
    return opts.map(opt => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt;
    });
  };

  const formattedOptions = formatOptions(options);

  useEffect(() => {
    const filtered = formattedOptions.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    if (multiple) {
      setSelectedValues(Array.isArray(value) ? value : []);
    } else {
      setSelectedValues([value]);
    }
  }, [value, multiple]);

  // Ë®àÁ?‰∏ãÊ??∏ÂñÆ‰ΩçÁΩÆ
  const updateDropdownPosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 300; // ‰º∞Ë?‰∏ãÊ??∏ÂñÆÈ´òÂ∫¶
      
      let top = rect.bottom + 2;
      let left = rect.left;
      
      // Ê™¢Êü•?ØÂê¶?ÉË??∫Ë?Á™óÂ??®Ô?Â¶ÇÊ??ÉÂ?È°ØÁ§∫?®Ê??ï‰???
      if (top + dropdownHeight > viewportHeight) {
        top = rect.top - dropdownHeight - 2;
      }
      
      // Ê™¢Êü•?ØÂê¶?ÉË??∫Ë?Á™óÂè≥?äÔ?Â¶ÇÊ??ÉÂ??ëÂ∑¶Ë™øÊï¥
      if (left + rect.width > window.innerWidth) {
        left = window.innerWidth - rect.width - 10;
      }
      
      // Á¢∫‰?‰∏çÊ?Ë∂ÖÂá∫Ë¶ñÁ?Â∑¶È?
      if (left < 10) {
        left = 10;
      }
      
      setDropdownPosition({
        top: Math.max(top, 10), // Á¢∫‰?‰∏çÊ?Ë∂ÖÂá∫Ë¶ñÁ??ÇÈÉ®
        left: left,
        width: rect.width
      });
    }
  };

  // ?ïÁ??ìÈ?/?úÈ?‰∏ãÊ??∏ÂñÆ
  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        setIsOpen(true);
        // ‰ΩøÁî® requestAnimationFrame Á¢∫‰??®‰?‰∏Ä?ãÊ∏≤?ìÈÄ±Ê?Ë®àÁ?‰ΩçÁΩÆ
        requestAnimationFrame(() => {
          updateDropdownPosition();
        });
      } else {
        setIsOpen(false);
      }
    }
  };

  // GSAP ?ïÁï´?å‰?ÁΩÆÊõ¥??
  useEffect(() => {
    if (isOpen && listRef.current) {
      // Á¢∫‰?‰ΩçÁΩÆÊ≠?¢∫
      updateDropdownPosition();
      
      gsap.fromTo(listRef.current, 
        {
          opacity: 0,
          y: -10,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: 'power2.out'
        }
      );
    }
  }, [isOpen]);

  // ÈªûÊ?Â§ñÈÉ®?úÈ?
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          listRef.current && !listRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true); // ?ïÁç≤?Ä?âÊªæ?ï‰?‰ª?
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
      
      // ?ùÂ??ñ‰?ÁΩ?
      requestAnimationFrame(updateDropdownPosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const handleSelect = (option) => {
    if (multiple) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];
      
      setSelectedValues(newValues);
      onChange(newValues);
    } else {
      setSelectedValues([option.value]);
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (multiple) {
      setSelectedValues([]);
      onChange([]);
    } else {
      setSelectedValues(['']);
      onChange('');
    }
  };

  const handleCreateNew = () => {
    if (createNewOption && searchTerm.trim()) {
      const newOption = createNewOption(searchTerm.trim());
      if (newOption) {
        handleSelect(newOption);
        setSearchTerm('');
      }
    }
  };

  const getDisplayValue = () => {
    if (multiple) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const option = formattedOptions.find(opt => opt.value === selectedValues[0]);
        return option ? option.label : selectedValues[0];
      }
      return `Â∑≤ÈÅ∏??${selectedValues.length} ?Ö`;
    } else {
      if (!selectedValues[0]) return placeholder;
      const option = formattedOptions.find(opt => opt.value === selectedValues[0]);
      return option ? option.label : selectedValues[0];
    }
  };

  const isSelected = (optionValue) => selectedValues.includes(optionValue);

  const showCreateOption = createNewOption && searchTerm.trim() && 
    !filteredOptions.some(opt => opt.label.toLowerCase() === searchTerm.toLowerCase());

  return (
    <div 
      ref={dropdownRef} 
      className={`relative ${className}`}
      style={{ zIndex: isOpen ? 9999 : 'auto' }}
    >
      {/* ‰∏ªË??∏Ê?Ê°?*/}
      <div
        onClick={handleToggle}
        className={`
          relative w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
          cursor-pointer transition-all duration-200 font-chinese
          glass-light hover:border-button-300 hover:shadow-md
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isOpen ? 'border-button-500 shadow-lg ring-2 ring-button-100' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={`truncate ${!selectedValues[0] && !multiple ? 'text-gray-500' : 'text-gray-900'}`}>
            {getDisplayValue()}
          </span>
          
          <div className="flex items-center gap-2 ml-2">
            {allowClear && (selectedValues[0] || (multiple && selectedValues.length > 0)) && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </div>
        </div>

        {/* Â§öÈÅ∏Ê®ôÁ±§È°ØÁ§∫ */}
        {multiple && selectedValues.length > 1 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedValues.slice(0, 3).map(val => {
              const option = formattedOptions.find(opt => opt.value === val);
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-button-100 text-button-800 text-xs rounded-full"
                >
                  {option ? option.label : val}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect({ value: val });
                    }}
                    className="hover:bg-button-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {selectedValues.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{selectedValues.length - 3} ?¥Â?
              </span>
            )}
          </div>
        )}
      </div>

      {/* ‰∏ãÊ??∏È??óË°® - ‰ΩøÁî® Portal Ê∏≤Ê???body */}
      {isOpen && createPortal(
        <div
          ref={listRef}
          className="fixed z-[99999] glass-dropdown"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 99999,
            minWidth: '200px'
          }}
        >
          {/* ?úÂ?Ê°?*/}
          <div className="glass-dropdown-search">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="font-chinese"
                autoFocus
              />
            </div>
          </div>

          {/* ?∏È??óË°® */}
          <div className="max-h-60 overflow-y-auto">
            {/* ?µÂª∫?∞ÈÅ∏??*/}
            {showCreateOption && (
              <button
                onClick={handleCreateNew}
                className="glass-dropdown-create font-chinese group"
              >
                <div 
                  className="w-4 h-4 border-2 rounded-full flex items-center justify-center transition-colors"
                  style={{ borderColor: '#CC824D' }}
                >
                  <div 
                    className="w-1 h-1 rounded-full transition-colors"
                    style={{ backgroundColor: '#CC824D' }}
                  ></div>
                </div>
                <span className="group-hover:text-orange-800">?µÂª∫ "{searchTerm}"</span>
              </button>
            )}

            {filteredOptions.slice(0, maxDisplayOptions).map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`glass-dropdown-option font-chinese ${isSelected(option.value) ? 'selected' : ''}`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected(option.value) && (
                  <Check className="w-4 h-4 flex-shrink-0 ml-2" style={{ color: '#CC824D' }} />
                )}
              </button>
            ))}

            {filteredOptions.length === 0 && !showCreateOption && (
              <div className="glass-dropdown-empty font-chinese">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Ê≤íÊ??æÂà∞Á¨¶Â??ÑÈÅ∏??/p>
              </div>
            )}

            {filteredOptions.length > maxDisplayOptions && (
              <div className="glass-dropdown-more font-chinese">
                ?ÑÊ? {filteredOptions.length - maxDisplayOptions} ?ãÈÅ∏??..
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SearchableSelect;
