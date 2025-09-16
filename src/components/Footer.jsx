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
            <div className="flex space-x-4">
              <a href="#" className="transition-colors duration-200 text-lofi hover:text-primary-btn opacity-60 hover:opacity-100">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="transition-colors duration-200 text-lofi hover:text-primary-btn opacity-60 hover:opacity-100">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="transition-colors duration-200 text-lofi hover:text-primary-btn opacity-60 hover:opacity-100">
                <span className="sr-only">LINE</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755z"/>
                </svg>
              </a>
            </div>
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

        {/* Newsletter */}
        <div className="mt-12 pt-8" style={{borderTop: '1px solid rgba(102, 102, 102, 0.1)'}}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold mb-2 font-chinese" style={{color: '#CC824D'}}>訂閱電子報</h3>
              <p className="text-sm font-chinese" style={{color: '#666666'}}>獲得最新商品資訊與優惠通知</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="請輸入您的電子郵件"
                className="flex-1 md:w-64 px-4 py-3 rounded-l-lg font-chinese transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(102, 102, 102, 0.2)',
                  color: '#666666'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.target.style.borderColor = '#CC824D';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                  e.target.style.borderColor = 'rgba(102, 102, 102, 0.2)';
                }}
              />
              <button 
                className="px-6 py-3 rounded-r-lg font-medium font-chinese transition-colors duration-200"
                style={{backgroundColor: '#CC824D', color: '#FFFFFF'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#b86c37'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#CC824D'}
              >
                訂閱
              </button>
            </div>
          </div>
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