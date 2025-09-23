import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Ensure video loads properly
    const timer = setTimeout(() => setVideoLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Video Background with Fallback */}
      <div className="absolute inset-0 z-0">
        {/* Fallback Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1569163139394-de44cb5894c6?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        
        {/* Video Overlay */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadedData={() => setVideoLoaded(true)}
          poster="https://images.unsplash.com/photo-1569163139394-de44cb5894c6?q=80&w=2070&auto=format&fit=crop"
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" type="video/mp4" />
          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
        </video>
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400/30 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-emerald-400/20 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-teal-400/40 rounded-full animate-bounce delay-500"></div>
        </div>
      </div>

      {/* Hero Content with Enhanced Animations */}
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="block mb-4">Welcome to</span>
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-pulse">
              The Climate Watch
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light max-w-4xl mx-auto leading-relaxed opacity-90">
            Building a just, resilient, and sustainable Eswatini where people, nature, 
            and economy thrive under climate change
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button 
              size="lg"
              onClick={() => scrollToSection('#what-we-do')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-10 py-7 rounded-full group shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Discover Our Mission
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('#get-involved')}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg px-10 py-7 rounded-full group backdrop-blur-sm bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              Take Action Now
            </Button>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">10,000+</div>
              <div className="text-sm md:text-base text-white/80">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">5,000+</div>
              <div className="text-sm md:text-base text-white/80">Hectares Restored</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">50+</div>
              <div className="text-sm md:text-base text-white/80">Projects Completed</div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center animate-bounce">
            <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center mb-2">
              <div className="w-1 h-4 bg-white/80 rounded-full mt-2 animate-pulse"></div>
            </div>
            <span className="text-white/60 text-sm">Scroll to explore</span>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-20 w-20 h-20 bg-teal-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
    </section>
  );
};

export default HeroSection;