import { ExpandableCard } from "@components/ExpandableCard";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ExpandableCard Component", () => {
  it("renders children content", () => {
    render(
      <ExpandableCard>
        <div data-testid="test-content">Test Content</div>
      </ExpandableCard>
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
  });

  it("renders with default collapsed height", () => {
    render(
      <ExpandableCard>
        <div>Content</div>
      </ExpandableCard>
    );

    const content = document.querySelector(".expandable-card__content");
    expect(content).toHaveStyle({ maxHeight: "150px" });
  });

  it("renders with custom collapsed height", () => {
    render(
      <ExpandableCard collapsedHeight={200}>
        <div>Content</div>
      </ExpandableCard>
    );

    const content = document.querySelector(".expandable-card__content");
    expect(content).toHaveStyle({ maxHeight: "200px" });
  });

  it("shows expand icon when collapsed", () => {
    render(
      <ExpandableCard>
        <div>Content</div>
      </ExpandableCard>
    );

    const expandIcon = document.querySelector(".bx-show");
    expect(expandIcon).toBeInTheDocument();
  });

  it("toggles between collapsed and expanded states", () => {
    render(
      <ExpandableCard collapsedHeight={100}>
        <div style={{ height: "300px" }}>Tall Content</div>
      </ExpandableCard>
    );

    const toggleButton = screen.getByRole("button", { name: "Expand" });
    const content = document.querySelector(".expandable-card__content");

    // Initially collapsed
    expect(content).toHaveStyle({ maxHeight: "100px" });
    expect(document.querySelector(".bx-show")).toBeInTheDocument();

    // Click to expand
    fireEvent.click(toggleButton);

    // Should expand
    expect(toggleButton).toHaveAttribute("aria-label", "Collapse");
    expect(document.querySelector(".bx-hide")).toBeInTheDocument();
  });

  it("shows fade overlay when collapsed", () => {
    const { container } = render(
      <ExpandableCard>
        <div>Content</div>
      </ExpandableCard>
    );

    const fade = container.querySelector(".expandable-card__fade");
    expect(fade).toBeInTheDocument();
  });

  it("hides fade overlay when expanded", () => {
    const { container } = render(
      <ExpandableCard>
        <div>Content</div>
      </ExpandableCard>
    );

    const toggleButton = screen.getByRole("button", { name: "Expand" });

    // Click to expand
    fireEvent.click(toggleButton);

    // Fade should be hidden
    const fade = container.querySelector(".expandable-card__fade");
    expect(fade).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ExpandableCard className="custom-class">
        <div>Content</div>
      </ExpandableCard>
    );

    const card = container.querySelector(".expandable-card");
    expect(card).toHaveClass("custom-class");
  });

  it("adds expanded class when expanded", () => {
    const { container } = render(
      <ExpandableCard>
        <div>Content</div>
      </ExpandableCard>
    );

    const toggleButton = screen.getByRole("button");
    const card = container.querySelector(".expandable-card");

    // Initially no expanded class
    expect(card).not.toHaveClass("expandable-card--expanded");

    // Click to expand
    fireEvent.click(toggleButton);

    // Should have expanded class
    expect(card).toHaveClass("expandable-card--expanded");
  });

  it("toggle button has correct accessibility attributes", () => {
    render(
      <ExpandableCard>
        <div>Content</div>
      </ExpandableCard>
    );

    const toggleButton = screen.getByRole("button");

    // Initially collapsed
    expect(toggleButton).toHaveAttribute("aria-label", "Expand");
    expect(toggleButton).toHaveAttribute("type", "button");

    // Click to expand
    fireEvent.click(toggleButton);

    // Should update aria-label
    expect(toggleButton).toHaveAttribute("aria-label", "Collapse");
  });

  it("prevents event bubbling on toggle click", () => {
    const parentClickHandler = jest.fn();

    render(
      <div onClick={parentClickHandler}>
        <ExpandableCard>
          <div>Content</div>
        </ExpandableCard>
      </div>
    );

    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);

    // Parent click should not be called
    expect(parentClickHandler).not.toHaveBeenCalled();
  });
});
