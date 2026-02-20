import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useWeatherQuery, useForecastQuery } from "@/hooks/use-weather";
// import { Alert, AlertDescription, AlertTriangle } from "@/components/ui/alert";
// import { FavoriteButton } from "@/components/favorite-button";

import CurrentWeather from "@/components/current-weather";
import HourlyTemp from "@/components/hourly-temp";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import LoadingSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import FavoriteBtn from "@/components/favorite-btn";

// time
const getCityTime = (timezoneOffset: number) => {
  const now = new Date();

  // Convert current time to UTC
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;

  // Add city offset (seconds → milliseconds)
  return new Date(utc + timezoneOffset * 1000);
};

const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <LoadingSkeleton />;
  }

  const timezone = weatherQuery.data?.timezone;

  const cityTime = timezone ? getCityTime(timezone).toLocaleTimeString() : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
          {cityTime && (
            <span className="ml-4 text-sm text-muted-foreground">
              {cityTime}
            </span>
          )}
        </h1>

        <div className="flex gap-2">
          <FavoriteBtn data={{ ...weatherQuery.data, name: params.cityName }} />
        </div>
      </div>

      <div className="grid gap-6">
        <CurrentWeather data={weatherQuery.data} />
        <HourlyTemp data={forecastQuery.data} />
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default CityPage;
