
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="mb-3">
          <img 
            src="/lovable-uploads/abd3f0a7-f5f1-44bf-b5e9-325f47d0ee88.png" 
            alt="BEXA Logo" 
            className="h-8 mx-auto mb-3 opacity-80"
          />
        </div>
        <p className="text-gray-400 text-sm">
          © 2024 BEXA. Highly Adopted Breast Cancer Screening Experiences
        </p>
        <p className="text-gray-500 text-xs mt-1">
          FDA Cleared (510K)
        </p>
        <p className="text-gray-400 text-lg mt-3 font-bold">
          For inquiries and referrals please contact us at{' '}
          <a 
            href="mailto:info@mybexa.com" 
            className="text-accent hover:text-accent/80 transition-colors text-3xl"
          >
            info@mybexa.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
