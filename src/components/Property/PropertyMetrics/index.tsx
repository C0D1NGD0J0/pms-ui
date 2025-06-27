import React from "react";

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
        <div key={index} className="metric-card">
          <div className="metric-value">{metric.value}</div>
          <div className="metric-label">{metric.label}</div>
          {metric.change && (
            <div className={`metric-change ${metric.change.trend}`}>
              {metric.change.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
