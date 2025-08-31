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

  it("renders loading state", () => {
    render(<Button label="Submit" loading loadingText="Submitting..." />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("btn-loading");
    expect(screen.getByText("Submitting...")).toBeInTheDocument();
  });

  it("renders loading state without loadingText", () => {
    render(<Button label="Submit" loading />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("renders with left icon", () => {
    const icon = <span data-testid="test-icon">🔍</span>;
    render(<Button label="Search" icon={icon} iconPosition="left" />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders with right icon", () => {
    const icon = <span data-testid="test-icon">→</span>;
    render(<Button label="Next" icon={icon} iconPosition="right" />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("renders different button types", () => {
    const { rerender } = render(<Button label="Submit" type="submit" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");

    rerender(<Button label="Reset" type="reset" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
  });

  it("renders with custom aria-label", () => {
    render(<Button label="X" ariaLabel="Close dialog" />);

    expect(
      screen.getByRole("button", { name: "Close dialog" })
    ).toBeInTheDocument();
  });

  it("renders with form attribute", () => {
    render(<Button label="Submit" formId="test-form" />);

    expect(screen.getByRole("button")).toHaveAttribute("form", "test-form");
  });

  it("does not render form attribute when formId is empty", () => {
    render(<Button label="Submit" formId="" />);

    expect(screen.getByRole("button")).not.toHaveAttribute("form");
  });

  it("renders with custom children when renderChildren is true", () => {
    render(
      <Button label="Test" renderChildren>
        <span data-testid="custom-content">Custom Content</span>
      </Button>
    );

    expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  it("applies custom styles", () => {
    const customStyle = { backgroundColor: "red", color: "white" };
    render(<Button label="Styled" style={customStyle} />);

    const button = screen.getByRole("button");
    expect(button).toHaveStyle("background-color: red");
    expect(button).toHaveStyle("color: white");
  });

  it("does not call onClick when disabled", () => {
    const mockOnClick = jest.fn();
    render(<Button label="Disabled" onClick={mockOnClick} disabled />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when loading", () => {
    const mockOnClick = jest.fn();
    render(<Button label="Loading" onClick={mockOnClick} loading />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("shows spinner icon during loading state with left position", () => {
    render(<Button label="Submit" loading iconPosition="left" />);

    const button = screen.getByRole("button");
    const spinner = button.querySelector(".btn-spinner-icon");
    expect(spinner).toBeInTheDocument();
  });

  it("shows spinner icon during loading state with right position", () => {
    render(<Button label="Submit" loading iconPosition="right" />);

    const button = screen.getByRole("button");
    const spinner = button.querySelector(".btn-spinner-icon");
    expect(spinner).toBeInTheDocument();
  });

  it("hides regular icon during loading state", () => {
    const icon = <span data-testid="regular-icon">🔍</span>;
    render(<Button label="Search" icon={icon} loading />);

    expect(screen.queryByTestId("regular-icon")).not.toBeInTheDocument();
  });
});
