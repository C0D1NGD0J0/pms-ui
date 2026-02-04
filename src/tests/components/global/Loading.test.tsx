import { Loading } from "@components/Loading";
import { render } from "@tests/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}));

describe("Loading Component", () => {
  it("renders with default props", () => {
    render(<Loading />);

    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Loading" })
    ).toBeInTheDocument();
  });

  it("renders with custom description", () => {
    render(<Loading description="Processing your request..." />);

    expect(screen.getByText("Processing your request...")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Processing your request..." })
    ).toBeInTheDocument();
  });

  it("renders with fallback when description is empty", () => {
    render(<Loading description="" />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders regular size by default", () => {
    const { container } = render(<Loading />);

    const loadingContainer = container.querySelector(".loading_container");
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).not.toHaveClass("loading_fullscreen");
  });

  it("renders fullscreen size when specified", () => {
    const { container } = render(<Loading size="fullscreen" />);

    const loadingContainer = container.querySelector(".loading_container");
    expect(loadingContainer).toHaveClass("loading_fullscreen");
  });

  it("renders spinner elements", () => {
    const { container } = render(<Loading />);

    const spinner = container.querySelector(".spinner");
    expect(spinner).toBeInTheDocument();

    const spinnerRings = container.querySelectorAll(".spinner_ring");
    expect(spinnerRings).toHaveLength(3);
  });

  it("does not show logo by default", () => {
    render(<Loading />);

    expect(screen.queryByAltText("Logo")).not.toBeInTheDocument();
  });

  it("shows logo when showLogo is true", () => {
    render(<Loading showLogo />);

    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/assets/imgs/logo.png");
    expect(logo).toHaveAttribute("width", "80");
    expect(logo).toHaveAttribute("height", "80");
  });

  it("does not show cancel button by default", () => {
    render(<Loading />);

    expect(
      screen.queryByRole("button", { name: "Cancel" })
    ).not.toBeInTheDocument();
  });

  it("shows cancel button when closeable", () => {
    const mockOnClose = jest.fn();
    render(<Loading isCloseable onClose={mockOnClose} />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveClass(
      "btn btn-outline-ghost btn-sm btn-rounded"
    );
  });

  it("calls onClose when cancel button is clicked", () => {
    const mockOnClose = jest.fn();
    render(<Loading isCloseable onClose={mockOnClose} />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not show cancel button when custom button is provided", () => {
    const mockOnClose = jest.fn();
    const customBtn = <button data-testid="custom-btn">Custom Action</button>;

    render(<Loading isCloseable onClose={mockOnClose} customBtn={customBtn} />);

    expect(
      screen.queryByRole("button", { name: "Cancel" })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("custom-btn")).toBeInTheDocument();
  });

  it("renders custom button when provided", () => {
    const customBtn = (
      <div data-testid="custom-content">
        <button>Retry</button>
        <button>Skip</button>
      </div>
    );

    render(<Loading customBtn={customBtn} />);

    expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Skip" })).toBeInTheDocument();
  });

  it("has correct container structure", () => {
    const { container } = render(<Loading />);

    const mainContainer = container.querySelector("#loading");
    expect(mainContainer).toBeInTheDocument();

    const loadingContainer = container.querySelector(".loading_container");
    expect(loadingContainer).toBeInTheDocument();

    const loadingContent = container.querySelector(".loading_content");
    expect(loadingContent).toBeInTheDocument();
  });

  it("applies text-fade class to message", () => {
    const { container } = render(<Loading />);

    const messageDiv = container.querySelector(".message");
    expect(messageDiv).toHaveClass("text-fade");
  });

  it("renders with all props combined", () => {
    const mockOnClose = jest.fn();
    const customBtn = <button data-testid="combined-btn">Done</button>;

    const { container } = render(
      <Loading
        description="Complex loading process"
        size="fullscreen"
        showLogo
        isCloseable
        onClose={mockOnClose}
        customBtn={customBtn}
      />
    );

    // Check description
    expect(screen.getByText("Complex loading process")).toBeInTheDocument();

    // Check fullscreen size
    expect(container.querySelector(".loading_container")).toHaveClass(
      "loading_fullscreen"
    );

    // Check logo
    expect(screen.getByAltText("Logo")).toBeInTheDocument();

    // Check custom button (not cancel button)
    expect(screen.getByTestId("combined-btn")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel" })
    ).not.toBeInTheDocument();
  });

  it("handles undefined onClose gracefully", () => {
    // Should not crash when isCloseable is true but onClose is undefined
    render(<Loading isCloseable />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(() => fireEvent.click(cancelButton)).not.toThrow();
  });

  it("renders logo with correct CSS class", () => {
    render(<Loading showLogo />);

    const logo = screen.getByAltText("Logo");
    expect(logo).toHaveClass("logo");
    expect(logo.closest(".logo_container")).toBeInTheDocument();
  });

  it("renders message heading with correct structure", () => {
    render(<Loading description="Test message" />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Test message");
    expect(heading.closest(".message")).toHaveClass("text-fade");
  });
});
