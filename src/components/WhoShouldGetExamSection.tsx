
import React from 'react';
import { UserCheck, Heart, Baby } from 'lucide-react';

const WhoShouldGetExamSection = () => {
  const criteria = [
    {
      icon: <Heart className="w-5 h-5 text-accent" />,
      text: "African American women starting at age 35"
    },
    {
      icon: <UserCheck className="w-5 h-5 text-accent" />,
      text: "All women 40+ who are not getting annual mammograms",
      isBold: true
    },
    {
      icon: <Baby className="w-5 h-5 text-accent" />,
      text: "Women < 40, those who are pregnant or breastfeeding, and want an early detection exam"
    }
  ];

  return (
    <section className="section-spacing bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg md:text-xl font-bold text-center mb-1 text-primary">
          WHO SHOULD GET A BEXA BREAST EXAM?
        </h2>
        <p className="text-primary text-center mb-6 text-sm">
          With Bexa No Woman Is Left Behind
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {criteria.map((criterion, index) => (
            <div key={index} className="bg-white rounded-lg p-3.5 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-2">
                {criterion.icon}
              </div>
              <p className={`text-gray-700 text-sm leading-relaxed ${criterion.isBold ? 'font-bold' : ''}`}>
                {criterion.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoShouldGetExamSection;
