import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  return (
    <section className="pt-24 xs:pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-16 xs:pb-20 sm:pb-24 md:pb-28 lg:pb-32 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center hero-content">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light mb-6 xs:mb-7 sm:mb-8 md:mb-10 font-chinese tracking-tight"
            style={{color: '#333333', letterSpacing: '-0.02em'}}>
            Marelle
          </h1>
          <p className="text-sm xs:text-base sm:text-base md:text-lg lg:text-xl mb-8 xs:mb-10 sm:mb-12 md:mb-14 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto font-chinese px-4 xs:px-0"
            style={{color: '#999999', letterSpacing: '0.05em', lineHeight: '1.8'}}>
            探索溫暖質樸的生活美學<br/>
            每件商品都承載著簡約而美好的生活態度
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 xs:px-8 sm:px-10 md:px-12 py-3 xs:py-3.5 sm:py-4 md:py-4 font-medium font-chinese text-xs xs:text-sm sm:text-sm md:text-base tracking-[0.1em] transition-all duration-300 rounded-lg"
            style={{ background: '#CC824D', color: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#CC824D'; e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #CC824D'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#CC824D'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            探索商品
            <ChevronRightIcon className="ml-2 xs:ml-3 h-3.5 xs:h-4 w-3.5 xs:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;