
import React from 'react';

const Header = () => {
  return (
    <header className="bexa-teal text-white py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/abd3f0a7-f5f1-44bf-b5e9-325f47d0ee88.png" 
            alt="BEXA Logo" 
            className="h-12 md:h-14"
          />
        </div>
        <div className="text-center mt-3">
          <h1 className="text-xl md:text-2xl font-bold">
            A Breast Cancer Early Detection Solution: KEY TALKING POINTS
          </h1>
          <p className="text-white/90 mt-1 text-base">
            Early Detection That Every Woman Can And Will Do
          </p>
          
          
          <p className="text-white/90 mt-4 text-lg font-bold">
            For inquiries and referrals please contact us at{' '}
            <a 
              href="mailto:info@mybexa.com" 
              className="text-white hover:text-white/80 transition-colors underline text-3xl"
            >
              info@mybexa.com
            </a>
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
