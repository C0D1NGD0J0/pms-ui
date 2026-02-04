import { render } from "@tests/utils/test-utils";
import { Toggle } from "@components/FormElements/Toggle";
import { fireEvent, screen } from "@testing-library/react";

describe("Toggle Component", () => {
  const defaultProps = {
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders basic toggle with default state", () => {
    render(<Toggle {...defaultProps} />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).not.toHaveClass("toggled");
  });

  it("renders with initial state true", () => {
    render(<Toggle {...defaultProps} initialState={true} />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveClass("toggled");
  });

  it("toggles state when clicked", () => {
    const mockOnChange = jest.fn();
    render(<Toggle onChange={mockOnChange} />);

    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);

    expect(mockOnChange).toHaveBeenCalledWith(true, undefined);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveClass("toggled");
  });

  it("calls onChange with name parameter", () => {
    const mockOnChange = jest.fn();
    render(<Toggle onChange={mockOnChange} name="test-toggle" />);

    fireEvent.click(screen.getByRole("switch"));
    expect(mockOnChange).toHaveBeenCalledWith(true, "test-toggle");
  });

  it("renders with custom id and className", () => {
    render(
      <Toggle {...defaultProps} id="custom-toggle" className="custom-class" />
    );

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("id", "custom-toggle");
    expect(toggle).toHaveClass("toggle custom-class");
  });

  it("handles keyboard navigation", () => {
    const mockOnChange = jest.fn();
    render(<Toggle onChange={mockOnChange} />);

    const toggle = screen.getByRole("switch");
    fireEvent.keyDown(toggle, { key: "Enter" });
    expect(toggle).toHaveAttribute("aria-checked", "true");

    fireEvent.keyDown(toggle, { key: " " });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });

  it("ignores irrelevant keyboard keys", () => {
    const mockOnChange = jest.fn();
    render(<Toggle onChange={mockOnChange} />);

    const toggle = screen.getByRole("switch");
    fireEvent.keyDown(toggle, { key: "Tab" });
    fireEvent.keyDown(toggle, { key: "Escape" });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("renders disabled state", () => {
    render(<Toggle {...defaultProps} disabled />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("disabled");
    expect(toggle).toHaveAttribute("aria-disabled", "true");
    expect(toggle).toHaveAttribute("tabIndex", "-1");
  });

  it("prevents interaction when disabled", () => {
    const mockOnChange = jest.fn();
    render(<Toggle onChange={mockOnChange} disabled />);

    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);
    fireEvent.keyDown(toggle, { key: "Enter" });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("renders wrapper, handle, and lock icon", () => {
    const { container } = render(<Toggle {...defaultProps} />);

    expect(container.querySelector(".toggle-wrapper")).toBeInTheDocument();
    expect(container.querySelector(".toggle-handle")).toBeInTheDocument();
    expect(container.querySelector(".toggle-lock-icon")).toBeInTheDocument();
  });
});
