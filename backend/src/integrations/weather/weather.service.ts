import { logger } from '../../utils/logger';

export interface WeatherData {
  city: string;
  temperature: number; // in Celsius
  condition: string; // e.g. 'Clear', 'Rainy', 'Cloudy', 'Humid', 'Cold', 'Warm'
  humidity: number; // percentage
  windSpeed: number; // km/h
  isRainy: boolean;
  isHot: boolean;
  isCold: boolean;
  stylingAdvice: string;
  recommendedFabrics: string[];
}

export class WeatherService {
  /**
   * Fetch current weather data for location or default coordinates
   */
  public static async getCurrentWeather(
    latitude: number = 28.6139,
    longitude: number = 77.2090,
    cityName: string = 'New Delhi'
  ): Promise<WeatherData> {
    try {
      // Use Open-Meteo open API (free, reliable, requires no authentication key)
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
      
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (response.ok) {
        const data = await response.json();
        const current = data.current;
        const temp = Math.round(current.temperature_2m);
        const humidity = Math.round(current.relative_humidity_2m);
        const wind = Math.round(current.wind_speed_10m);
        const code = current.weather_code;

        let condition = 'Clear';
        let isRainy = false;

        if (code >= 51 && code <= 67) {
          condition = 'Rainy';
          isRainy = true;
        } else if (code >= 71 && code <= 86) {
          condition = 'Cold & Snowy';
        } else if (code >= 1 && code <= 3) {
          condition = 'Partly Cloudy';
        } else if (code >= 45 && code <= 48) {
          condition = 'Foggy / Overcast';
        } else if (temp > 30) {
          condition = 'Warm & Humid';
        }

        const isHot = temp > 28;
        const isCold = temp < 18;

        let stylingAdvice = 'Comfortable weather for versatile smart casual layering.';
        let recommendedFabrics = ['Cotton', 'Linen', 'Denim'];

        if (isHot) {
          stylingAdvice = 'High temperature detected: Opt for lightweight, breathable fabrics and light reflective tones.';
          recommendedFabrics = ['100% Cotton', 'Pure Linen', 'Chambray'];
        } else if (isCold) {
          stylingAdvice = 'Chilly weather: Layer with a structured trench or wool overcoat over knitwear.';
          recommendedFabrics = ['Merino Wool', 'Cashmere', 'Heavy Denim', 'Flannel'];
        } else if (isRainy) {
          stylingAdvice = 'Wet weather: Choose water-resistant footwear and dark tapered trousers to avoid splash stains.';
          recommendedFabrics = ['Water-resistant Nylon', 'Treated Cotton', 'Gore-Tex'];
        }

        return {
          city: cityName,
          temperature: temp,
          condition,
          humidity,
          windSpeed: wind,
          isRainy,
          isHot,
          isCold,
          stylingAdvice,
          recommendedFabrics,
        };
      }
    } catch (error) {
      logger.warn('External weather API unavailable, applying localized climate fallback.');
    }

    // Default fallback
    return {
      city: cityName,
      temperature: 27,
      condition: 'Pleasant & Warm',
      humidity: 55,
      windSpeed: 12,
      isRainy: false,
      isHot: false,
      isCold: false,
      stylingAdvice: 'Comfortable climate: Pair crisp cotton shirts with lightweight tailored chinos.',
      recommendedFabrics: ['Breathable Cotton', 'Linen Blend'],
    };
  }
}
