"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
};

const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) => {
  return (
    <Card className="w-full p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <Icon className="text-muted-foreground h-4 w-4" aria-hidden="true" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-muted-foreground text-xs">
            {trend && (
              <span
                className={trend.isPositive ? "text-green-500" : "text-red-500"}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value}%{" "}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
