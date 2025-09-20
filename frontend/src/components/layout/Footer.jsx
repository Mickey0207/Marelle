import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: '商品分類',
      links: [
        { name: '服飾配件', href: '/products?category=accessories' },
        { name: '居家生活', href: '/products?category=home' },
        { name: '香氛用品', href: '/products?category=fragrance' },
        { name: '茶品飲品', href: '/products?category=tea' },
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
    <footer className="border-t mt-auto bg-lofi" >
  <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-btn">
                <span className="text-btn-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl font-chinese text-lofi">Marelle</span>
            </Link>
            <p className="text-sm mb-4 font-chinese leading-relaxed text-lofi">
              致力於為您帶來溫暖質樸的生活美學，
              每一件商品都經過精心挑選，
              體現Lo-Fi的生活態度與美好。
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4 font-chinese text-primary-btn">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm font-chinese transition-colors duration-200"
                      style={{color: '#666666'}}
                      onMouseEnter={(e) => e.target.style.color = '#CC824D'}
                      onMouseLeave={(e) => e.target.style.color = '#666666'}
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
        <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center" style={{borderTop: '1px solid rgba(102, 102, 102, 0.1)'}}>
          <p className="text-sm font-chinese" style={{color: '#666666'}}>
            © {currentYear} Marelle. 版權所有。
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              to="/privacy" 
              className="text-sm transition-colors duration-200 font-chinese"
              style={{color: '#666666'}}
              onMouseEnter={(e) => e.target.style.color = '#CC824D'}
              onMouseLeave={(e) => e.target.style.color = '#666666'}
            >
              隱私政策
            </Link>
            <Link 
              to="/terms" 
              className="text-sm transition-colors duration-200 font-chinese"
              style={{color: '#666666'}}
              onMouseEnter={(e) => e.target.style.color = '#CC824D'}
              onMouseLeave={(e) => e.target.style.color = '#666666'}
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