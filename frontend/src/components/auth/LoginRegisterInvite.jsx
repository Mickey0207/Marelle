import React from 'react';

export default function LoginRegisterInvite({ onRegister }) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center mt-6 xs:mt-7 sm:mt-8 md:mt-8">
      <h3 className="text-lg xs:text-lg sm:text-xl md:text-xl lg:text-2xl font-serif font-bold text-[#2d1e0f] mb-3 xs:mb-3 sm:mb-4 md:mb-4 tracking-wider">還不是會員？</h3>
      <button onClick={onRegister} className="w-full border border-[#cc824d] text-[#cc824d] text-sm xs:text-sm sm:text-base md:text-base lg:text-lg font-bold py-2.5 xs:py-2.5 sm:py-3 md:py-3 lg:py-3.5 rounded transition-colors font-serif tracking-wider hover:bg-[#f7ede3]">註冊會員</button>
    </div>
  );
}
