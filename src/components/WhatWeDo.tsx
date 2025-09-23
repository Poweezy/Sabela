import { 
  Zap, 
  Users, 
  Lightbulb, 
  Cloud, 
  BookOpen, 
  MessageSquare,
  TreePine,
  Sprout
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const WhatWeDo = () => {
  const programs = [
    {
      icon: TreePine,
      title: 'Adaptation & Resilience',
      description: 'Building community resilience through nature-based solutions and disaster risk reduction strategies.',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: Users,
      title: 'Sustainable Livelihoods',
      description: 'Promoting climate-smart agriculture and green initiatives for sustainable community development.',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Zap,
      title: 'Clean Energy',
      description: 'Advocating for renewable energy transitions to reduce greenhouse gas emissions.',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Cloud,
      title: 'GHG Emissions Reduction',
      description: 'Reducing emissions from agriculture, land use, and energy through innovative solutions.',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: BookOpen,
      title: 'Education & Awareness',
      description: 'Empowering communities through education, training, and capacity building programs.',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: MessageSquare,
      title: 'Policy Advocacy',
      description: 'Influencing national and regional policies to align with global climate commitments.',
      gradient: 'from-teal-500 to-green-600'
    }
  ];

  return (
    <section id="what-we-do" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What We Do
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We drive climate action through comprehensive programs that address the unique challenges 
            and opportunities in Eswatini's fight against climate change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const IconComponent = program.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${program.gradient} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                    {program.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {program.description}
                  </p>

                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${program.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full">
            <Sprout className="w-5 h-5" />
            <span className="font-medium">Join our mission for a sustainable future</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;