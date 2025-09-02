import { fireEvent, render, screen } from "@tests/utils/test-utils";
import { PropertyManager, Manager } from "@components/Property/PropertyManager";

const mockManager: Manager = {
  name: "John Smith",
  title: "Senior Property Manager",
  avatar: "👤",
  contact: {
    phone: "+1 (555) 123-4567",
    email: "john.smith@property.com",
  },
  stats: [
    { label: "Properties", value: "15" },
    { label: "Tenants", value: "142" },
    { label: "Years Exp.", value: "8" },
  ],
};

describe("PropertyManager Component", () => {
  it("renders manager information correctly", () => {
    render(<PropertyManager manager={mockManager} />);

    expect(screen.getByText("Property Manager")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Senior Property Manager")).toBeInTheDocument();
    expect(screen.getByText("👤")).toBeInTheDocument();
  });

  it("displays contact information", () => {
    render(<PropertyManager manager={mockManager} />);

    expect(screen.getByText("+1 (555) 123-4567")).toBeInTheDocument();
    expect(screen.getByText("john.smith@property.com")).toBeInTheDocument();
  });

  it("renders stats correctly", () => {
    render(<PropertyManager manager={mockManager} />);

    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("Properties")).toBeInTheDocument();
    expect(screen.getByText("142")).toBeInTheDocument();
    expect(screen.getByText("Tenants")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("Years Exp.")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<PropertyManager manager={mockManager} />);

    expect(screen.getByRole("button", { name: "Message" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Call" })).toBeInTheDocument();
  });

  it("calls onMessage when Message button is clicked", () => {
    const mockOnMessage = jest.fn();
    render(<PropertyManager manager={mockManager} onMessage={mockOnMessage} />);

    const messageButton = screen.getByRole("button", { name: "Message" });
    fireEvent.click(messageButton);

    expect(mockOnMessage).toHaveBeenCalledTimes(1);
  });

  it("calls onCall when Call button is clicked", () => {
    const mockOnCall = jest.fn();
    render(<PropertyManager manager={mockManager} onCall={mockOnCall} />);

    const callButton = screen.getByRole("button", { name: "Call" });
    fireEvent.click(callButton);

    expect(mockOnCall).toHaveBeenCalledTimes(1);
  });

  it("renders without optional callbacks", () => {
    render(<PropertyManager manager={mockManager} />);

    const messageButton = screen.getByRole("button", { name: "Message" });
    const callButton = screen.getByRole("button", { name: "Call" });

    expect(() => fireEvent.click(messageButton)).not.toThrow();
    expect(() => fireEvent.click(callButton)).not.toThrow();
  });

  it("handles empty stats array", () => {
    const managerWithoutStats: Manager = {
      ...mockManager,
      stats: [],
    };

    const { container } = render(
      <PropertyManager manager={managerWithoutStats} />
    );

    const statsContainer = container.querySelector(".manager-stats");
    expect(statsContainer).toBeInTheDocument();
    expect(statsContainer).toBeEmptyDOMElement();
  });

  it("has correct CSS structure", () => {
    const { container } = render(<PropertyManager manager={mockManager} />);

    expect(container.querySelector(".sidebar-section")).toBeInTheDocument();
    expect(container.querySelector(".manager-card")).toBeInTheDocument();
    expect(container.querySelector(".manager-info")).toBeInTheDocument();
    expect(container.querySelector(".manager-avatar")).toBeInTheDocument();
    expect(container.querySelector(".manager-details")).toBeInTheDocument();
    expect(container.querySelector(".manager-stats")).toBeInTheDocument();
    expect(container.querySelector(".manager-actions")).toBeInTheDocument();
  });

  it("renders contact icons", () => {
    const { container } = render(<PropertyManager manager={mockManager} />);

    const phoneIcon = container.querySelector(".bx-phone");
    const emailIcon = container.querySelector(".bx-envelope");

    expect(phoneIcon).toBeInTheDocument();
    expect(emailIcon).toBeInTheDocument();
  });

  it("renders button icons", () => {
    const { container } = render(<PropertyManager manager={mockManager} />);

    const messageIcon = container.querySelector(".bx-message");
    const phoneIcon = container.querySelectorAll(".bx-phone");

    expect(messageIcon).toBeInTheDocument();
    expect(phoneIcon.length).toBeGreaterThan(1); // One in contact, one in button
  });

  it("displays stats in correct format", () => {
    const { container } = render(<PropertyManager manager={mockManager} />);

    const statItems = container.querySelectorAll(".stat-item");
    expect(statItems).toHaveLength(3);

    statItems.forEach((item, index) => {
      const value = item.querySelector(".stat-value");
      const label = item.querySelector(".stat-label");

      expect(value).toHaveTextContent(mockManager.stats[index].value);
      expect(label).toHaveTextContent(mockManager.stats[index].label);
    });
  });
});
