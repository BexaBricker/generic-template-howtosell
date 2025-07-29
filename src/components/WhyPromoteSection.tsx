
import React from 'react';
import { AlertTriangle, TrendingUp, Users } from 'lucide-react';

const WhyPromoteSection = () => {
  const reasons = [
    {
      icon: <Users className="w-5 h-5 text-accent" />,
      text: "Over 60% of women aren't getting mammograms and have no effective early detection option for the most common women's cancer"
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-accent" />,
      text: "Late-stage diagnosis from not getting screened is an unnecessary tragedy for women and costly for employers."
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-accent" />,
      text: "95% of women not getting mammograms adopt Bexa Breast Exams. Bexa is an option that can close the early detection gap."
    }
  ];

  return (
    <section className="section-spacing bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg md:text-xl font-bold text-center mb-4 text-primary">
          WHY PROMOTE BEXA for Breast Cancer Early Detection?
        </h2>
        <div className="grid md:grid-cols-1 gap-4 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white rounded-lg p-3.5 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {reason.icon}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {reason.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyPromoteSection;
