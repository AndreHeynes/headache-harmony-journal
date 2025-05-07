
import { WeatherData } from './types';
import { toast } from "sonner";

export const fetchWeatherData = async (): Promise<WeatherData> => {
  try {
    // Note: In a real app, you'd want to handle location permission and use a real weather API
    // This is just a mock implementation
    return {
      condition: 'sunny',
      temperature: 22,
      humidity: 45
    };
  } catch (error) {
    toast("Weather data unavailable", {
      description: "Using manual weather input instead"
    });
    throw error;
  }
};
