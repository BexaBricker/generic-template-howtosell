
import React from 'react';
import Header from '@/components/Header';
import WhyPromoteSection from '@/components/WhyPromoteSection';
import WhoIsBexaSection from '@/components/WhoIsBexaSection';
import WhoShouldGetExamSection from '@/components/WhoShouldGetExamSection';
import WhyItWorksSection from '@/components/WhyItWorksSection';
import CostSection from '@/components/CostSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <WhyPromoteSection />
      <WhoIsBexaSection />
      <WhoShouldGetExamSection />
      <WhyItWorksSection />
      <CostSection />
      <Footer />
    </div>
  );
};

export default Index;
