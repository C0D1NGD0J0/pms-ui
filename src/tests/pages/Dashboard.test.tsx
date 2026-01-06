import React from "react";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { render, screen } from "@tests/utils/test-utils";
import Dashboard from "@app/(protectedRoutes)/dashboard/page";

// Mock the useCurrentUser hook
jest.mock("@hooks/useCurrentUser");
const mockUseCurrentUser = useCurrentUser as jest.MockedFunction<
  typeof useCurrentUser
>;

// Mock test data imports
jest.mock("@test-data/index", () => ({
  serviceRequestColumns: [
    { title: "ID", dataIndex: "id" },
    { title: "Description", dataIndex: "description" },
  ],
  leaseStatusColumns: [
    { title: "ID", dataIndex: "id" },
    { title: "Status", dataIndex: "status" },
  ],
  insightCardsData: [
    {
      id: 1,
      title: "Total Properties",
      value: "24",
      icon: "bx-building",
      trend: { value: 12, isPositive: true },
      description: "Active properties",
    },
    {
      id: 2,
      title: "Total Tenants",
      value: "156",
      icon: "bx-user",
      trend: { value: 8, isPositive: true },
      description: "Active tenants",
    },
  ],
  occupancyColumns: [
    { title: "Property", dataIndex: "property" },
    { title: "Occupancy", dataIndex: "occupancy" },
  ],
  serviceRequests: [
    { id: 1, description: "Plumbing repair", status: "pending" },
    { id: 2, description: "HVAC maintenance", status: "completed" },
  ],
  serviceTypeData: [
    { name: "Plumbing", value: 15 },
    { name: "Electrical", value: 10 },
  ],
  paymentColumns: [
    { title: "Tenant", dataIndex: "tenant" },
    { title: "Amount", dataIndex: "amount" },
  ],
  leaseStatuses: [
    { id: 1, tenant: "John Doe", status: "active" },
    { id: 2, tenant: "Jane Smith", status: "pending" },
  ],
  occupancyData: [
    { id: 1, property: "Building A", occupancy: "95%" },
    { id: 2, property: "Building B", occupancy: "87%" },
  ],
  priorityData: [
    { name: "High", value: 5 },
    { name: "Medium", value: 12 },
    { name: "Low", value: 8 },
  ],
  payments: [
    { id: 1, tenant: "John Doe", amount: "$1,500" },
    { id: 2, tenant: "Jane Smith", amount: "$2,000" },
  ],
}));

describe("Dashboard Page", () => {
  beforeEach(() => {
    mockUseCurrentUser.mockReturnValue({
      user: {
        uid: "user-123",
        displayName: "John Doe",
        email: "john@example.com",
        role: "admin",
      },
      isLoading: false,
      error: null,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render dashboard page", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("should display welcome message with user name", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText(/Welcome John Doe/i)).toBeInTheDocument();
    });

    it("should display current date in welcome message", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      // Check for month names that should be in the formatted date
      const dateElement = screen.getByText(/Welcome John Doe/i);
      expect(dateElement.textContent).toMatch(/\w+day, \w+ \d+, \d{4}/);
    });

    it("should render 'Add new property' button", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      const addButton = screen.getByRole("link", {
        name: /add new property/i,
      });
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveAttribute("href", "/properties/new");
    });
  });

  describe("Insight Cards", () => {
    it("should render insight cards", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("Total Properties")).toBeInTheDocument();
      expect(screen.getByText("Total Tenants")).toBeInTheDocument();
    });

    it("should display insight card values", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("24")).toBeInTheDocument();
      expect(screen.getByText("156")).toBeInTheDocument();
    });

    it("should display insight card descriptions", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("Active properties")).toBeInTheDocument();
      expect(screen.getByText("Active tenants")).toBeInTheDocument();
    });
  });

  describe("Data Tables", () => {
    it("should render Service Requests table", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("Service Requests")).toBeInTheDocument();
    });

    it("should render Upcoming Payments table", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("Upcoming Payments")).toBeInTheDocument();
    });

    it("should render Lease Status table", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("Lease Status")).toBeInTheDocument();
    });

    it("should render Occupancy by Property table", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("Occupancy by Property")).toBeInTheDocument();
    });
  });

  describe("Charts and Analytics", () => {
    it("should render Maintenance Request Analysis section", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(
        screen.getByText("Maintenance Request Analysis")
      ).toBeInTheDocument();
    });

    it("should render By Priority chart", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("By Priority")).toBeInTheDocument();
    });

    it("should render Service type chart", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("Service type")).toBeInTheDocument();
    });
  });

  describe("User Context", () => {
    it("should display different user names based on current user", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          uid: "user-456",
          displayName: "Jane Smith",
          email: "jane@example.com",
          role: "manager",
        },
        isLoading: false,
        error: null,
      } as any);

      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText(/Welcome Jane Smith/i)).toBeInTheDocument();
    });

    it("should handle user without displayName", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          uid: "user-789",
          email: "user@example.com",
          role: "staff",
        },
        isLoading: false,
        error: null,
      } as any);

      render(<Dashboard />, { withNotifications: false, withEvents: false });

      // Should still render dashboard even without displayName
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("should handle null user gracefully", () => {
      mockUseCurrentUser.mockReturnValue({
        user: null,
        isLoading: false,
        error: null,
      } as any);

      render(<Dashboard />, { withNotifications: false, withEvents: false });

      // Should still render dashboard structure
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });

  describe("Layout and Structure", () => {
    it("should have page container with correct class", () => {
      const { container } = render(<Dashboard />, {
        withNotifications: false,
        withEvents: false,
      });

      const pageElement = container.querySelector(".page.admin-dashboard");
      expect(pageElement).toBeInTheDocument();
    });

    it("should render insights section", () => {
      const { container } = render(<Dashboard />, {
        withNotifications: false,
        withEvents: false,
      });

      const insightsSection = container.querySelector(".insights");
      expect(insightsSection).toBeInTheDocument();
    });

    it("should render flex-row containers", () => {
      const { container } = render(<Dashboard />, {
        withNotifications: false,
        withEvents: false,
      });

      const flexRows = container.querySelectorAll(".flex-row");
      expect(flexRows.length).toBeGreaterThan(0);
    });
  });

  describe("Data Display", () => {
    it("should display service request data", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("Plumbing repair")).toBeInTheDocument();
      expect(screen.getByText("HVAC maintenance")).toBeInTheDocument();
    });

    it("should display lease status data", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      // Check for tenant names in lease statuses
      const johnDoeElements = screen.getAllByText("John Doe");
      expect(johnDoeElements.length).toBeGreaterThan(0);

      const janeSmithElements = screen.getAllByText("Jane Smith");
      expect(janeSmithElements.length).toBeGreaterThan(0);
    });

    it("should display occupancy data", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("Building A")).toBeInTheDocument();
      expect(screen.getByText("Building B")).toBeInTheDocument();
    });

    it("should display payment data", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      expect(screen.getByText("$1,500")).toBeInTheDocument();
      expect(screen.getByText("$2,000")).toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    it("should format date in long format", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      const dateRegex = /\w+day, \w+ \d+, \d{4}/;
      const welcomeText = screen.getByText(/Welcome/i);

      expect(welcomeText.textContent).toMatch(dateRegex);
    });

    it("should display current year in date", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      const currentYear = new Date().getFullYear();
      const welcomeText = screen.getByText(/Welcome/i);

      expect(welcomeText.textContent).toContain(String(currentYear));
    });
  });

  describe("Navigation", () => {
    it("should have correct href for add property button", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      const addButton = screen.getByRole("link", {
        name: /add new property/i,
      });

      expect(addButton).toHaveAttribute("href", "/properties/new");
    });

    it("should have property button with correct icon", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      const addButton = screen.getByRole("link", {
        name: /add new property/i,
      });
      const icon = addButton.querySelector("i.bx-plus-circle");

      expect(icon).toBeInTheDocument();
    });

    it("should have button with success styling", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      const addButton = screen.getByRole("link", {
        name: /add new property/i,
      });

      expect(addButton).toHaveClass("btn", "btn-success");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      // PageHeader should render main heading
      const heading = screen.getByText("Dashboard");
      expect(heading).toBeInTheDocument();
    });

    it("should render tables with proper accessibility", () => {
      render(<Dashboard />, { withNotifications: false, withEvents: false });

      // Tables should be accessible
      expect(screen.getByText("Service Requests")).toBeInTheDocument();
      expect(screen.getByText("Upcoming Payments")).toBeInTheDocument();
    });
  });
});
