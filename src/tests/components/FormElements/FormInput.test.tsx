import { render } from "@tests/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import { FormInput } from "@components/FormElements/FormInput";

describe("FormInput Component", () => {
  it("renders basic input with name attribute", () => {
    render(<FormInput name="test-input" />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "test-input");
  });

  it("renders with different input types", () => {
    const { rerender } = render(<FormInput name="email" type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");

    rerender(<FormInput name="number" type="number" />);
    expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");
  });

  it("handles controlled input value", () => {
    const { rerender } = render(<FormInput name="test" value="initial" />);
    expect(screen.getByDisplayValue("initial")).toBeInTheDocument();

    rerender(<FormInput name="test" value="updated" />);
    expect(screen.getByDisplayValue("updated")).toBeInTheDocument();
  });

  it("handles onChange events", () => {
    const mockOnChange = jest.fn();
    render(<FormInput name="test" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("handles onBlur events", () => {
    const mockOnBlur = jest.fn();
    render(<FormInput name="test" onBlur={mockOnBlur} />);

    fireEvent.blur(screen.getByRole("textbox"));
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it("renders with placeholder", () => {
    render(<FormInput name="test" placeholder="Enter your name" />);
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<FormInput name="test" className="custom-input" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("form-input custom-input");
  });

  it("renders disabled state", () => {
    render(<FormInput name="test" disabled />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("input-disabled");
  });

  it("renders required state", () => {
    render(<FormInput name="test" required />);

    const input = screen.getByRole("textbox");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("renders with error state", () => {
    render(<FormInput name="test" hasError />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("touched-invalid");
  });

  it("renders with number attributes", () => {
    render(<FormInput name="age" type="number" min={0} max={120} step={1} />);

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "120");
    expect(input).toHaveAttribute("step", "1");
  });

  it("renders with aria attributes", () => {
    render(<FormInput name="test" ariaLabel="Custom label" ariaDescribedBy="help-text" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-label", "Custom label");
    expect(input).toHaveAttribute("aria-describedby", "help-text");
  });

  it("sets aria-invalid when touched and required", () => {
    render(<FormInput name="test" required />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "false");

    fireEvent.blur(input);
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("renders wrapper and lock icon", () => {
    const { container } = render(<FormInput name="test" />);

    const wrapper = container.querySelector(".form-input-wrapper");
    const lockIcon = container.querySelector(".form-input-lock");
    
    expect(wrapper).toBeInTheDocument();
    expect(lockIcon).toBeInTheDocument();
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<FormInput name="test" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
