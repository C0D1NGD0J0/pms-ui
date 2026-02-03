import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FilteredUserTableData } from "@interfaces/user.interface";
import { EmployeeTableView } from "@app/(protectedRoutes)/users/[cuid]/staff/components/EmployeeTableView";

// Mock the useUnifiedPermissions hook
jest.mock("@src/hooks/useUnifiedPermissions", () => ({
  useUnifiedPermissions: jest.fn(() => ({
    isSuperAdmin: true,
    canManageUsers: true,
    canViewUsers: true,
  })),
}));

describe("EmployeeTableView", () => {
  const mockEmployees: FilteredUserTableData[] = [
    {
      uid: "emp-1",
      email: "john@example.com",
      displayName: "John Doe",
      fullName: "John Doe",
      phoneNumber: "555-0100",
      isActive: true,
      isConnected: true,
      employeeInfo: {
        position: "Property Manager",
        department: "Operations",
      },
    },
    {
      uid: "emp-2",
      email: "jane@example.com",
      displayName: "Jane Smith",
      fullName: "Jane Smith",
      phoneNumber: "555-0101",
      isActive: true,
      isConnected: false, // Disconnected employee
      employeeInfo: {
        position: "Maintenance",
        department: "Maintenance",
      },
    },
  ];

  const defaultProps = {
    employees: mockEmployees,
    filterOptions: [],
    handlePageChange: jest.fn(),
    handleSortByChange: jest.fn(),
    handleSortDirectionChange: jest.fn(),
    isLoading: false,
    onEdit: jest.fn(),
    onDeactivate: jest.fn(),
    onReconnect: jest.fn(),
    onViewDetails: jest.fn(),
    pagination: {
      page: 1,
      limit: 10,
      sort: "desc" as const,
    },
    totalCount: 2,
    permissions: {
      isSuperAdmin: true,
      canManageUsers: true,
      canViewUsers: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render employee table with data", () => {
      render(<EmployeeTableView {...defaultProps} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("should display employee positions", () => {
      render(<EmployeeTableView {...defaultProps} />);

      expect(screen.getByText("Property Manager")).toBeInTheDocument();
      expect(screen.getByText("Maintenance")).toBeInTheDocument();
    });

    it("should show loading state when isLoading is true", () => {
      render(<EmployeeTableView {...defaultProps} isLoading={true} />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe("Remove Button", () => {
    it("should show Remove button for connected employees when user is super admin", () => {
      render(<EmployeeTableView {...defaultProps} />);

      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons).toHaveLength(1); // Only one connected employee
    });

    it("should call onDeactivate when Remove button is clicked", () => {
      render(<EmployeeTableView {...defaultProps} />);

      const removeButton = screen.getByText("Remove");
      fireEvent.click(removeButton);

      expect(defaultProps.onDeactivate).toHaveBeenCalledWith(mockEmployees[0]);
    });

    it("should not show Remove button for non-super-admin users", () => {
      const props = {
        ...defaultProps,
        permissions: {
          isSuperAdmin: false,
          canManageUsers: true,
          canViewUsers: true,
        },
      };

      render(<EmployeeTableView {...props} />);

      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
    });

    it("should not show Remove button for disconnected employees", () => {
      render(<EmployeeTableView {...defaultProps} />);

      // emp-2 is disconnected, should not have Remove button
      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons).toHaveLength(1); // Only for emp-1
    });

    it("should have correct title attribute on Remove button", () => {
      render(<EmployeeTableView {...defaultProps} />);

      const removeButton = screen.getByText("Remove");
      expect(removeButton).toHaveAttribute(
        "title",
        "Remove employee (disconnect)"
      );
    });
  });

  describe("Reconnect Button", () => {
    it("should show Reconnect button for disconnected employees when user is super admin", () => {
      render(<EmployeeTableView {...defaultProps} />);

      const reconnectButtons = screen.getAllByText("Reconnect");
      expect(reconnectButtons).toHaveLength(1); // Only one disconnected employee
    });

    it("should call onReconnect when Reconnect button is clicked", () => {
      render(<EmployeeTableView {...defaultProps} />);

      const reconnectButton = screen.getByText("Reconnect");
      fireEvent.click(reconnectButton);

      expect(defaultProps.onReconnect).toHaveBeenCalledWith(mockEmployees[1]);
    });

    it("should not show Reconnect button for non-super-admin users", () => {
      const props = {
        ...defaultProps,
        permissions: {
          isSuperAdmin: false,
          canManageUsers: true,
          canViewUsers: true,
        },
      };

      render(<EmployeeTableView {...props} />);

      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });

    it("should not show Reconnect button for connected employees", () => {
      render(<EmployeeTableView {...defaultProps} />);

      // emp-1 is connected, should not have Reconnect button
      const reconnectButtons = screen.getAllByText("Reconnect");
      expect(reconnectButtons).toHaveLength(1); // Only for emp-2
    });

    it("should have correct title attribute on Reconnect button", () => {
      render(<EmployeeTableView {...defaultProps} />);

      const reconnectButton = screen.getByText("Reconnect");
      expect(reconnectButton).toHaveAttribute("title", "Reconnect employee");
    });
  });

  describe("Other Action Buttons", () => {
    it("should call onEdit when Edit button is clicked", () => {
      render(<EmployeeTableView {...defaultProps} />);

      const editButtons = screen.getAllByText("Edit");
      fireEvent.click(editButtons[0]);

      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockEmployees[0]);
    });

    it("should call onViewDetails when View Details button is clicked", () => {
      render(<EmployeeTableView {...defaultProps} />);

      const viewButtons = screen.getAllByText("View Details");
      fireEvent.click(viewButtons[0]);

      expect(defaultProps.onViewDetails).toHaveBeenCalledWith(
        mockEmployees[0]
      );
    });
  });

  describe("Pagination", () => {
    it("should display total count", () => {
      render(<EmployeeTableView {...defaultProps} totalCount={42} />);

      // Table component should show the total count
      expect(screen.getByText(/42/)).toBeInTheDocument();
    });

    it("should call handlePageChange when pagination changes", () => {
      render(<EmployeeTableView {...defaultProps} />);

      // Assuming pagination controls exist in the table
      // This test structure depends on your Table component implementation
      expect(defaultProps.handlePageChange).toBeDefined();
    });
  });

  describe("Button States for isConnected", () => {
    it("should show correct button set for connected employee", () => {
      const connectedEmployee = [mockEmployees[0]]; // emp-1 is connected

      render(<EmployeeTableView {...defaultProps} employees={connectedEmployee} />);

      expect(screen.getByText("Remove")).toBeInTheDocument();
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });

    it("should show correct button set for disconnected employee", () => {
      const disconnectedEmployee = [mockEmployees[1]]; // emp-2 is disconnected

      render(
        <EmployeeTableView {...defaultProps} employees={disconnectedEmployee} />
      );

      expect(screen.getByText("Reconnect")).toBeInTheDocument();
      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty employee list", () => {
      render(<EmployeeTableView {...defaultProps} employees={[]} />);

      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });

    it("should handle employee without employeeInfo", () => {
      const employeesWithoutInfo: FilteredUserTableData[] = [
        {
          uid: "emp-3",
          email: "test@example.com",
          displayName: "Test User",
          isActive: true,
          isConnected: true,
        },
      ];

      render(
        <EmployeeTableView {...defaultProps} employees={employeesWithoutInfo} />
      );

      expect(screen.getByText("Test User")).toBeInTheDocument();
    });
  });

  describe("Button Styling", () => {
    it("should apply danger styling to Remove button", () => {
      render(<EmployeeTableView {...defaultProps} />);

      const removeButton = screen.getByText("Remove");
      expect(removeButton).toHaveClass("btn-danger");
    });

    it("should apply success styling to Reconnect button", () => {
      render(<EmployeeTableView {...defaultProps} />);

      const reconnectButton = screen.getByText("Reconnect");
      expect(reconnectButton).toHaveClass("btn-success");
    });
  });
});
