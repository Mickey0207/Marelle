import { SparklesIcon, HeartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const features = [
  {
    id: 'curation',
    title: '精心策展',
    icon: SparklesIcon,
    lines: ['每件商品都經過精心挑選', '確保品質與美感的完美結合']
  },
  {
    id: 'service',
    title: '用心服務',
    icon: HeartIcon,
    lines: ['從選購到售後', '我們提供貼心周到的服務體驗']
  },
  {
    id: 'quality',
    title: '品質保證',
    icon: ShieldCheckIcon,
    lines: ['嚴格的品質控制', '讓您安心享受每一次購物']
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 border-t" style={{borderColor: '#E5E7EB'}}>
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
          <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 xs:mb-5 sm:mb-6 md:mb-7 font-chinese tracking-tight" style={{color: '#333333'}}>
            為什麼選擇我們
          </h2>
          <p className="font-chinese text-xs xs:text-sm sm:text-sm md:text-base px-4 xs:px-0" style={{color: '#999999', letterSpacing: '0.05em'}}>
            我們致力於為您提供最好的購物體驗和生活品質
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 xs:gap-10 sm:gap-12 md:gap-10 lg:gap-12 xl:gap-16">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.id} className="text-center group">
                <div className="w-12 xs:w-14 sm:w-16 md:w-16 h-12 xs:h-14 sm:h-16 md:h-16 flex items-center justify-center mx-auto mb-4 xs:mb-5 sm:mb-6 md:mb-6 transition-all duration-300">
                  <Icon className="h-8 xs:h-9 sm:h-10 md:h-10 w-8 xs:w-9 sm:w-10 md:w-10 transition-colors duration-300" style={{color: '#CC824D', strokeWidth: 1.5}} />
                </div>
                <h3 className="text-base xs:text-lg sm:text-lg md:text-xl font-medium mb-2 xs:mb-2.5 sm:mb-3 md:mb-3 font-chinese" style={{color: '#333333', letterSpacing: '0.02em'}}>
                  {f.title}
                </h3>
                <p className="font-chinese text-xs xs:text-sm sm:text-sm md:text-base leading-relaxed px-4 xs:px-0" style={{color: '#999999'}}>
                  {f.lines.map((l,i) => (<span key={i}>{l}{i===0 && <br/>}</span>))}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;