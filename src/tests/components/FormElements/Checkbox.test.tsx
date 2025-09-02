import { render } from "@tests/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import { Checkbox } from "@components/FormElements/Checkbox";

describe("Checkbox Component", () => {
  const defaultProps = {
    id: "test-checkbox",
    name: "test-checkbox",
    checked: false,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders basic checkbox with required props", () => {
    render(<Checkbox {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("id", "test-checkbox");
    expect(checkbox).toHaveAttribute("name", "test-checkbox");
  });

  it("handles checked state", () => {
    const { rerender } = render(<Checkbox {...defaultProps} checked={false} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    rerender(<Checkbox {...defaultProps} checked={true} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("handles onChange events", () => {
    const mockOnChange = jest.fn();
    render(<Checkbox {...defaultProps} onChange={mockOnChange} />);

    fireEvent.click(screen.getByRole("checkbox"));
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("renders with text label", () => {
    render(<Checkbox {...defaultProps} label="Accept terms" />);

    expect(screen.getByText("Accept terms")).toBeInTheDocument();
    expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
  });

  it("renders with React node label", () => {
    const customLabel = <span>Custom <strong>Label</strong></span>;
    render(<Checkbox {...defaultProps} label={customLabel} />);

    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  it("renders with description", () => {
    render(
      <Checkbox
        {...defaultProps}
        label="Accept terms"
        description="Please read the terms and conditions"
      />
    );

    expect(screen.getByText("Please read the terms and conditions")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<Checkbox {...defaultProps} className="custom-checkbox" />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass("form-input_checkbox custom-checkbox");
  });

  it("renders disabled state", () => {
    render(<Checkbox {...defaultProps} disabled />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass("input-disabled");
  });

  it("renders required state with asterisk", () => {
    render(<Checkbox {...defaultProps} label="Required field" required />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeRequired();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders with aria-label", () => {
    render(<Checkbox {...defaultProps} ariaLabel="Custom accessibility label" />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-label", "Custom accessibility label");
  });

  it("clicking label toggles checkbox", () => {
    const mockOnChange = jest.fn();
    render(<Checkbox {...defaultProps} onChange={mockOnChange} label="Click me" />);

    fireEvent.click(screen.getByText("Click me"));
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("renders wrapper structure and lock icon", () => {
    const { container } = render(<Checkbox {...defaultProps} label="Test" />);

    expect(container.querySelector(".checkbox-wrapper")).toBeInTheDocument();
    expect(container.querySelector(".checkbox-input-wrapper")).toBeInTheDocument();
    expect(container.querySelector(".checkbox-lock-icon")).toBeInTheDocument();
  });
});