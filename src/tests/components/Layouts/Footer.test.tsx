import { Footer } from "@components/Layouts/Footer";
import { render, screen } from "@tests/utils/test-utils";

describe("Footer Component", () => {
  it("renders footer with copyright text", () => {
    render(<Footer />);

    expect(
      screen.getByText("© 2025 Property Management Application")
    ).toBeInTheDocument();
  });

  it("renders as footer element", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("footer");
  });

  it("has correct structure", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer.footer");
    const paragraph = footer?.querySelector("p");

    expect(footer).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(
      "© 2025 Property Management Application"
    );
  });

  it("matches snapshot", () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
