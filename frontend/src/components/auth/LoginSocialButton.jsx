import React from 'react';

export default function LoginSocialButton() {
  const apiBase = (typeof window !== 'undefined' && window.__MARELLE_API_BASE__) || '/'
  const href = `${apiBase.replace(/\/$/, '')}/frontend/auth/line/start`
  return (
    <a href={href} className="w-full bg-[#00c300] hover:bg-[#00b300] text-white text-sm xs:text-sm sm:text-base md:text-base lg:text-lg font-bold py-2.5 xs:py-2.5 sm:py-3 md:py-3 lg:py-3.5 rounded transition-colors font-serif tracking-wider flex items-center justify-center gap-2 xs:gap-2 sm:gap-3 md:gap-3">
      <i className="fa-brands fa-line text-lg xs:text-lg sm:text-xl md:text-xl" />
      <span>LINE 登入</span>
    </a>
  );
}
