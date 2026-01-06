import { screen } from "@testing-library/react";
import { render } from "@tests/utils/test-utils";
import { DatePicker } from "@components/FormElements/DatePicker";

// Mock dayjs to avoid timezone issues in tests
jest.mock("dayjs", () => {
  const originalDayjs = jest.requireActual("dayjs");
  const mockDayjs = (date?: any) => {
    if (date) {
      return originalDayjs(date);
    }
    return originalDayjs("2024-01-15T12:00:00Z");
  };
  Object.setPrototypeOf(mockDayjs, originalDayjs);
  Object.assign(mockDayjs, originalDayjs);
  return mockDayjs;
});

describe("DatePicker Component", () => {
  const defaultProps = {
    id: "test-datepicker",
    name: "test-datepicker",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders basic datepicker with required props", () => {
    render(<DatePicker {...defaultProps} />);

    const datepicker = screen.getByRole("textbox");
    expect(datepicker).toBeInTheDocument();
    expect(datepicker).toHaveAttribute("id", "test-datepicker");
    expect(datepicker).toHaveAttribute("name", "test-datepicker");
  });

  it("renders with placeholders", () => {
    const { rerender } = render(<DatePicker {...defaultProps} />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Select date"
    );

    rerender(<DatePicker {...defaultProps} placeholder="Choose a date" />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Choose a date"
    );
  });

  it("handles values", () => {
    const { rerender } = render(
      <DatePicker {...defaultProps} value="2024-01-15" />
    );
    expect(screen.getByDisplayValue("2024-01-15")).toBeInTheDocument();

    rerender(<DatePicker {...defaultProps} value="" />);
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("applies custom className", () => {
    const { container } = render(
      <DatePicker {...defaultProps} className="custom-date" />
    );
    expect(container.querySelector(".ant-picker")).toHaveClass("custom-date");
  });

  it("renders disabled state", () => {
    const { container } = render(<DatePicker {...defaultProps} disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(container.querySelector(".ant-picker")).toHaveClass(
      "ant-picker-disabled"
    );
  });

  it("renders error state", () => {
    const { container } = render(<DatePicker {...defaultProps} hasError />);
    expect(container.querySelector(".ant-picker")).toHaveClass(
      "touched-invalid"
    );
  });

  it("renders required state", () => {
    render(<DatePicker {...defaultProps} required />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-required",
      "true"
    );
  });

  it("uses custom format", () => {
    render(
      <DatePicker {...defaultProps} value="2024-01-15" format="DD/MM/YYYY" />
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("handles controlled value changes", () => {
    const { rerender } = render(<DatePicker {...defaultProps} value="" />);
    expect(screen.getByRole("textbox")).toHaveValue("");

    rerender(<DatePicker {...defaultProps} value="2024-01-15" />);
    expect(screen.getByDisplayValue("2024-01-15")).toBeInTheDocument();
  });

  it("applies correct CSS classes based on state", () => {
    const { rerender, container } = render(<DatePicker {...defaultProps} />);

    const antPicker = container.querySelector(".ant-picker");
    expect(antPicker).toHaveClass("form-input");

    rerender(<DatePicker {...defaultProps} hasError />);
    expect(container.querySelector(".ant-picker")).toHaveClass(
      "touched-invalid"
    );
  });
});
