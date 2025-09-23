import PageHeader from '@/components/PageHeader';
import HeroSection from '@/components/HeroSection';
import WhatWeDo from '@/components/WhatWeDo';
import Impact from '@/components/Impact';
import WeatherDashboard from '@/components/WeatherDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Users, 
  Handshake, 
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export default function Index() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader />
      <HeroSection />
      
      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Who We Are
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              We are an Eswatini-based climate change NGO, grounded in local realities and communities. 
              Our mission is to drive climate action through advocacy, education, and policy change, 
              focusing on adaptation and mitigation strategies that align with local priorities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Climate Justice</h3>
                <p className="text-gray-600">Fighting for equitable climate solutions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Community-Led</h3>
                <p className="text-gray-600">Locally-driven solutions and collaboration</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Scientific Integrity</h3>
                <p className="text-gray-600">Evidence-based climate action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatWeDo />
      <Impact />
      <WeatherDashboard />

      {/* Why It Matters Section */}
      <section id="why-it-matters" className="py-20 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
              Why It Matters
            </h2>
            <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed">
              <p className="text-center mb-8">
                Climate change is not a distant threat; it's a present reality in Eswatini. 
                We are experiencing rising temperatures, erratic rainfall, and more frequent 
                droughts and floods, which impact our agriculture, water security, and unique ecosystems.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <Card className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-red-600 mb-4">The Challenge</h3>
                    <p>Climate change disproportionately affects the most vulnerable among us, 
                    including women, rural communities, the poor, and the youth. We fight for 
                    climate justice to ensure that no one is left behind.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-green-600 mb-4">The Opportunity</h3>
                    <p>By investing in a green economy, renewable energy, and sustainable agriculture, 
                    we can unlock new opportunities for growth and prosperity while protecting our environment.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section id="get-involved" className="py-20 bg-gradient-to-b from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get Involved
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              There are many ways you can help us build a climate-resilient Eswatini. 
              Join us in the fight for a sustainable future!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: 'Join Our Campaigns',
                description: 'Participate in awareness campaigns and climate action initiatives',
                color: 'from-pink-500 to-rose-600'
              },
              {
                icon: Users,
                title: 'Volunteer With Us',
                description: 'Lend your skills and passion to our environmental causes',
                color: 'from-blue-500 to-indigo-600'
              },
              {
                icon: Handshake,
                title: 'Partner With Us',
                description: 'Organizations can support through funding and partnerships',
                color: 'from-green-500 to-emerald-600'
              },
              {
                icon: GraduationCap,
                title: 'Youth Leadership',
                description: 'Empower the next generation of climate leaders',
                color: 'from-purple-500 to-violet-600'
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 mb-6">{item.description}</p>
                    <Button 
                      onClick={() => scrollToSection('#contact')}
                      variant="outline" 
                      className="group-hover:bg-green-600 group-hover:text-white transition-colors"
                    >
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Resources & Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our library of publications, reports, and discover the human stories 
              behind our climate action work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1752341135601-d9252f5cdbdd?fm=jpg&q=60&w=800&ixlib=rb-4.1.0",
                category: "Story",
                title: "Community-led Reforestation in the Lubombo Mountains",
                description: "Learn how local communities are working to restore native forests."
              },
              {
                image: "https://images.unsplash.com/photo-1758347384057-8d47cf6fad1b?fm=jpg&q=60&w=800&ixlib=rb-4.1.0",
                category: "Report",
                title: "The State of Climate Change in Eswatini 2024",
                description: "Our annual report on climate data and impacts in Eswatini."
              },
              {
                image: "https://images.unsplash.com/photo-1757880776486-5e5285dab685?fm=jpg&q=60&w=800&ixlib=rb-4.1.0",
                category: "Guide",
                title: "A Guide to Sustainable Agriculture in Eswatini",
                description: "Practical resources for climate-smart farming practices."
              }
            ].map((resource, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={resource.image} 
                    alt={resource.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {resource.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <Button variant="ghost" className="p-0 h-auto font-medium text-green-600 hover:text-green-700">
                    Read More <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Contact & Donate
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your support is vital to our mission. Help us create a climate-resilient Eswatini 
              through financial contributions, in-kind support, or sharing your skills.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Mail className="w-6 h-6 text-green-400" />
                    <span>info@theclimatewatch.org</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="w-6 h-6 text-green-400" />
                    <span>+268 2505 2000</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-green-400" />
                    <span>Mbabane, Eswatini</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-4">Make a Difference Today</h4>
                <p className="mb-4">Every donation helps us fight climate change and build resilient communities.</p>
                <Button className="bg-white text-green-600 hover:bg-gray-100">
                  Donate Now
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-green-400 text-white placeholder-gray-300"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-green-400 text-white placeholder-gray-300"
                    required
                  />
                </div>
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-green-400 text-white placeholder-gray-300 resize-none"
                  required
                ></textarea>
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2024 The Climate Watch. All rights reserved. Building a sustainable future for Eswatini.
          </p>
        </div>
      </footer>
    </div>
  );
}