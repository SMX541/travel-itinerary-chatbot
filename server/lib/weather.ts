import { type Weather } from "@shared/schema";

// Function to get weather forecast for a location
export async function getWeatherForecast(location: string, days: number = 5): Promise<Weather[]> {
  try {
    // Use environment variable for weather API key
    const apiKey = process.env.WEATHER_API_KEY || process.env.OPENWEATHERMAP_API_KEY;
    
    if (!apiKey) {
      console.warn("No weather API key provided, returning mock data");
      return getMockWeatherData(days);
    }
    
    // Make API request to OpenWeatherMap (or your preferred weather API)
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=imperial&appid=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process the weather data into our format
    // This assumes OpenWeatherMap's format, adjust if using different API
    const forecasts: Weather[] = [];
    const uniqueDates = new Set<string>();
    
    // OpenWeatherMap returns forecast in 3-hour intervals, we'll take one per day
    for (const forecast of data.list) {
      const date = forecast.dt_txt.split(' ')[0]; // "2023-10-10 12:00:00" -> "2023-10-10"
      
      if (!uniqueDates.has(date) && forecasts.length < days) {
        uniqueDates.add(date);
        
        forecasts.push({
          date,
          temperature: Math.round(forecast.main.temp),
          condition: forecast.weather[0].main,
          icon: getWeatherIcon(forecast.weather[0].id)
        });
      }
    }
    
    return forecasts;
  } catch (error) {
    console.error("Weather API error:", error);
    // Return mock data as fallback
    return getMockWeatherData(days);
  }
}

// Helper function to map weather condition codes to Font Awesome icons
function getWeatherIcon(weatherCode: number): string {
  // Map OpenWeatherMap condition codes to Font Awesome icons
  if (weatherCode >= 200 && weatherCode < 300) return 'fa-bolt'; // Thunderstorm
  if (weatherCode >= 300 && weatherCode < 400) return 'fa-cloud-rain'; // Drizzle
  if (weatherCode >= 500 && weatherCode < 600) return 'fa-cloud-showers-heavy'; // Rain
  if (weatherCode >= 600 && weatherCode < 700) return 'fa-snowflake'; // Snow
  if (weatherCode >= 700 && weatherCode < 800) return 'fa-smog'; // Atmosphere
  if (weatherCode === 800) return 'fa-sun'; // Clear
  if (weatherCode > 800) return 'fa-cloud-sun'; // Clouds
  
  return 'fa-cloud'; // Default
}

// Mock weather data as fallback
function getMockWeatherData(days: number): Weather[] {
  const forecasts: Weather[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dateString = date.toISOString().split('T')[0];
    
    // Generate mock weather data
    forecasts.push({
      date: dateString,
      temperature: 65 + Math.floor(Math.random() * 10), // 65-75°F
      condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Clear'][Math.floor(Math.random() * 5)],
      icon: ['fa-sun', 'fa-cloud', 'fa-cloud-sun', 'fa-cloud-rain', 'fa-sun'][Math.floor(Math.random() * 5)]
    });
  }
  
  return forecasts;
}
