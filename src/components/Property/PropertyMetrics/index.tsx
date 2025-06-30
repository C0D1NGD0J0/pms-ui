import React from "react";
import { MetricCard } from "@components/Cards";

export interface MetricData {
  value: string | number;
  label: string;
  change?: {
    value: string;
    trend: "positive" | "negative" | "neutral";
  };
}

export interface PropertyMetricsProps {
  metrics: MetricData[];
}

export function PropertyMetrics({ metrics }: PropertyMetricsProps) {
  return (
    <div className="property-metrics">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          variant="basic"
          value={metric.value}
          label={metric.label}
          trend={
            metric.change
              ? {
                  value: metric.change.value,
                  direction: metric.change.trend,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
