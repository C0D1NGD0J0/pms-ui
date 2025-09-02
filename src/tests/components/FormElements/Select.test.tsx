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

  it("renders select with placeholder", () => {
    render(<Select {...defaultProps} placeholder="Choose an option" />);

    expect(screen.getByText("Choose an option")).toBeInTheDocument();
  });

  it("displays selected option label", () => {
    render(<Select {...defaultProps} value="option1" />);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("opens dropdown when clicked", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Select {...defaultProps} />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByTestId("outside"));

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("selects option when clicked", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<Select {...defaultProps} onChange={mockOnChange} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Option 2"));

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "option2" }),
      })
    );
  });

  it("prevents selecting disabled option", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<Select {...defaultProps} onChange={mockOnChange} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Option 3"));

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("handles keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);

    const trigger = screen.getByRole("button");
    trigger.focus();

    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("renders disabled state", () => {
    render(<Select {...defaultProps} disabled />);

    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();
    expect(trigger.parentElement).toHaveClass("disabled");
  });

  it("shows correct icons", () => {
    const { container, rerender } = render(<Select {...defaultProps} />);
    expect(container.querySelector(".bx-chevron-down")).toBeInTheDocument();

    rerender(<Select {...defaultProps} disabled />);
    expect(container.querySelector(".bx-lock-alt")).toBeInTheDocument();
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
    render(<Select {...defaultProps} ariaLabel="Custom label" />);

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-label", "Custom label");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("updates aria-expanded state", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("renders hidden input correctly", () => {
    render(<Select {...defaultProps} value="option2" />);

    const hiddenInput = screen.getByDisplayValue("option2");
    expect(hiddenInput).toHaveAttribute("name", "test-select");
    expect(hiddenInput).toHaveAttribute("type", "hidden");
  });

  it("marks options with correct aria attributes", async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} value="option1" />);

    await user.click(screen.getByRole("button"));

    const selectedOption = screen.getByRole("option", { name: "Option 1" });
    expect(selectedOption).toHaveAttribute("aria-selected", "true");

    const disabledOption = screen.getByRole("option", { name: "Option 3" });
    expect(disabledOption).toHaveAttribute("aria-disabled", "true");
  });
});
