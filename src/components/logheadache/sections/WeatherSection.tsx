import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CloudRain, Sun, RefreshCw, ThermometerIcon, MapPin, AlertTriangle, Settings } from "lucide-react";
import { getCurrentWeather, WeatherData, isPotentialWeatherTrigger, checkLocationPermission, LocationPermissionStatus } from "@/utils/weatherApi";
import { useTestContext } from "@/contexts/TestContext";

interface WeatherSectionProps {
  onWeatherCapture?: (weatherTrigger: string) => void;
}

export function WeatherSection({ onWeatherCapture }: WeatherSectionProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<LocationPermissionStatus>('prompt');
  const [showPermissionInfo, setShowPermissionInfo] = useState(false);
  const { premiumFeatures } = useTestContext();
  
  // Check if weather tracking is enabled in premium features
  const isEnabled = premiumFeatures.weather_tracking;

  // Check location permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      const status = await checkLocationPermission();
      setLocationPermission(status);
      if (status === 'denied') {
        setShowPermissionInfo(true);
      }
    };
    if (isEnabled) {
      checkPermission();
    }
  }, [isEnabled]);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getCurrentWeather();
      setWeatherData(data);
      setLocationPermission('granted');
      setShowPermissionInfo(false);
      
      // Notify parent component of weather data for persistence
      if (data && onWeatherCapture) {
        const weatherTrigger = `Weather: ${data.condition}, ${data.temperature}°C, ${data.humidity}% humidity, ${data.pressure}hPa`;
        onWeatherCapture(weatherTrigger);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage === 'LOCATION_DENIED') {
        setLocationPermission('denied');
        setShowPermissionInfo(true);
        setError("Location access was denied.");
      } else if (errorMessage === 'LOCATION_UNSUPPORTED') {
        setLocationPermission('unsupported');
        setError("Your browser doesn't support location services.");
      } else {
        setError("Failed to fetch weather data. Please try again.");
      }
      console.error("Weather fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEnabled && locationPermission !== 'denied' && locationPermission !== 'unsupported') {
      fetchWeatherData();
    }
  }, [isEnabled]);

  // Get appropriate icon based on weather condition
  const getWeatherIcon = () => {
    if (!weatherData) return <CloudRain className="h-8 w-8 text-blue-500" />;
    
    switch (weatherData.condition.toLowerCase()) {
      case "sunny":
      case "partly cloudy":
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case "rainy":
      case "stormy":
      case "snowy":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <CloudRain className="h-8 w-8 text-muted-foreground" />;
    }
  };

  if (!isEnabled) {
    return null; // Don't render if not enabled in premium features
  }

  return (
    <Card className="mb-4">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-foreground">Current Weather</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchWeatherData}
            disabled={isLoading || locationPermission === 'unsupported'}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        
        {/* Location Permission Request Notice */}
        {locationPermission === 'prompt' && !weatherData && !isLoading && (
          <Alert className="bg-primary/10 border-primary/20">
            <MapPin className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              <p className="font-medium mb-1">Location access needed</p>
              <p className="text-sm text-muted-foreground mb-2">
                To provide accurate weather data that may correlate with your headaches, 
                we need access to your location. Your location is only used to fetch weather 
                data and is not stored.
              </p>
              <Button 
                size="sm" 
                onClick={fetchWeatherData}
                className="mt-1"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Allow Location Access
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Location Denied Info */}
        {showPermissionInfo && locationPermission === 'denied' && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <p className="font-medium mb-1">Location access was denied</p>
              <p className="text-sm mb-3">
                To re-enable location access:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 mb-3">
                <li>Click the <Settings className="h-3 w-3 inline mx-1" /> lock/settings icon in your browser's address bar</li>
                <li>Find "Location" in the site settings</li>
                <li>Change it from "Block" to "Allow"</li>
                <li>Refresh this page</li>
              </ul>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchWeatherData}
                className="border-yellow-300 hover:bg-yellow-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Location Access
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {error && locationPermission !== 'denied' ? (
          <div className="text-center py-4">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchWeatherData}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : weatherData ? (
          <div className="rounded-lg bg-muted/50 p-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getWeatherIcon()}
                <div>
                  <p className="text-lg font-medium text-foreground capitalize">{weatherData.condition}</p>
                  <p className="text-sm text-muted-foreground">{weatherData.location || "Current Location"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl font-semibold text-foreground">{weatherData.temperature}°</span>
                <span className="text-muted-foreground text-sm">C</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <ThermometerIcon className="h-4 w-4" />
                <span>Humidity: {weatherData.humidity}%</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <CloudRain className="h-4 w-4" />
                <span>Pressure: {weatherData.pressure} hPa</span>
              </div>
            </div>
            
            {isPotentialWeatherTrigger(weatherData) && (
              <div className="mt-3 py-2 px-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                This weather pattern may trigger headaches based on common triggers.
              </div>
            )}
          </div>
        ) : !showPermissionInfo && locationPermission !== 'prompt' && (
          <div className="text-center py-8 text-muted-foreground">
            <CloudRain className="h-10 w-10 mx-auto mb-2" />
            <p>Loading weather data...</p>
          </div>
        )}
      </div>
    </Card>
  );
}
