import React from 'react';
import { CheckCircle, Zap, Target, Activity } from 'lucide-react';

const WhyItWorksSection = () => {
  const reasons = [
    {
      icon: <CheckCircle className="w-5 h-5 text-accent" />,
      title: "High Adoption Rate",
      text: "Women say \"yes\" to Bexa! Over 95% adoption by women not having mammograms."
    },
    {
      icon: <Zap className="w-5 h-5 text-accent" />,
      title: "Painless, Convenient & Immediate Results", 
      text: "Bexa Breast Exams are gentle, involve no radiation, take about 15 minutes and are delivered from available spaces in the workplace."
    },
    {
      icon: <Target className="w-5 h-5 text-accent" />,
      title: "A Unique Technology Solution",
      text: "Bexa uses two technologies to maximize accuracy and dramatically reduce false positive results."
    },
    {
      icon: <Activity className="w-5 h-5 text-accent" />,
      title: "Effective in Every Woman",
      text: "Effective and accurate in all women, any age, including those with dense breast tissue"
    }
  ];

  return (
    <section className="section-spacing bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg md:text-xl font-bold text-center mb-4 section-header">
          WHY DOES IT WORK?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-gradient-to-br from-teal-50 to-gray-50 rounded-lg p-3.5 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {reason.icon}
                </div>
                <div>
                  <h3 className="font-semibold section-text mb-1 text-sm">
                    {reason.title}
                  </h3>
                  <p className="section-text leading-relaxed text-xs">
                    {reason.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Video Section */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="pt-[56.25%] relative rounded-lg overflow-hidden">
            <iframe 
              src="https://player.vimeo.com/video/1102536565?h=1a69301937&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
              referrerPolicy="strict-origin-when-cross-origin"
              title="Bexa Overview"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyItWorksSection;
