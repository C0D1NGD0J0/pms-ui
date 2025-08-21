import React from "react";

import {
  HorizontalBarChart,
  LineChartComponent,
  VerticalBarChart,
  DonutChart,
} from "./index";

interface LegendItem {
  name: string;
  color: string;
  value?: string | number;
  percentage?: string | number;
}

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface ChartContainerProps {
  // Chart configuration
  type: "donut" | "verticalBar" | "horizontalBar" | "line";
  data: ChartData[];
  height?: number;
  width?: string | number;
  colors?: string[];

  // Chart-specific props
  chartProps?: {
    donutchart?: {
      innerRadius?: number | string;
      outerRadius?: number | string;
      showTotal?: boolean;
      showTooltip?: boolean;
    };

    // Bar chart props
    barChart?: {
      valueKey?: string;
      nameKey?: string;
      barSize?: number;
      showGrid?: boolean;
      showAxis?: boolean;
    };

    // Line chart props
    lineChart?: {
      dataKeys?: string[];
      xAxisKey?: string;
      showDots?: boolean;
      smooth?: boolean;
    };
  };

  // Container props
  className?: string;
  title?: string;

  // Legend configuration
  showLegend?: boolean;
  legend?: LegendItem[];
  customLegend?: React.ReactNode;

  // Empty state
  emptyStateMessage?: string;
  emptyStateIcon?: React.ReactNode;
  customEmptyState?: React.ReactNode;

  // Loading state
  isLoading?: boolean;
  loadingMessage?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  type,
  data,
  height = 300,
  width = "100%",
  colors,
  chartProps = {},
  className = "",
  title,
  showLegend = false,
  legend,
  customLegend,
  emptyStateMessage = "No data available",
  emptyStateIcon,
  customEmptyState,
  isLoading = false,
  loadingMessage = "Loading chart data...",
}) => {
  const renderChart = () => {
    const baseProps = {
      data,
      height,
      width,
      colors,
    };

    switch (type) {
      case "donut":
        return <DonutChart {...baseProps} {...chartProps} />;
      case "verticalBar":
        return <VerticalBarChart {...baseProps} {...chartProps} />;
      case "horizontalBar":
        return <HorizontalBarChart {...baseProps} {...chartProps} />;
      case "line":
        // LineChart requires dataKeys, so we need to handle it specially
        const lineChartProps =
          chartProps && "lineChart" in chartProps
            ? chartProps.lineChart
            : undefined;
        const lineProps = {
          ...baseProps,
          dataKeys: lineChartProps?.dataKeys || ["value"], // Default fallback
          ...(lineChartProps && {
            xAxisKey: lineChartProps.xAxisKey,
            showDots: lineChartProps.showDots,
            smooth: lineChartProps.smooth,
          }),
        };
        return <LineChartComponent {...lineProps} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className={`chart-container ${className}`}>
        {title && <div className="chart-title">{title}</div>}
        <div className="chart-loading-state">
          <div className="loading-spinner">
            <i className="bx bx-loader-alt bx-spin"></i>
          </div>
          <p>{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`chart-container ${className}`}>
        {title && <div className="chart-title">{title}</div>}
        {customEmptyState || (
          <div className="empty-chart-state">
            {emptyStateIcon || <i className="bx bx-bar-chart-alt-2"></i>}
            <p>{emptyStateMessage}</p>
          </div>
        )}
      </div>
    );
  }

  // Render chart with data
  return (
    <div className={`chart-container ${className}`}>
      {title && <div className="chart-title">{title}</div>}

      <div className="chart-content">
        <div className="chart-wrapper">{renderChart()}</div>

        {/* Legend Section */}
        {showLegend && (legend || customLegend) && (
          <div className="chart-legend">
            {customLegend || (
              <>
                {legend?.map((item, index) => (
                  <div key={`legend-${index}`} className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="legend-text">
                      {item.name}
                      {item.value !== undefined && ` (${item.value})`}
                      {item.percentage !== undefined &&
                        ` - ${item.percentage}%`}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
