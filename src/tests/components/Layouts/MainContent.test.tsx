import { render, screen } from "@tests/utils/test-utils";
import { MainContent } from "@components/Layouts/MainContent";

describe("MainContent Component", () => {
  it("renders children content", () => {
    render(
      <MainContent>
        <h1>Test Content</h1>
        <p>This is a test</p>
      </MainContent>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("This is a test")).toBeInTheDocument();
  });

  it("renders as section element with correct class", () => {
    const { container } = render(
      <MainContent>
        <div>Content</div>
      </MainContent>
    );

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("main-content");
  });

  it("handles empty children", () => {
    const { container } = render(<MainContent>{null}</MainContent>);

    const section = container.querySelector("section.main-content");
    expect(section).toBeInTheDocument();
    expect(section).toBeEmptyDOMElement();
  });

  it("handles multiple children", () => {
    render(
      <MainContent>
        <header>Header</header>
        <main>Main</main>
        <aside>Aside</aside>
      </MainContent>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Aside")).toBeInTheDocument();
  });

  it("preserves nested component structure", () => {
    const TestComponent = () => (
      <div data-testid="nested-component">
        Nested Component
      </div>
    );

    render(
      <MainContent>
        <TestComponent />
      </MainContent>
    );

    expect(screen.getByTestId("nested-component")).toBeInTheDocument();
    expect(screen.getByText("Nested Component")).toBeInTheDocument();
  });
});