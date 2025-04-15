import { type Weather } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WeatherWidgetProps {
  weatherData: Weather[];
  className?: string;
}

export function WeatherWidget({ weatherData, className }: WeatherWidgetProps) {
  if (!weatherData || weatherData.length === 0) {
    return null;
  }

  // Format date: "2023-10-10" -> "Oct 10"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className={cn("shadow-sm overflow-hidden", className)}>
      <CardHeader className="bg-primary-500 p-4 text-white">
        <CardTitle className="text-lg font-semibold">Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between">
          {weatherData.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-sm text-gray-500">{formatDate(day.date)}</p>
              <i className={`fas ${day.icon} text-2xl my-2 ${getIconColor(day.icon)}`}></i>
              <p className="text-sm font-medium">{day.temperature}°F</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
          {getWeatherDescription(weatherData)}
        </p>
      </CardContent>
    </Card>
  );
}

// Helper to get an appropriate color for the weather icon
function getIconColor(icon: string): string {
  if (icon.includes('sun')) return 'text-yellow-500';
  if (icon.includes('cloud-sun')) return 'text-blue-400';
  if (icon.includes('cloud')) return 'text-gray-400';
  if (icon.includes('rain') || icon.includes('shower')) return 'text-blue-600';
  if (icon.includes('snow') || icon.includes('flake')) return 'text-blue-200';
  if (icon.includes('bolt')) return 'text-yellow-600';
  return 'text-gray-600';
}

// Generate a description based on the weather data
function getWeatherDescription(weatherData: Weather[]): string {
  // Calculate average temperature
  const temperatures = weatherData.map(day => day.temperature);
  const avgTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
  
  // Count weather conditions
  const conditions = weatherData.map(day => day.condition.toLowerCase());
  const sunny = conditions.filter(c => c.includes('sun') || c.includes('clear')).length;
  const rainy = conditions.filter(c => c.includes('rain')).length;
  const cloudy = conditions.filter(c => c.includes('cloud')).length;
  
  // Generate description
  if (avgTemp > 80) return "Expect hot weather during your trip. Don't forget sunscreen!";
  if (avgTemp < 50) return "Expect cold weather during your trip. Pack warm clothes!";
  
  if (rainy > weatherData.length / 2) return "Expect rainy weather during your trip. Pack an umbrella!";
  if (sunny > weatherData.length / 2) return "Expect mostly sunny weather during your trip. Great for outdoor activities!";
  if (cloudy > weatherData.length / 2) return "Expect mostly cloudy weather during your trip.";
  
  return "Expect mixed weather conditions during your trip. Check the forecast before heading out!";
}
