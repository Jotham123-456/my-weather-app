import LoadingSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import FavoriteCities from "@/components/FavoriteCities";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { AlertTriangle, MapPin, RefreshCcw } from "lucide-react";
import CurrentWeather from "@/components/current-weather";
import HourlyTemp from "@/components/hourly-temp";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import type { GeocodingResponse } from "@/API/types";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();

  const locationQuery = useReverseGeocodeQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const weatherQuery = useWeatherQuery(coordinates);

  // const weather = weatherQuery.data;
  // console.log("Current Weather:", weather);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      locationQuery.refetch();
      forecastQuery.refetch();
      weatherQuery.refetch();
    }
  };

  if (locationLoading) {
    return <LoadingSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle />
        <AlertTitle>Location error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button variant="outline" onClick={getLocation}>
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location services to see your current weather.</p>
          <Button variant="outline" onClick={getLocation}>
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName: GeocodingResponse | undefined = locationQuery.data?.[0];

  if (weatherQuery.error) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to retrieve weather data.</p>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-1">
      {/* Fav cities */}

      <FavoriteCities />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCcw
            className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {/* current weather */}
      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />

          <HourlyTemp data={forecastQuery.data} />
        </div>

        {/* weather details and forecast */}
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data} />

          {/* forecast */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
