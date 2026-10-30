import { WeatherData } from '../types';

// WMO Weather interpretation codes
function decodeWeatherCode(code: number): { text: string; isRain: boolean } {
  if (code === 0) return { text: 'Clear sky', isRain: false };
  if (code === 1 || code === 2) return { text: 'Mainly clear / Partly cloudy', isRain: false };
  if (code === 3) return { text: 'Overcast', isRain: false };
  if (code >= 45 && code <= 48) return { text: 'Foggy / Haze', isRain: false };
  if (code >= 51 && code <= 55) return { text: 'Tropical Drizzle', isRain: true };
  if (code >= 61 && code <= 65) return { text: 'Rain Showers', isRain: true };
  if (code >= 66 && code <= 67) return { text: 'Freezing rain', isRain: true };
  if (code >= 71 && code <= 77) return { text: 'Snow fall', isRain: false };
  if (code >= 80 && code <= 82) return { text: 'Monsoon Rain Showers', isRain: true };
  if (code >= 85 && code <= 86) return { text: 'Snow showers', isRain: false };
  if (code >= 95 && code <= 99) return { text: 'Thunderstorm with heavy showers', isRain: true };
  return { text: 'Variable tropical conditions', isRain: false };
}

export interface CityGeo {
  lat: number;
  lon: number;
  city: string;
  country: string;
  state?: string;
  timezone?: string;
}

// Pre-indexed coordinate table for instant, zero-latency resolution
export const KNOWN_CITIES: Record<string, CityGeo> = {
  'vellore': { lat: 12.9165, lon: 79.1325, city: 'Vellore, Tamil Nadu', country: 'India', state: 'Tamil Nadu', timezone: 'Asia/Kolkata' },
  'vellore, tamil nadu': { lat: 12.9165, lon: 79.1325, city: 'Vellore, Tamil Nadu', country: 'India', state: 'Tamil Nadu', timezone: 'Asia/Kolkata' },
  'vellore, tn': { lat: 12.9165, lon: 79.1325, city: 'Vellore, Tamil Nadu', country: 'India', state: 'Tamil Nadu', timezone: 'Asia/Kolkata' },
  'chennai': { lat: 13.0827, lon: 80.2707, city: 'Chennai, Tamil Nadu', country: 'India', state: 'Tamil Nadu', timezone: 'Asia/Kolkata' },
  'bengaluru': { lat: 12.9716, lon: 77.5946, city: 'Bengaluru, Karnataka', country: 'India', state: 'Karnataka', timezone: 'Asia/Kolkata' },
  'bangalore': { lat: 12.9716, lon: 77.5946, city: 'Bengaluru, Karnataka', country: 'India', state: 'Karnataka', timezone: 'Asia/Kolkata' },
  'coimbatore': { lat: 11.0168, lon: 76.9558, city: 'Coimbatore, Tamil Nadu', country: 'India', state: 'Tamil Nadu', timezone: 'Asia/Kolkata' },
  'madurai': { lat: 9.9252, lon: 78.1198, city: 'Madurai, Tamil Nadu', country: 'India', state: 'Tamil Nadu', timezone: 'Asia/Kolkata' },
  'tiruchirappalli': { lat: 10.7905, lon: 78.7047, city: 'Tiruchirappalli, Tamil Nadu', country: 'India', state: 'Tamil Nadu', timezone: 'Asia/Kolkata' },
  'salem': { lat: 11.6643, lon: 78.1460, city: 'Salem, Tamil Nadu', country: 'India', state: 'Tamil Nadu', timezone: 'Asia/Kolkata' },
  'mumbai': { lat: 19.0760, lon: 72.8777, city: 'Mumbai, Maharashtra', country: 'India', state: 'Maharashtra', timezone: 'Asia/Kolkata' },
  'delhi': { lat: 28.6139, lon: 77.2090, city: 'Delhi', country: 'India', state: 'Delhi', timezone: 'Asia/Kolkata' },
  'new delhi': { lat: 28.6139, lon: 77.2090, city: 'New Delhi', country: 'India', state: 'Delhi', timezone: 'Asia/Kolkata' },
  'hyderabad': { lat: 17.3850, lon: 78.4867, city: 'Hyderabad, Telangana', country: 'India', state: 'Telangana', timezone: 'Asia/Kolkata' },
  'kolkata': { lat: 22.5726, lon: 88.3639, city: 'Kolkata, West Bengal', country: 'India', state: 'West Bengal', timezone: 'Asia/Kolkata' },
  'pune': { lat: 18.5204, lon: 73.8567, city: 'Pune, Maharashtra', country: 'India', state: 'Maharashtra', timezone: 'Asia/Kolkata' },
  'san francisco': { lat: 37.7749, lon: -122.4194, city: 'San Francisco, CA', country: 'USA', state: 'California', timezone: 'America/Los_Angeles' },
  'london': { lat: 51.5074, lon: -0.1278, city: 'London', country: 'UK', timezone: 'Europe/London' },
  'new york': { lat: 40.7128, lon: -74.0060, city: 'New York, NY', country: 'USA', state: 'New York', timezone: 'America/New_York' }
};

export async function resolveLocation(cityName: string): Promise<CityGeo> {
  const normalized = cityName.trim().toLowerCase();
  
  // 1. Direct match in KNOWN_CITIES
  if (KNOWN_CITIES[normalized]) {
    return KNOWN_CITIES[normalized];
  }
  
  // 2. Partial match check (e.g. "vellore district" or "vellore, india")
  for (const [key, geo] of Object.entries(KNOWN_CITIES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return geo;
    }
  }

  // 3. Dynamic lookup via Open-Meteo Geocoding API for global city search
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const res = await fetch(geoUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const top = data.results[0];
        const stateStr = top.admin1 ? `, ${top.admin1}` : '';
        return {
          lat: top.latitude,
          lon: top.longitude,
          city: `${top.name}${stateStr}`,
          country: top.country || 'India',
          state: top.admin1,
          timezone: top.timezone || 'auto'
        };
      }
    }
  } catch (err) {
    console.warn('Geocoding fetch failed, falling back to Vellore, Tamil Nadu default:', err);
  }

  // Default fallback: Vellore, Tamil Nadu
  return KNOWN_CITIES['vellore'];
}

export async function fetchLiveWeather(
  city: string = 'Vellore, Tamil Nadu', 
  lat?: number, 
  lon?: number
): Promise<WeatherData> {
  // Resolve city metadata & coordinates
  let targetLat: number;
  let targetLon: number;
  let resolvedCity = city;
  let resolvedCountry = 'India';
  let timezoneParam = 'Asia%2FKolkata';

  if (lat !== undefined && lon !== undefined) {
    targetLat = lat;
    targetLon = lon;
  } else {
    const geo = await resolveLocation(city);
    targetLat = geo.lat;
    targetLon = geo.lon;
    resolvedCity = geo.city;
    resolvedCountry = geo.country;
    if (geo.timezone) {
      timezoneParam = encodeURIComponent(geo.timezone);
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=precipitation_probability,uv_index&timezone=${timezoneParam}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }
    const data = await response.json();
    const current = data.current;
    const hourly = data.hourly || {};
    
    const weatherInfo = decodeWeatherCode(current.weather_code);
    const rainExpected = weatherInfo.isRain || (current.precipitation > 0.1) || ((hourly.precipitation_probability?.[0] || 0) > 25);
    const uv = hourly.uv_index?.[0] || 6.5;
    const temp = Math.round(current.temperature_2m);
    const apparentTemp = Math.round(current.apparent_temperature);
    const humidity = current.relative_humidity_2m ?? 68;
    const wind = Math.round(current.wind_speed_10m ?? 9);
    const rainProb = hourly.precipitation_probability?.[0] ?? (rainExpected ? 70 : 15);
    
    const recommendations: WeatherData['recommendations'] = [];

    // Tropical Rain / Monsoon protection
    if (rainExpected) {
      recommendations.push({
        category: 'weather-gear',
        item: 'Compact Umbrella & Waterproof Laptop Bag Cover',
        reason: `Precipitation forecasted in ${resolvedCity} (${weatherInfo.text.toLowerCase()}, ${rainProb}% rain chance). Shield electronics & books.`
      });
    }

    // Warm tropical climate hydration
    if (temp >= 28 || apparentTemp >= 30) {
      recommendations.push({
        category: 'preparation',
        item: 'Insulated Cold Water Bottle & Electrolytes',
        reason: `Warm tropical temperature (${temp}°C, feels like ${apparentTemp}°C). Maintain hydration throughout the day.`
      });
    } else if (temp >= 24) {
      recommendations.push({
        category: 'preparation',
        item: 'Insulated Water Bottle',
        reason: `Mild warm conditions (${temp}°C). Great habit to carry personal hydration.`
      });
    }

    // High Tropical UV Index
    if (uv >= 6.0) {
      recommendations.push({
        category: 'preparation',
        item: 'UV Sunglasses, Cap & Sunscreen (SPF 50)',
        reason: `High tropical UV Index (${uv.toFixed(1)}). Protect your eyes and skin during daytime outdoor hours.`
      });
    }

    // High tropical humidity
    if (humidity >= 72) {
      recommendations.push({
        category: 'weather-gear',
        item: 'Breathable Cotton Wear & Silica Gel Pack',
        reason: `Elevated humidity (${humidity}%). Keep electronic device charging ports dry and wear breathable lightweight fabrics.`
      });
    }

    // Mild cooler weather
    if (temp <= 18) {
      recommendations.push({
        category: 'weather-gear',
        item: 'Light Jacket or Evening Shawl',
        reason: `Cooler evening breeze outside (${temp}°C).`
      });
    }

    return {
      city: resolvedCity,
      country: resolvedCountry,
      temperature: temp,
      apparentTemperature: apparentTemp,
      weatherCode: current.weather_code,
      conditionText: weatherInfo.text,
      isRainExpected: rainExpected,
      precipitationProbability: rainProb,
      humidity,
      uvIndex: Math.round(uv * 10) / 10,
      windSpeed: wind,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendations
    };
  } catch (error) {
    console.warn('Using reliable Vellore, Tamil Nadu fallback weather due to network / offline state:', error);
    // Reliable realistic default for Vellore, Tamil Nadu if offline
    return {
      city: resolvedCity.includes('Vellore') ? 'Vellore, Tamil Nadu' : resolvedCity,
      country: resolvedCountry,
      temperature: 30,
      apparentTemperature: 34,
      weatherCode: 2,
      conditionText: 'Partly cloudy with warm tropical breeze',
      isRainExpected: false,
      precipitationProbability: 20,
      humidity: 72,
      uvIndex: 7.2,
      windSpeed: 10,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendations: [
        {
          category: 'preparation',
          item: 'Insulated Cold Water Bottle & Electrolytes',
          reason: 'Warm tropical daytime climate in Vellore (30°C / feels like 34°C). Stay well hydrated.'
        },
        {
          category: 'weather-gear',
          item: 'Compact Umbrella & Waterproof Laptop Bag Cover',
          reason: 'Passing tropical clouds and humidity (72%). Safeguard laptops and gadgets.'
        },
        {
          category: 'preparation',
          item: 'UV Sunglasses & Sun Protection',
          reason: 'High tropical UV index (7.2). Protect eyes and skin during midday hours.'
        }
      ]
    };
  }
}
