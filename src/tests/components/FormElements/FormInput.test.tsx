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

    rerender(<FormInput name="password" type="password" />);
    expect(screen.getByDisplayValue("")).toHaveAttribute("type", "password");

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
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "new value" }),
      })
    );
  });

  it("handles onBlur events and sets touched state", () => {
    const mockOnBlur = jest.fn();
    render(<FormInput name="test" onBlur={mockOnBlur} />);

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it("handles onKeyDown events", () => {
    const mockOnKeyDown = jest.fn();
    render(<FormInput name="test" onkeydown={mockOnKeyDown} />);

    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
  });

  it("renders with placeholder", () => {
    render(<FormInput name="test" placeholder="Enter your name" />);

    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("renders with default single space placeholder", () => {
    const { container } = render(<FormInput name="test" />);

    const input = container.querySelector('input[name="test"]');
    expect(input).toHaveAttribute("placeholder", " ");
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

  it("renders readonly state", () => {
    const mockOnChange = jest.fn();
    render(<FormInput name="test" readOnly onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readonly");

    fireEvent.change(input, { target: { value: "should not change" } });
    expect(mockOnChange).not.toHaveBeenCalled();
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

  it("renders with custom id", () => {
    render(<FormInput name="test" id="custom-id" />);

    expect(screen.getByRole("textbox")).toHaveAttribute("id", "custom-id");
  });

  it("renders with min and max attributes for number type", () => {
    render(<FormInput name="age" type="number" min={0} max={120} />);

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "120");
  });

  it("renders with step attribute for number type", () => {
    render(<FormInput name="price" type="number" step={0.01} />);

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("step", "0.01");
  });

  it("renders with maxLength attribute", () => {
    render(<FormInput name="username" maxLength={20} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "20");
  });

  it("renders with pattern attribute", () => {
    render(<FormInput name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />);

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "pattern",
      "[0-9]{3}-[0-9]{3}-[0-9]{4}"
    );
  });

  it("renders with autoComplete attribute", () => {
    render(<FormInput name="email" autoComplete="email" />);

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "autocomplete",
      "email"
    );
  });

  it("renders with aria-label", () => {
    render(<FormInput name="test" ariaLabel="Custom label" />);

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-label",
      "Custom label"
    );
  });

  it("renders with aria-describedby", () => {
    render(<FormInput name="test" ariaDescribedBy="help-text" />);

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "help-text"
    );
  });

  it("sets aria-invalid when touched, required, and empty", () => {
    render(<FormInput name="test" required />);

    const input = screen.getByRole("textbox");

    // Initially should not be invalid
    expect(input).toHaveAttribute("aria-invalid", "false");

    // After blur (touched) and still empty, should be invalid
    fireEvent.blur(input);
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when touched but has value", () => {
    render(<FormInput name="test" required value="some value" />);

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("renders wrapper div with form-input-wrapper class", () => {
    const { container } = render(<FormInput name="test" />);

    const wrapper = container.querySelector(".form-input-wrapper");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders lock icon", () => {
    const { container } = render(<FormInput name="test" />);

    const lockIcon = container.querySelector(".form-input-lock");
    expect(lockIcon).toBeInTheDocument();
    expect(lockIcon).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<FormInput name="test" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("has correct display name", () => {
    expect(FormInput.displayName).toBe("FormInput");
  });
});
