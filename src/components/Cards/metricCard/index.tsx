import React from "react";

export interface MetricCardProps {
  value: string | number;
  label: string;
  subText?: string;
  variant?: "basic" | "icon" | "detailed";
  icon?: React.ReactNode;
  trend?: {
    value: string;
    direction: "positive" | "negative" | "neutral";
    period?: string;
  };
  description?: string | React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  variant = "basic",
  icon,
  trend,
  description,
  className = "",
  subText = "",
  onClick,
}) => {
  const baseClass = "metric-card";
  const variantClass = `metric-card__${variant}`;
  const clickableClass = onClick ? "metric-card__clickable" : "";

  return (
    <div
      className={`${baseClass} ${variantClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {(variant === "icon" || variant === "detailed") && icon && (
        <div className="metric-card__icon">{icon}</div>
      )}

      <div className="metric-card__content">
        <div className="metric-card__value">{value}</div>
        <div className="metric-card__label">{label}</div>
        {subText && <div className="metric-card__subtext">{subText}</div>}
        {trend && (
          <div className="metric-card__trend">
            <span
              className={`metric-card__trend-value metric-card__trend-value__${trend.direction}`}
            >
              {trend.direction === "positive" && (
                <i className="bx bx-trending-up"></i>
              )}
              {trend.direction === "negative" && (
                <i className="bx bx-trending-down"></i>
              )}
              {trend.value}
            </span>
            {trend.period && (
              <span className="metric-card__trend-period">{trend.period}</span>
            )}
          </div>
        )}

        {variant === "detailed" && description && (
          <div className="metric-card__description">{description}</div>
        )}
      </div>
    </div>
  );
};
