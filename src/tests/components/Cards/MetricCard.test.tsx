import { render } from "@tests/utils/test-utils";
import { MetricCard } from "@components/Cards/metricCard";
import { fireEvent, screen } from "@testing-library/react";

describe("MetricCard Component", () => {
  const defaultProps = {
    value: "100",
    label: "Total Users",
  };

  it("renders basic metric card with value and label", () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Total Users")).toBeInTheDocument();
  });

  it("renders with number value", () => {
    render(<MetricCard value={250} label="Active Users" />);

    expect(screen.getByText("250")).toBeInTheDocument();
    expect(screen.getByText("Active Users")).toBeInTheDocument();
  });

  it("renders basic variant by default", () => {
    const { container } = render(<MetricCard {...defaultProps} />);

    const card = container.firstChild;
    expect(card).toHaveClass("metric-card metric-card__basic");
  });

  it("renders icon variant with icon", () => {
    const icon = <span data-testid="test-icon">👤</span>;
    render(<MetricCard {...defaultProps} variant="icon" icon={icon} />);

    const card = screen.getByTestId("test-icon").closest(".metric-card");
    expect(card).toHaveClass("metric-card__icon");
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("renders detailed variant with description", () => {
    const description = "This shows the total number of registered users";
    render(
      <MetricCard
        {...defaultProps}
        variant="detailed"
        description={description}
      />
    );

    const card = screen.getByText(description).closest(".metric-card");
    expect(card).toHaveClass("metric-card__detailed");
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("renders with positive trend", () => {
    const trend = {
      value: "+12%",
      direction: "positive" as const,
      period: "vs last month",
    };

    render(<MetricCard {...defaultProps} trend={trend} />);

    expect(screen.getByText("+12%")).toBeInTheDocument();
    expect(screen.getByText("vs last month")).toBeInTheDocument();

    const trendElement = screen.getByText("+12%");
    expect(trendElement).toHaveClass("metric-card__trend-value__positive");
  });

  it("renders with negative trend", () => {
    const trend = {
      value: "-5%",
      direction: "negative" as const,
      period: "vs last week",
    };

    render(<MetricCard {...defaultProps} trend={trend} />);

    expect(screen.getByText("-5%")).toBeInTheDocument();
    expect(screen.getByText("vs last week")).toBeInTheDocument();

    const trendElement = screen.getByText("-5%");
    expect(trendElement).toHaveClass("metric-card__trend-value__negative");
  });

  it("renders with neutral trend", () => {
    const trend = {
      value: "0%",
      direction: "neutral" as const,
    };

    render(<MetricCard {...defaultProps} trend={trend} />);

    expect(screen.getByText("0%")).toBeInTheDocument();

    const trendElement = screen.getByText("0%");
    expect(trendElement).toHaveClass("metric-card__trend-value__neutral");
  });

  it("renders trend without period", () => {
    const trend = {
      value: "+8%",
      direction: "positive" as const,
    };

    render(<MetricCard {...defaultProps} trend={trend} />);

    expect(screen.getByText("+8%")).toBeInTheDocument();
    expect(screen.queryByText("vs")).not.toBeInTheDocument();
  });

  it("shows trending up icon for positive trend", () => {
    const trend = {
      value: "+10%",
      direction: "positive" as const,
    };

    const { container } = render(
      <MetricCard {...defaultProps} trend={trend} />
    );

    expect(container.querySelector(".bx-trending-up")).toBeInTheDocument();
  });

  it("shows trending down icon for negative trend", () => {
    const trend = {
      value: "-10%",
      direction: "negative" as const,
    };

    const { container } = render(
      <MetricCard {...defaultProps} trend={trend} />
    );

    expect(container.querySelector(".bx-trending-down")).toBeInTheDocument();
  });

  it("does not show trending icon for neutral trend", () => {
    const trend = {
      value: "0%",
      direction: "neutral" as const,
    };

    const { container } = render(
      <MetricCard {...defaultProps} trend={trend} />
    );

    expect(container.querySelector(".bx-trending-up")).not.toBeInTheDocument();
    expect(
      container.querySelector(".bx-trending-down")
    ).not.toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const { container } = render(
      <MetricCard {...defaultProps} className="custom-metric" />
    );

    const card = container.firstChild;
    expect(card).toHaveClass("metric-card custom-metric");
  });

  it("renders clickable card and handles click", () => {
    const mockOnClick = jest.fn();
    render(<MetricCard {...defaultProps} onClick={mockOnClick} />);

    const card = screen.getByText("100").closest(".metric-card");
    expect(card).toHaveClass("metric-card__clickable");

    fireEvent.click(card!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("does not apply clickable class when onClick is not provided", () => {
    const { container } = render(<MetricCard {...defaultProps} />);

    const card = container.firstChild;
    expect(card).not.toHaveClass("metric-card__clickable");
  });

  it("renders description as React node", () => {
    const description = (
      <span data-testid="react-description">
        Complex <strong>description</strong>
      </span>
    );

    render(
      <MetricCard
        {...defaultProps}
        variant="detailed"
        description={description}
      />
    );

    expect(screen.getByTestId("react-description")).toBeInTheDocument();
    expect(screen.getByText("Complex")).toBeInTheDocument();
    expect(screen.getByText("description")).toBeInTheDocument();
  });

  it("does not render icon for basic variant even when icon is provided", () => {
    const icon = <span data-testid="should-not-show">👤</span>;
    render(<MetricCard {...defaultProps} variant="basic" icon={icon} />);

    expect(screen.queryByTestId("should-not-show")).not.toBeInTheDocument();
  });

  it("does not render description for non-detailed variants", () => {
    const description = "Should not show";
    render(
      <MetricCard {...defaultProps} variant="basic" description={description} />
    );

    expect(screen.queryByText("Should not show")).not.toBeInTheDocument();
  });

  it("renders detailed variant with both icon and description", () => {
    const icon = <span data-testid="detailed-icon">📊</span>;
    const description = "Analytics overview";

    render(
      <MetricCard
        {...defaultProps}
        variant="detailed"
        icon={icon}
        description={description}
      />
    );

    expect(screen.getByTestId("detailed-icon")).toBeInTheDocument();
    expect(screen.getByText("Analytics overview")).toBeInTheDocument();
  });

  it("renders with all props combined", () => {
    const mockOnClick = jest.fn();
    const icon = <span data-testid="full-icon">🎯</span>;
    const trend = {
      value: "+15%",
      direction: "positive" as const,
      period: "this quarter",
    };
    const description = "Complete metric example";

    render(
      <MetricCard
        value={1250}
        label="Total Revenue"
        variant="detailed"
        icon={icon}
        trend={trend}
        description={description}
        className="revenue-card"
        onClick={mockOnClick}
      />
    );

    // Check all elements are rendered
    expect(screen.getByText("1250")).toBeInTheDocument();
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByTestId("full-icon")).toBeInTheDocument();
    expect(screen.getByText("+15%")).toBeInTheDocument();
    expect(screen.getByText("this quarter")).toBeInTheDocument();
    expect(screen.getByText("Complete metric example")).toBeInTheDocument();

    // Check classes
    const card = screen.getByText("1250").closest(".metric-card");
    expect(card).toHaveClass(
      "metric-card metric-card__detailed metric-card__clickable revenue-card"
    );

    // Check click handler
    fireEvent.click(card!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("handles edge case with empty string values", () => {
    const { container } = render(<MetricCard value="" label="" />);

    const valueElement = container.querySelector(".metric-card__value");
    const labelElement = container.querySelector(".metric-card__label");

    expect(valueElement).toBeInTheDocument();
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toHaveTextContent("");
    expect(labelElement).toHaveTextContent("");
  });
});
