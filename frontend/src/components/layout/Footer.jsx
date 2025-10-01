import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: '商品分類',
      links: [
        { name: '家居用品', href: '/products/living/home' },
        { name: '生活用品', href: '/products/living/lifestyle' },
        { name: '香氛用品', href: '/products/scent-tea/fragrance' },
        { name: '茶品飲品', href: '/products/scent-tea/tea' },
        { name: '配件飾品', href: '/products/fashion/accessories' },
        { name: '服飾', href: '/products/fashion/clothing' },
      ]
    },
    {
      title: '客戶服務',
      links: [
        { name: '常見問題', href: '/faq' },
        { name: '退換貨政策', href: '/returns' },
        { name: '運送說明', href: '/shipping' },
        { name: '尺寸指南', href: '/size-guide' },
      ]
    },
    {
      title: '關於 Marelle',
      links: [
        { name: '品牌故事', href: '/about' },
        { name: '聯絡我們', href: '/contact' },
        { name: '門市據點', href: '/stores' },
        { name: '招聘資訊', href: '/careers' },
      ]
    }
  ];

  return (
    <footer className="mt-auto" style={{background: '#FEFDFB', borderTop: '1px solid #E5E7EB'}}>
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="font-light text-2xl font-chinese tracking-tight" style={{color: '#333333', letterSpacing: '0.05em'}}>
                Marelle
              </span>
            </Link>
            <p className="text-sm font-chinese leading-relaxed" style={{color: '#999999'}}>
              致力於為您帶來溫暖質樸的生活美學<br/>
              每一件商品都經過精心挑選<br/>
              體現簡約的生活態度與美好
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-medium mb-6 font-chinese text-xs tracking-[0.15em] uppercase" style={{color: '#666666'}}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm font-chinese font-normal transition-colors duration-200"
                      style={{color: '#999999', letterSpacing: '0.02em'}}
                      onMouseEnter={(e) => e.target.style.color = '#CC824D'}
                      onMouseLeave={(e) => e.target.style.color = '#999999'}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center" style={{borderTop: '1px solid #E5E7EB'}}>
          <p className="text-xs font-chinese" style={{color: '#AAAAAA', letterSpacing: '0.05em'}}>
            © {currentYear} Marelle. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link 
              to="/privacy" 
              className="text-xs transition-colors duration-200 font-chinese"
              style={{color: '#AAAAAA', letterSpacing: '0.05em'}}
              onMouseEnter={(e) => e.target.style.color = '#CC824D'}
              onMouseLeave={(e) => e.target.style.color = '#AAAAAA'}
            >
              隱私政策
            </Link>
            <Link 
              to="/terms" 
              className="text-xs transition-colors duration-200 font-chinese"
              style={{color: '#AAAAAA', letterSpacing: '0.05em'}}
              onMouseEnter={(e) => e.target.style.color = '#CC824D'}
              onMouseLeave={(e) => e.target.style.color = '#AAAAAA'}
            >
              服務條款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;