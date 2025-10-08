import { Modal } from "@components/FormElements/Modal/Modal";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock createPortal to render in the same DOM
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (node: any) => node,
}));

describe("Modal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("should not render when isOpen is false", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(container.firstChild).toBeNull();
  });

  it("should call onClose when Escape key is pressed", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should apply size classes", () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="large">
        <div>Modal Content</div>
      </Modal>
    );

    expect(container.querySelector(".modal-lg")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} className="custom-modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(container.querySelector(".custom-modal")).toBeInTheDocument();
  });
});
