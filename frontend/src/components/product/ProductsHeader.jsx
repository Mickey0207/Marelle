import SortDropdown from "../../components/ui/SortDropdown.jsx";

const ProductsHeader = ({ currentTitle, breadcrumb, count, sortBy, onSortChange }) => {
  return (
    <>
      <div className="mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16">
        <div className="border-b pb-5 xs:pb-6 sm:pb-7 md:pb-8" style={{borderColor: '#E5E7EB'}}>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-light font-chinese tracking-tight mb-2 xs:mb-3 sm:mb-4 md:mb-4" style={{color: '#333333'}}>
            {currentTitle}
          </h1>
          <p className="text-xs xs:text-xs sm:text-sm md:text-sm font-chinese" style={{color: '#999999', letterSpacing: '0.05em'}}>
            {breadcrumb}
          </p>
        </div>
      </div>
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-6 xs:mb-7 sm:mb-8 md:mb-8 gap-3 xs:gap-4 sm:gap-0">
        <p className="text-xs xs:text-sm sm:text-sm md:text-sm font-chinese" style={{color: '#999999'}}>
          顯示 {count} 個商品
        </p>
        <div className="hidden sm:block w-full xs:w-auto sm:w-auto">
          <SortDropdown value={sortBy} onChange={onSortChange} size="sm" />
        </div>
      </div>
    </>
  );
};

export default ProductsHeader;
