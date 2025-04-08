import React from "react";
import { DEFAULT_COLOR_ARRAY } from "@components/Charts";

type IProps = {
  title: string;
  showLegend?: boolean;
  data: Array<{ [key: string]: any }>;
  colors?: string[];
  nameKey?: string;
  valueKey?: string;
  children?: React.ReactNode;
};

export function AnalyticCard({
  title,
  showLegend,
  data,
  colors = DEFAULT_COLOR_ARRAY,
  nameKey = "name",
  valueKey = "value",
  children,
}: IProps) {
  return (
    <div className="analytics-card">
      <div className="analytics-header">
        <h4>{title}</h4>
      </div>

      {children}
      {showLegend && children && (
        <div className="chart-container">
          <div className="chart-legend">
            {data.map((entry, index) => (
              <div key={`legend-${index}`} className="legend-item">
                <span
                  className="legend-color"
                  style={{
                    background: colors[index % colors.length],
                  }}
                ></span>
                <span>
                  {entry[nameKey]} ({entry[valueKey]}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
