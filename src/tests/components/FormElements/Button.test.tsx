import { render } from "@tests/utils/test-utils";
import { Button } from "@components/FormElements/Button";
import { fireEvent, screen } from "@testing-library/react";

describe("Button Component", () => {
  it("renders basic button with label", () => {
    render(<Button label="Click me" />);

    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("handles click events", () => {
    const mockOnClick = jest.fn();
    render(<Button label="Click me" onClick={mockOnClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders with custom className", () => {
    render(<Button label="Test" className="custom-btn" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn custom-btn");
  });

  it("renders disabled state", () => {
    render(<Button label="Disabled" disabled />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("renders loading state with text", () => {
    render(<Button label="Submit" loading loadingText="Submitting..." />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("btn-loading");
    expect(screen.getByText("Submitting...")).toBeInTheDocument();
  });

  it("renders with icons", () => {
    const icon = <span data-testid="test-icon">🔍</span>;
    render(<Button label="Search" icon={icon} iconPosition="left" />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders different button types", () => {
    render(<Button label="Submit" type="submit" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("renders with aria-label", () => {
    render(<Button label="X" ariaLabel="Close dialog" />);

    expect(
      screen.getByRole("button", { name: "Close dialog" })
    ).toBeInTheDocument();
  });

  it("renders with form attribute", () => {
    render(<Button label="Submit" formId="test-form" />);

    expect(screen.getByRole("button")).toHaveAttribute("form", "test-form");
  });

  it("renders custom children", () => {
    render(
      <Button label="Test" renderChildren>
        <span data-testid="custom-content">Custom Content</span>
      </Button>
    );

    expect(screen.getByTestId("custom-content")).toBeInTheDocument();
  });

  it("prevents interaction when disabled", () => {
    const mockOnClick = jest.fn();
    render(<Button label="Disabled" onClick={mockOnClick} disabled />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("shows spinner during loading", () => {
    render(<Button label="Submit" loading />);

    const button = screen.getByRole("button");
    const spinner = button.querySelector(".btn-spinner-icon");
    expect(spinner).toBeInTheDocument();
  });
});
