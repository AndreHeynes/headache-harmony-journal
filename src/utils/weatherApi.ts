
/**
 * Weather API Integration
 * 
 * Provides weather data that may correlate with headache triggers
 */

import { apiClient } from './apiClient';

export interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
  pressure: number;
  location?: string;
  timestamp: string;
}

// This would be replaced with a real API key in a production app
// For a real app, this would be stored in Supabase secrets
const DEMO_API_KEY = 'demo_weather_api_key';

/**
 * Get current weather based on user location
 */
export const getCurrentWeather = async (): Promise<WeatherData> => {
  try {
    // Get user location
    const position = await getUserLocation();
    
    // In a real implementation, this would call an actual weather API
    // For demo purposes, we'll return mock data
    
    // This is where we would make the actual API call
    // const response = await apiClient.get(
    //   `https://api.weatherapi.com/v1/current.json?key=${DEMO_API_KEY}&q=${position.latitude},${position.longitude}`
    // );
    
    // Demo data
    return {
      condition: getRandomWeatherCondition(),
      temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
      humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
      pressure: Math.floor(Math.random() * 50) + 980, // 980-1030 hPa
      location: "Current Location",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Failed to get weather data:", error);
    return {
      condition: "unknown",
      temperature: 20,
      humidity: 50,
      pressure: 1013,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Get user's geolocation
 */
const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  });
};

/**
 * Get a random weather condition for demo purposes
 */
const getRandomWeatherCondition = (): string => {
  const conditions = [
    "sunny",
    "partly cloudy",
    "cloudy",
    "overcast",
    "rainy",
    "stormy",
    "snowy",
    "foggy",
    "windy"
  ];
  
  return conditions[Math.floor(Math.random() * conditions.length)];
};

/**
 * Check if the current weather might be a trigger
 * This would be based on user's historical data in a real app
 */
export const isPotentialWeatherTrigger = (data: WeatherData): boolean => {
  // In a real app, this would compare against user's historical data
  // For demo, we'll consider pressure changes and certain conditions as potential triggers
  
  const triggerConditions = ["stormy", "rainy", "windy"];
  const pressureChangeTrigger = data.pressure < 1000 || data.pressure > 1020;
  
  return triggerConditions.includes(data.condition) || pressureChangeTrigger;
};
