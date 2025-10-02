const NewsletterSection = () => {
  return (
    <section className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 border-t" style={{borderColor: '#E5E7EB'}}>
      <div className="w-full max-w-7xl mx-auto text-center">
        <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 xs:mb-5 sm:mb-6 md:mb-7 font-chinese tracking-tight" style={{color: '#333333'}}>
          訂閱電子報
        </h2>
        <p className="font-chinese text-xs xs:text-sm sm:text-sm md:text-base mb-6 xs:mb-8 sm:mb-10 md:mb-12 px-4 xs:px-0" style={{color: '#999999', letterSpacing: '0.05em'}}>
          獲取最新商品資訊和生活靈感，讓美好融入您的日常
        </p>
        <div className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg mx-auto flex flex-col xs:flex-col sm:flex-row gap-3 xs:gap-3 sm:gap-0">
          <input
            type="email"
            placeholder="輸入您的電子郵件"
            className="flex-1 px-4 xs:px-5 sm:px-6 md:px-6 py-3 xs:py-3.5 sm:py-4 md:py-4 font-chinese text-xs xs:text-sm sm:text-sm md:text-base border transition-colors duration-200 rounded-lg"
            style={{ borderColor: '#E5E7EB', color: '#333333', background: '#FFFFFF' }}
            onFocus={(e) => { e.target.style.borderColor = '#CC824D'; e.target.style.outline = 'none'; }}
            onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; }}
          />
          <button
            className="px-6 xs:px-7 sm:px-8 md:px-8 py-3 xs:py-3.5 sm:py-4 md:py-4 font-chinese text-xs xs:text-sm sm:text-sm md:text-base font-medium tracking-[0.1em] transition-all duration-300 whitespace-nowrap rounded-lg"
            style={{ background: '#CC824D', color: '#FFFFFF', border: '1px solid #CC824D' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#b86c37'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#CC824D'; }}
          >
            訂閱
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;