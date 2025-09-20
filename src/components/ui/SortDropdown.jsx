import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const SORT_OPTIONS = [
  { value: 'name', label: '名稱' },
  { value: 'price-low', label: '價低→高' },
  { value: 'price-high', label: '價高→低' },
  { value: 'rating', label: '評分' }
];

export const SortDropdown = ({ value, onChange, size = 'md' }) => {
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const updateDropdownPosition = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 2,
        left: rect.left,
        width: rect.width
      });
    }
  };

  const handleToggle = () => {
    if (!open) {
      updateDropdownPosition();
    }
    setOpen(!open);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = SORT_OPTIONS.find(o => o.value === value) || SORT_OPTIONS[0];

  return (
    <div ref={ref} className={`sort-dropdown ${open ? 'open' : ''} ${size === 'sm' ? 'sort-dropdown-sm' : ''}`}>
      <button
        type="button"
        className="sort-trigger"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current.label}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && createPortal(
        <div 
          className="glass-dropdown fixed z-[99999]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 99999
          }}
        >
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`glass-dropdown-option font-chinese ${opt.value === value ? 'selected' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default SortDropdown;
