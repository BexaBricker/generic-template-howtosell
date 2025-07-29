
import React from 'react';
import Header from '@/components/Header';
import WhyPromoteSection from '@/components/WhyPromoteSection';
import WhoIsBexaSection from '@/components/WhoIsBexaSection';
import WhoShouldGetExamSection from '@/components/WhoShouldGetExamSection';
import WhyItWorksSection from '@/components/WhyItWorksSection';
import CostSection from '@/components/CostSection';
import ContactForm from '@/components/ContactForm';
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
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
