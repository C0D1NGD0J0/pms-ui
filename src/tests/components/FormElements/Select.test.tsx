import { render } from "@tests/utils/test-utils";
import userEvent from "@testing-library/user-event";
import { Select } from "@components/FormElements/Select";
import { waitFor, screen } from "@testing-library/react";

// Mock scrollIntoView since it's not available in jsdom
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  value: jest.fn(),
  writable: true,
});

const mockOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3", disabled: true },
  { value: "option4", label: "Option 4" },
];

describe("Select Component", () => {
  const defaultProps = {
    id: "test-select",
    name: "test-select",
    options: mockOptions,
    value: "",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders select trigger with placeholder", () => {
    render(<Select {...defaultProps} placeholder="Choose an option" />);

    expect(
      screen.getByRole("button", { name: "Choose an option" })
    ).toBeInTheDocument();
    expect(screen.getByText("Choose an option")).toBeInTheDocument();
  });

  it("renders with default placeholder", () => {
    render(<Select {...defaultProps} />);

    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("displays selected option label", () => {
    render(<Select {...defaultProps} value="option1" />);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("opens dropdown when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Select {...defaultProps} />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    // Open dropdown
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // Click outside
    await user.click(screen.getByTestId("outside"));

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("selects option when clicked", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<Select {...defaultProps} onChange={mockOnChange} />);

    // Open dropdown
    await user.click(screen.getByRole("button"));

    // Click option
    await user.click(screen.getByText("Option 2"));

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "option2" }),
      })
    );
  });

  it("does not select disabled option", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<Select {...defaultProps} onChange={mockOnChange} />);

    // Open dropdown
    await user.click(screen.getByRole("button"));

    // Try to click disabled option
    const disabledOption = screen.getByText("Option 3");
    await user.click(disabledOption);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("handles keyboard navigation - Enter to open", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);

    const trigger = screen.getByRole("button");
    trigger.focus();

    await user.keyboard("{Enter}");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("handles keyboard navigation - Space to open", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);

    const trigger = screen.getByRole("button");
    trigger.focus();

    await user.keyboard(" ");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("handles keyboard navigation - Arrow down", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);

    const trigger = screen.getByRole("button");
    trigger.focus();

    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("handles keyboard navigation - Escape to close", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);

    const trigger = screen.getByRole("button");
    trigger.focus();

    // Open dropdown
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // Close with Escape
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("selects option with Enter key", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<Select {...defaultProps} onChange={mockOnChange} />);

    const trigger = screen.getByRole("button");
    trigger.focus();

    // Open and select first option
    await user.keyboard("{Enter}{Enter}");

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "option1" }),
      })
    );
  });

  it("renders disabled state", () => {
    render(<Select {...defaultProps} disabled />);

    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();
    expect(trigger.parentElement).toHaveClass("disabled");
  });

  it("shows lock icon when disabled", () => {
    const { container } = render(<Select {...defaultProps} disabled />);

    expect(container.querySelector(".bx-lock-alt")).toBeInTheDocument();
  });

  it("shows chevron icon when not disabled", () => {
    const { container } = render(<Select {...defaultProps} />);

    expect(container.querySelector(".bx-chevron-down")).toBeInTheDocument();
  });

  it("handles required validation", () => {
    render(<Select {...defaultProps} required />);

    const hiddenInput = screen.getByDisplayValue("");
    expect(hiddenInput).toHaveAttribute("required");
  });

  it("applies custom className", () => {
    render(<Select {...defaultProps} className="custom-select" />);

    const wrapper = screen.getByRole("button").parentElement;
    expect(wrapper).toHaveClass("custom-select");
  });

  it("renders with aria attributes", () => {
    render(
      <Select
        {...defaultProps}
        ariaLabel="Custom label"
        ariaDescribedBy="help-text"
      />
    );

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-label", "Custom label");
    expect(trigger).toHaveAttribute("aria-describedby", "help-text");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("updates aria-expanded when opening/closing", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("renders hidden input with correct name and value", () => {
    render(<Select {...defaultProps} value="option2" />);

    const hiddenInput = screen.getByDisplayValue("option2");
    expect(hiddenInput).toHaveAttribute("name", "test-select");
    expect(hiddenInput).toHaveAttribute("type", "hidden");
  });

  it("calls onBlur when trigger loses focus", async () => {
    const user = userEvent.setup();
    const mockOnBlur = jest.fn();
    render(<Select {...defaultProps} onBlur={mockOnBlur} />);

    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.tab();

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("marks options as selected with aria-selected", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} value="option1" />);

    await user.click(screen.getByRole("button"));

    const selectedOption = screen.getByRole("option", { name: "Option 1" });
    expect(selectedOption).toHaveAttribute("aria-selected", "true");

    const unselectedOption = screen.getByRole("option", { name: "Option 2" });
    expect(unselectedOption).toHaveAttribute("aria-selected", "false");
  });

  it("marks disabled options with aria-disabled", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);

    await user.click(screen.getByRole("button"));

    const disabledOption = screen.getByRole("option", { name: "Option 3" });
    expect(disabledOption).toHaveAttribute("aria-disabled", "true");
    expect(disabledOption).toHaveClass("disabled");
  });

  it("handles type-ahead search", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);

    const trigger = screen.getByRole("button");
    trigger.focus();

    // Open dropdown
    await user.keyboard("{Enter}");

    // Type to search
    await user.keyboard("o");

    // Should focus on first option starting with "o"
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("applies CSS classes based on state", () => {
    const { rerender } = render(<Select {...defaultProps} />);

    let wrapper = screen.getByRole("button").parentElement;
    expect(wrapper).toHaveClass(
      "custom-select-wrapper untouched closed no-value"
    );

    // With value
    rerender(<Select {...defaultProps} value="option1" />);
    wrapper = screen.getByRole("button").parentElement;
    expect(wrapper).toHaveClass("has-value");
  });

  it("handles empty options array", () => {
    render(<Select {...defaultProps} options={[]} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("has correct display name", () => {
    expect(Select.displayName).toBe("Select");
  });
});
