const tabs = [
  { id: 'details', label: '產品詳情' },
  { id: 'specs', label: '規格' },
  { id: 'shipping', label: '配送與退貨' }
];

const ProductTabs = ({ active, onChange }) => {
  return (
    <div className="flex border-b" style={{borderColor: '#E5E7EB'}}>
      {tabs.map(t => (
        <button
          key={t.id}
            onClick={() => onChange(t.id)}
            className={`px-6 py-4 font-chinese text-sm xs:text-base transition-all ${active === t.id ? 'border-b-2' : ''}`}
            style={{ borderColor: active === t.id ? '#CC824D' : 'transparent', color: active === t.id ? '#333333' : '#999999' }}
          >{t.label}</button>
      ))}
    </div>
  );
};

export default ProductTabs;