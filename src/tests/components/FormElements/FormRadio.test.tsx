import { render } from "@tests/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import { FormRadio } from "@components/FormElements/FormRadio";

describe("FormRadio Component", () => {
  const defaultProps = {
    id: "test-radio",
    name: "test-group",
    value: "option1",
    checked: false,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders basic radio button with required props", () => {
    render(<FormRadio {...defaultProps} />);

    const radio = screen.getByRole("radio");
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveAttribute("id", "test-radio");
    expect(radio).toHaveAttribute("name", "test-group");
    expect(radio).toHaveAttribute("value", "option1");
  });

  it("handles checked state", () => {
    const { rerender } = render(<FormRadio {...defaultProps} checked={false} />);
    expect(screen.getByRole("radio")).not.toBeChecked();

    rerender(<FormRadio {...defaultProps} checked={true} />);
    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("handles onChange events", () => {
    const mockOnChange = jest.fn();
    render(<FormRadio {...defaultProps} onChange={mockOnChange} />);

    fireEvent.click(screen.getByRole("radio"));
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("renders with text label", () => {
    render(<FormRadio {...defaultProps} label="Option 1" />);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
  });

  it("renders with React node label", () => {
    const customLabel = <span>Custom <strong>Radio</strong> Label</span>;
    render(<FormRadio {...defaultProps} label={customLabel} />);

    const labelElement = screen.getByRole("radio").closest(".radio-option")?.querySelector("label");
    expect(labelElement).toHaveTextContent("Custom Radio Label");
  });

  it("renders with custom className", () => {
    render(<FormRadio {...defaultProps} className="custom-radio" />);

    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass("custom-radio");
  });

  it("renders disabled state", () => {
    render(<FormRadio {...defaultProps} disabled />);

    const radio = screen.getByRole("radio");
    expect(radio).toBeDisabled();
    expect(radio).toHaveClass("input-disabled");
  });

  it("renders with aria-label", () => {
    render(<FormRadio {...defaultProps} ariaLabel="Custom accessibility label" />);

    const radio = screen.getByRole("radio");
    expect(radio).toHaveAttribute("aria-label", "Custom accessibility label");
  });

  it("clicking label selects radio", () => {
    const mockOnChange = jest.fn();
    render(<FormRadio {...defaultProps} onChange={mockOnChange} label="Click me" />);

    fireEvent.click(screen.getByText("Click me"));
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("works in radio button groups", () => {
    render(
      <div>
        <FormRadio id="radio1" name="group" value="option1" checked={false} onChange={jest.fn()} label="Option 1" />
        <FormRadio id="radio2" name="group" value="option2" checked={true} onChange={jest.fn()} label="Option 2" />
        <FormRadio id="radio3" name="group" value="option3" checked={false} onChange={jest.fn()} label="Option 3" />
      </div>
    );

    const radio1 = screen.getByLabelText("Option 1");
    const radio2 = screen.getByLabelText("Option 2");
    
    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
    expect(radio1).toHaveAttribute("name", "group");
    expect(radio2).toHaveAttribute("name", "group");
  });
});