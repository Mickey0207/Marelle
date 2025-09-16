import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const SORT_OPTIONS = [
  { value: 'name', label: '名稱' },
  { value: 'price-low', label: '價低→高' },
  { value: 'price-high', label: '價高→低' },
  { value: 'rating', label: '評分' }
];

export const SortDropdown = ({ value, onChange, size = 'md' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current.label}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="sort-menu" role="listbox" tabIndex={-1}>
          {SORT_OPTIONS.map(opt => (
            <li key={opt.value}>
              <button
                role="option"
                aria-selected={opt.value === value}
                className={`sort-option ${opt.value === value ? 'active' : ''}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;
