"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type ChartDataPoint = {
  month: string;
  sales: number;
};

type LineChartCardProps = {
  title: string;
  description: string;
  data: ChartDataPoint[];
  config: ChartConfig;
  trendingValue?: string;
  footerText?: string;
  dataKey?: string;
};

const LineChartCard = ({
  title,
  description,
  data,
  config,
  trendingValue,
  footerText,
  dataKey = "sales", // Default to sales if not specified
}: LineChartCardProps) => {
  if (!data.length) {
    return null;
  }

  return (
    <Card className="w-full p-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                // Handle Vietnamese month format (e.g., "Tháng 1" becomes "Th1")
                if (value.startsWith("Tháng")) {
                  return `Th${value.split(" ")[1]}`;
                }
                // Handle English month format
                return value.slice(0, 3);
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey={dataKey}
              type="natural"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {trendingValue && (
          <div className="flex gap-2 leading-none font-medium">
            Tăng {trendingValue} so với tháng trước{" "}
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
          </div>
        )}
        {footerText && (
          <div className="text-muted-foreground leading-none">{footerText}</div>
        )}
      </CardFooter>
    </Card>
  );
};

export default LineChartCard;
