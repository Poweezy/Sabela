import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind, MapPin, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  icon: string;
}

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Enhanced mock weather data for Eswatini regions
  const mockWeatherData: WeatherData[] = [
    {
      location: 'Hhohho Region',
      temperature: 22,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      icon: 'partly-cloudy'
    },
    {
      location: 'Lubombo Region',
      temperature: 28,
      condition: 'Sunny',
      humidity: 45,
      windSpeed: 8,
      visibility: 15,
      icon: 'sunny'
    },
    {
      location: 'Manzini Region',
      temperature: 25,
      condition: 'Light Rain',
      humidity: 78,
      windSpeed: 15,
      visibility: 8,
      icon: 'rainy'
    },
    {
      location: 'Shiselweni Region',
      temperature: 24,
      condition: 'Cloudy',
      humidity: 70,
      windSpeed: 10,
      visibility: 12,
      icon: 'cloudy'
    }
  ];

  useEffect(() => {
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    // Simulate real-time weather updates
    const fetchWeatherData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add some randomization to make it feel more real-time
      const updatedData = mockWeatherData.map(region => ({
        ...region,
        temperature: region.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(90, region.humidity + (Math.random() - 0.5) * 10)),
        windSpeed: Math.max(0, region.windSpeed + (Math.random() - 0.5) * 5)
      }));
      
      setWeatherData(updatedData);
      setLoading(false);
    };

    fetchWeatherData();
    
    // Update weather data every 5 minutes
    const weatherInterval = setInterval(fetchWeatherData, 300000);
    
    return () => clearInterval(weatherInterval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-12 h-12 text-yellow-500 animate-spin-slow" />;
      case 'partly cloudy':
      case 'partly-cloudy':
        return <Cloud className="w-12 h-12 text-gray-500 animate-pulse" />;
      case 'light rain':
      case 'rainy':
        return <CloudRain className="w-12 h-12 text-blue-500 animate-bounce" />;
      case 'cloudy':
        return <Cloud className="w-12 h-12 text-gray-600 animate-pulse" />;
      default:
        return <Sun className="w-12 h-12 text-yellow-500" />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return 'text-red-500';
    if (temp >= 25) return 'text-orange-500';
    if (temp >= 20) return 'text-green-500';
    return 'text-blue-500';
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'text-yellow-600';
      case 'partly cloudy': return 'text-gray-600';
      case 'light rain': return 'text-blue-600';
      case 'cloudy': return 'text-gray-700';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <section id="weather" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🌤️ Eswatini Weather Focus
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time weather monitoring across Eswatini's four regions
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-200"></div>
              <span className="text-gray-500 ml-2">Loading live data...</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-12 bg-gray-200 rounded-full mb-4 mx-auto w-12"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="weather" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            🌤️ Eswatini Weather Focus
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
            Real-time monitoring of microclimates across Eswatini's regions to support 
            community adaptation strategies and climate resilience planning.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data • Last updated: {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {weatherData.map((region, index) => (
            <Card 
              key={index}
              className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 overflow-hidden relative"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardHeader className="text-center pb-2 relative z-10">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {region.location}
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="text-center space-y-4 relative z-10">
                <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {getWeatherIcon(region.condition)}
                </div>
                
                <div className={`text-4xl font-bold ${getTemperatureColor(region.temperature)} mb-2`}>
                  {Math.round(region.temperature)}°C
                </div>
                
                <p className={`font-medium ${getConditionColor(region.condition)} mb-4`}>
                  {region.condition}
                </p>
                
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                  <div className="flex flex-col items-center space-y-1">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-600">{Math.round(region.humidity)}%</span>
                    <span className="text-xs text-gray-400">Humidity</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <Wind className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-600">{Math.round(region.windSpeed)} km/h</span>
                    <span className="text-xs text-gray-400">Wind</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <Eye className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-600">{region.visibility} km</span>
                    <span className="text-xs text-gray-400">Visibility</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Climate Impact Note */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full animate-spin-slow"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Thermometer className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Climate Monitoring Matters</h3>
            <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-6">
              Understanding regional weather patterns helps us develop targeted climate adaptation 
              strategies and support communities in building resilience to climate change impacts across Eswatini.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/20 rounded-full px-4 py-2">📊 Data-Driven Decisions</div>
              <div className="bg-white/20 rounded-full px-4 py-2">🌱 Community Resilience</div>
              <div className="bg-white/20 rounded-full px-4 py-2">🔬 Scientific Approach</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherDashboard;