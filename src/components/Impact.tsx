import { useEffect, useState, useRef } from 'react';
import { Users, TreePine, Building, FileText } from 'lucide-react';

const Impact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      icon: Users,
      number: 10000,
      suffix: '+',
      label: 'People Empowered',
      description: 'Community members trained and supported'
    },
    {
      icon: TreePine,
      number: 5000,
      suffix: '+',
      label: 'Hectares Restored',
      description: 'Land rehabilitated through our programs'
    },
    {
      icon: Building,
      number: 50,
      suffix: '+',
      label: 'Community Projects',
      description: 'Successful climate adaptation initiatives'
    },
    {
      icon: FileText,
      number: 15,
      suffix: '+',
      label: 'Policies Influenced',
      description: 'National and regional policy changes'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const AnimatedCounter = ({ number, suffix, isVisible }: { number: number; suffix: string; isVisible: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = number / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
          setCount(number);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [isVisible, number]);

    return (
      <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
        {count.toLocaleString()}{suffix}
      </span>
    );
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Measurable change across Eswatini through community-driven climate action 
            and sustainable development initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="mb-4">
                    <AnimatedCounter 
                      number={stat.number} 
                      suffix={stat.suffix} 
                      isVisible={isVisible} 
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {stat.label}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">Making a difference every day</span>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;