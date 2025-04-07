import React from "react";

interface InsightCardProps {
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

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  className = "",
}) => {
  return (
    <div className={`insight-card ${className}`}>
      <div className="icon-container">{icon}</div>
      <div className="insight-card__content">
        <div className="title">{title}</div>
        <div className="value">{value}</div>
        {trend && (
          <div className="trend">
            {trend.direction !== "none" && (
              <span className={`trend-${trend.direction}`}>
                <i className={`bx bx-${trend.direction}-arrow-alt`}></i>{" "}
                {trend.value}
              </span>
            )}
            {trend.period && (
              <span className="trend-period">{trend.period}</span>
            )}
          </div>
        )}
        {description && (
          <div className="card-trend">
            <span className="trend-period">{description}</span>
          </div>
        )}
      </div>
    </div>
  );
};
