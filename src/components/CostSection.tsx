
import React from 'react';
import { DollarSign, FileCheck, TrendingDown } from 'lucide-react';

const CostSection = () => {
  const costPoints = [
    {
      icon: <FileCheck className="w-5 h-5 text-accent" />,
      text: "Paid as a claim for insurance clients"
    },
    {
      icon: <DollarSign className="w-5 h-5 text-accent" />,
      text: "Covered as a Preventative Service with $0 employee OOP cost and no hidden or extra charges."
    },
    {
      icon: <TrendingDown className="w-5 h-5 text-accent" />,
      text: "85% lower referral rate for costly repeat or follow up imaging procedures."
    }
  ];

  return (
    <section className="section-spacing bexa-teal text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg md:text-xl font-bold text-center mb-4">
          WHAT DOES IT COST?
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {costPoints.map((point, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3.5 text-center hover:bg-white/20 transition-colors">
              <div className="flex justify-center mb-2">
                {point.icon}
              </div>
              <p className="text-sm leading-relaxed">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CostSection;
