"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { ChartDataPoint } from "./LineChartCard";

type BarChartCardProps = {
  title: string;
  description: string;
  data: ChartDataPoint[];
  config: ChartConfig;
  dataKey: string;
  footerText?: string;
};

const BarChartCard = ({
  title,
  description,
  data,
  config,
  dataKey,
  footerText,
}: BarChartCardProps) => {
  if (!data.length) {
    return null;
  }

  return (
    <Card className="h-full w-full p-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} opacity={0.2} />
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
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={{ fill: "var(--color-chart-1-alpha)" }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey={dataKey}
              radius={[4, 4, 0, 0]}
              fill="var(--color-chart-1)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {footerText && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="text-muted-foreground leading-none">{footerText}</div>
        </CardFooter>
      )}
    </Card>
  );
};

export default BarChartCard;
