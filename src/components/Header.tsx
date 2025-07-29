
import React from 'react';

const Header = () => {
  return (
    <header className="bcbs-blue text-white py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
          <img 
            src="/lovable-uploads/abd3f0a7-f5f1-44bf-b5e9-325f47d0ee88.png" 
            alt="BEXA Logo" 
            className="h-10 md:h-12"
          />
          <span className="text-2xl md:text-3xl font-bold">for</span>
          <img 
            src="/lovable-uploads/e3007522-6ad5-4323-b60b-ba49ae3ff6d3.png" 
            alt="Blue Cross Blue Shield of Texas Logo" 
            className="h-9 md:h-12"
          />
        </div>
        <div className="text-center mt-3">
          <h1 className="text-xl md:text-2xl font-bold">
            A Breast Cancer Early Detection Solution: KEY TALKING POINTS
          </h1>
          <p className="text-blue-100 mt-1 text-base">
            Early Detection That Every Woman Can And Will Do
          </p>
          
          {/* Download Flyer Link */}
          <div className="mt-4">
            <a 
              href="https://axeb.blob.core.windows.net/pdf/BexaOverview_BCBS_flyer-final.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-300 text-base font-semibold border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl"
            >
              📄 Want a quick overview? Download our flyer
            </a>
          </div>
          
          <p className="text-blue-100 mt-4 text-lg font-bold">
            For inquiries and referrals please email{' '}
            <a 
              href="mailto:BCBSTX@mybexa.com" 
              className="text-white hover:text-blue-200 transition-colors underline text-3xl"
            >
              BCBSTX@mybexa.com
            </a>
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
