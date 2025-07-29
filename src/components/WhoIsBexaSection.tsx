import React from 'react';
import { Stethoscope, Shield, Building } from 'lucide-react';

const WhoIsBexaSection = () => {
  const features = [
    {
      icon: <Stethoscope className="w-5 h-5 text-accent" />,
      text: "A doctor-led services company created with breast cancer specialist"
    },
    {
      icon: <Shield className="w-5 h-5 text-accent" />,
      text: "Bexa examiners use two FDA Cleared (510K) technologies to perform a thorough and accurate breast examination."
    },
    {
      icon: <Building className="w-5 h-5 text-accent" />,
      text: "150+ US based clients, including state governments (Texas and Florida)"
    }
  ];

  return (
    <section className="section-spacing bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg md:text-xl font-bold text-center mb-4 text-primary">
          WHO IS BEXA?
        </h2>
        <div className="grid md:grid-cols-1 gap-4 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-3.5 border-l-4 border-accent">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {feature.icon}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {feature.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsBexaSection;
