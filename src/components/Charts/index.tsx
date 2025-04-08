import React from "react";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
  LineChart,
  PieChart,
  BarChart,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  Cell,
  Line,
  Pie,
  Bar,
} from "recharts";

// Type definitions for better TypeScript support
interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any; // Allow for additional properties
}

interface ChartProps {
  data: ChartDataPoint[];
  height?: number;
  width?: string | number;
  className?: string;
  colors?: string[];
  title?: string;
  showLegend?: boolean;
}

interface DonutChartProps extends ChartProps {
  innerRadius?: number | string;
  outerRadius?: number | string;
  valueKey?: string;
  nameKey?: string;
  showLabels?: boolean;
  showTooltip?: boolean;
  showTotal?: boolean;
  totalLabel?: string;
}

interface BarChartProps extends ChartProps {
  layout?: "horizontal" | "vertical";
  valueKey?: string;
  nameKey?: string;
  barSize?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

interface LineChartProps extends ChartProps {
  dataKeys: string[];
  xAxisKey?: string;
  showGrid?: boolean;
  showDots?: boolean;
  smooth?: boolean;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

// Using your existing color palette from CSS
const DEFAULT_COLORS = {
  primary: "hsl(194, 66%, 24%)",
  secondary: "hsl(39, 73%, 49%)",
  warning: "hsl(37, 100%, 67%)",
  danger: "hsl(0, 100%, 50%)",
  success: "hsl(130, 100%, 37%)",
  muted: "hsl(213, 14%, 56%)",
};

// Default color array for consistent use across charts
export const DEFAULT_COLOR_ARRAY = [
  DEFAULT_COLORS.primary,
  DEFAULT_COLORS.secondary,
  DEFAULT_COLORS.success,
  DEFAULT_COLORS.warning,
  DEFAULT_COLORS.danger,
  DEFAULT_COLORS.muted,
];

// Custom Tooltip for charts
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`tooltip-${index}`}
            className={`tooltip-value ${entry.name?.toString().toLowerCase()}`}
          >
            {entry.name}: {entry.value}
            {typeof entry.payload[entry.dataKey as string] === "number" &&
            entry.unit
              ? entry.unit
              : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Prop types for chart components
interface ChartProps {
  data: ChartDataPoint[];
  height?: number;
  className?: string;
}

export const DonutChart = ({
  data,
  height = 250,
  width = "100%",
  colors = DEFAULT_COLOR_ARRAY,
  valueKey = "value",
  nameKey = "name",
  innerRadius = "50%",
  outerRadius = "80%",
  showLabels = false,
  showTooltip = true,
  showTotal = true,
}: DonutChartProps) => {
  // Calculate total for center label
  const total = data.reduce((sum, item) => sum + (item[valueKey] || 0), 0);

  return (
    <ResponsiveContainer width={width} height={height}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey={valueKey}
          nameKey={nameKey}
          label={showLabels}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              stroke="none"
            />
          ))}
        </Pie>
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        {showTotal && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="donut-center"
          >
            {total}
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export const HorizontalBarChart = ({
  data,
  height = 250,
  width = "100%",
  colors = [DEFAULT_COLOR_ARRAY[0]],
  valueKey = "value",
  nameKey = "name",
  barSize = 30,
  showAxis = true,
  margin = { top: 10, right: 10, bottom: 20, left: 20 },
  showLegend = false,
}: BarChartProps) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data} layout="vertical" margin={margin}>
        <XAxis type="number" hide={!showAxis} />
        <YAxis
          type="category"
          dataKey={nameKey}
          hide={!showAxis}
          width={100}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        <Bar
          dataKey={valueKey}
          fill={colors[0]}
          barSize={barSize}
          radius={[0, 4, 4, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const VerticalBarChart = ({
  data,
  height = 250,
  width = "100%",
  colors = DEFAULT_COLOR_ARRAY,
  valueKey = "value",
  nameKey = "name",
  barSize = 20,
  showGrid = true,
  showAxis = true,
  margin = { top: 10, right: 10, bottom: 20, left: 20 },
  showLegend = false,
}: BarChartProps) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data} margin={margin}>
        <XAxis dataKey={nameKey} hide={!showAxis} />
        <YAxis hide={!showAxis} />
        {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        <Bar
          dataKey={valueKey}
          fill={colors[0]}
          barSize={barSize}
          radius={[4, 4, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const LineChartComponent = ({
  data,
  dataKeys,
  xAxisKey = "name",
  height = 250,
  width = "100%",
  colors = DEFAULT_COLOR_ARRAY,
  showGrid = true,
  showDots = true,
  smooth = false,
  margin = { top: 10, right: 10, bottom: 20, left: 20 },
  showLegend = true,
}: LineChartProps) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data} margin={margin}>
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            formatter={(value, entry, index) => {
              return (
                <span className="legend-item">
                  <span
                    className={`legend-color ${value.toLowerCase()}`}
                    style={{ background: colors[index % colors.length] }}
                  ></span>
                  <span>{value}</span>
                </span>
              );
            }}
          />
        )}
        {dataKeys.map((dataKey, index) => (
          <Line
            key={`line-${dataKey}`}
            type={smooth ? "monotone" : "linear"}
            dataKey={dataKey}
            name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={showDots}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
