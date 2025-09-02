import { render } from "@tests/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import { Textarea } from "@components/FormElements/TextArea";

describe("Textarea Component", () => {
  const defaultProps = {
    id: "test-textarea",
    name: "test-textarea",
    value: "",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders basic textarea with required props", () => {
    render(<Textarea {...defaultProps} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("id", "test-textarea");
    expect(textarea).toHaveAttribute("name", "test-textarea");
  });

  it("handles controlled value", () => {
    const { rerender } = render(<Textarea {...defaultProps} value="initial text" />);
    
    expect(screen.getByDisplayValue("initial text")).toBeInTheDocument();

    rerender(<Textarea {...defaultProps} value="updated text" />);
    expect(screen.getByDisplayValue("updated text")).toBeInTheDocument();
  });

  it("handles onChange events", () => {
    const mockOnChange = jest.fn();
    render(<Textarea {...defaultProps} onChange={mockOnChange} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "new content" } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("handles onBlur events and sets touched state", () => {
    const mockOnBlur = jest.fn();
    render(<Textarea {...defaultProps} onBlur={mockOnBlur} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("untouched");

    fireEvent.blur(textarea);
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveClass("touched");
  });

  it("renders with placeholder", () => {
    render(<Textarea {...defaultProps} placeholder="Enter your message" />);
    expect(screen.getByPlaceholderText("Enter your message")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<Textarea {...defaultProps} className="custom-textarea" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("form-input_textarea custom-textarea");
  });

  it("renders disabled state", () => {
    render(<Textarea {...defaultProps} disabled />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass("input-disabled");
  });

  it("renders required state", () => {
    render(<Textarea {...defaultProps} required />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute("aria-required", "true");
  });

  it("renders with custom rows and maxLength", () => {
    render(<Textarea {...defaultProps} rows={8} maxLength={500} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("rows", "8");
    expect(textarea).toHaveAttribute("maxlength", "500");
  });

  it("renders with aria attributes", () => {
    render(<Textarea {...defaultProps} ariaLabel="Message content" ariaDescribedBy="help-text" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-label", "Message content");
    expect(textarea).toHaveAttribute("aria-describedby", "help-text");
  });

  it("sets aria-invalid when touched and required", () => {
    render(<Textarea {...defaultProps} required />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-invalid", "false");

    fireEvent.blur(textarea);
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("renders wrapper and lock icon", () => {
    const { container } = render(<Textarea {...defaultProps} />);

    const wrapper = container.querySelector(".form-input-wrapper");
    const lockIcon = container.querySelector(".form-textarea-lock");
    
    expect(wrapper).toBeInTheDocument();
    expect(lockIcon).toBeInTheDocument();
  });
});