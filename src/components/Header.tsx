
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white py-4" style={{color: '#224658'}}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center py-4">
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
          <p className="mt-1 text-base" style={{color: '#224658', opacity: 0.9}}>
            Early Detection That Every Woman Can And Will Do
          </p>
          
          
          <p className="mt-4 text-lg font-bold" style={{color: '#224658', opacity: 0.9}}>
            For inquiries and referrals please contact us at{' '}
            <a 
              href="mailto:info@mybexa.com" 
              className="hover:opacity-80 transition-opacity underline text-3xl" style={{color: '#224658'}}
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
