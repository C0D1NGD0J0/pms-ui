import { render, screen } from "@tests/utils/test-utils";
import { PropertyMetrics, MetricData } from "@components/Property/PropertyMetrics";

const mockMetrics: MetricData[] = [
  {
    value: "12",
    label: "Total Properties",
    change: {
      value: "+2",
      trend: "positive",
    },
  },
  {
    value: "156",
    label: "Active Tenants",
    change: {
      value: "-3",
      trend: "negative",
    },
  },
  {
    value: "$45,600",
    label: "Monthly Revenue",
    change: {
      value: "0%",
      trend: "neutral",
    },
  },
  {
    value: "94%",
    label: "Occupancy Rate",
  },
];

describe("PropertyMetrics Component", () => {
  it("renders all metrics", () => {
    render(<PropertyMetrics metrics={mockMetrics} />);

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Total Properties")).toBeInTheDocument();
    expect(screen.getByText("156")).toBeInTheDocument();
    expect(screen.getByText("Active Tenants")).toBeInTheDocument();
    expect(screen.getByText("$45,600")).toBeInTheDocument();
    expect(screen.getByText("Monthly Revenue")).toBeInTheDocument();
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
  });

  it("renders trends when provided", () => {
    render(<PropertyMetrics metrics={mockMetrics} />);

    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getByText("-3")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("handles metrics without trends", () => {
    const metricsWithoutTrend = mockMetrics.filter(m => !m.change);
    render(<PropertyMetrics metrics={metricsWithoutTrend} />);

    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
  });

  it("renders empty metrics array", () => {
    const { container } = render(<PropertyMetrics metrics={[]} />);

    const metricsContainer = container.querySelector(".property-metrics");
    expect(metricsContainer).toBeInTheDocument();
    expect(metricsContainer).toBeEmptyDOMElement();
  });

  it("uses basic variant for all metric cards", () => {
    const { container } = render(<PropertyMetrics metrics={mockMetrics} />);

    const metricCards = container.querySelectorAll(".metric-card__basic");
    expect(metricCards).toHaveLength(mockMetrics.length);
  });

  it("has correct container structure", () => {
    const { container } = render(<PropertyMetrics metrics={mockMetrics} />);

    expect(container.querySelector(".property-metrics")).toBeInTheDocument();
  });

  it("handles numeric and string values", () => {
    const mixedMetrics: MetricData[] = [
      { value: 42, label: "Number Value" },
      { value: "String Value", label: "Text Value" },
    ];

    render(<PropertyMetrics metrics={mixedMetrics} />);

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("String Value")).toBeInTheDocument();
  });

  it("renders correct number of metric cards", () => {
    const { container } = render(<PropertyMetrics metrics={mockMetrics} />);

    const metricCards = container.querySelectorAll(".metric-card");
    expect(metricCards).toHaveLength(4);
  });

  it("passes trend data correctly to MetricCard", () => {
    const singleMetric: MetricData[] = [
      {
        value: "100",
        label: "Test Metric",
        change: {
          value: "+5%",
          trend: "positive",
        },
      },
    ];

    render(<PropertyMetrics metrics={singleMetric} />);

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Test Metric")).toBeInTheDocument();
    expect(screen.getByText("+5%")).toBeInTheDocument();
  });
});