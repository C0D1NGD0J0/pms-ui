import React from "react";

import { InsightCard } from "../insightCard";

export interface InsightData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down" | "none";
    period?: string;
  };
  description?: string | React.ReactNode;
  className?: string;
}

interface InsightCardListProps {
  insights: InsightData[];
  className?: string;
}

export const InsightCardList: React.FC<InsightCardListProps> = ({
  insights,
  className = "",
}) => {
  return (
    <div className={`insights ${className}`}>
      {insights.map((insight, index) => (
        <InsightCard
          key={index}
          title={insight.title}
          value={insight.value}
          icon={insight.icon}
          trend={insight.trend}
          description={insight.description}
          className={insight.className}
        />
      ))}
    </div>
  );
};
