import type { ForecastData } from "@/API/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { format } from "date-fns";

interface HourlyTempProps {
  data: ForecastData;
}

const HourlyTemp = ({ data }: HourlyTempProps) => {
  const chartData = data.list.slice(0, 8).map((item) => ({
    time: format(new Date(item.dt * 1000), "ha"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  }));

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Hourly Temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-50 w-full">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />

              {/* TOOLTIP */}
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-md border bg-background p-2 shadow-md">
                        <div className="flex flex-col">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Temperature
                            </span>
                            <span className="font-bold">
                              {payload[0].value}°
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Feels Like
                            </span>
                            <span className="font-bold">
                              {payload[1].value}°
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                }}
              />

              <Line
                type="monotone"
                dataKey="temp"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#64748b"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyTemp;
