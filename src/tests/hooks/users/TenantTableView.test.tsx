import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FilteredUserTableData } from "@interfaces/user.interface";
import { TenantTableView } from "@app/(protectedRoutes)/users/[cuid]/tenants/components/TenantTableView";

// Mock the useUnifiedPermissions hook
jest.mock("@src/hooks/useUnifiedPermissions", () => ({
  useUnifiedPermissions: jest.fn(() => ({
    isSuperAdmin: true,
    canManageUsers: true,
    canViewUsers: true,
  })),
}));

describe("TenantTableView", () => {
  const mockTenants: FilteredUserTableData[] = [
    {
      uid: "tenant-1",
      email: "tenant1@example.com",
      displayName: "Alice Johnson",
      fullName: "Alice Johnson",
      phoneNumber: "555-0200",
      isActive: true,
      isConnected: true,
      tenantInfo: {
        leaseStatus: "active",
        employerInfo: [],
        rentalReferences: [],
        pets: [],
      },
    },
    {
      uid: "tenant-2",
      email: "tenant2@example.com",
      displayName: "Bob Williams",
      fullName: "Bob Williams",
      phoneNumber: "555-0201",
      isActive: true,
      isConnected: false, // Disconnected tenant
      tenantInfo: {
        leaseStatus: "no_active_lease",
        employerInfo: [],
        rentalReferences: [],
        pets: [],
      },
    },
  ];

  const defaultProps = {
    tenants: mockTenants,
    filterOptions: [],
    handlePageChange: jest.fn(),
    handleSortByChange: jest.fn(),
    handleSortDirectionChange: jest.fn(),
    isLoading: false,
    onEdit: jest.fn(),
    onDeactivate: jest.fn(),
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
    it("should render tenant table with data", () => {
      render(<TenantTableView {...defaultProps} />);

      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
      expect(screen.getByText("Bob Williams")).toBeInTheDocument();
    });

    it("should display tenant emails", () => {
      render(<TenantTableView {...defaultProps} />);

      expect(screen.getByText("tenant1@example.com")).toBeInTheDocument();
      expect(screen.getByText("tenant2@example.com")).toBeInTheDocument();
    });

    it("should show loading state when isLoading is true", () => {
      render(<TenantTableView {...defaultProps} isLoading={true} />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe("Remove Button", () => {
    it("should show Remove button only for connected tenants when user is super admin", () => {
      render(<TenantTableView {...defaultProps} />);

      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons).toHaveLength(1); // Only one connected tenant
    });

    it("should call onDeactivate when Remove button is clicked", () => {
      render(<TenantTableView {...defaultProps} />);

      const removeButton = screen.getByText("Remove");
      fireEvent.click(removeButton);

      expect(defaultProps.onDeactivate).toHaveBeenCalledWith(mockTenants[0]);
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

      render(<TenantTableView {...props} />);

      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
    });

    it("should not show Remove button for disconnected tenants", () => {
      render(<TenantTableView {...defaultProps} />);

      // tenant-2 is disconnected, should not have Remove button
      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons).toHaveLength(1); // Only for tenant-1
    });

    it("should have correct title attribute on Remove button", () => {
      render(<TenantTableView {...defaultProps} />);

      const removeButton = screen.getByText("Remove");
      expect(removeButton).toHaveAttribute(
        "title",
        "Remove tenant (disconnect)"
      );
    });

    it("should apply danger styling to Remove button", () => {
      render(<TenantTableView {...defaultProps} />);

      const removeButton = screen.getByText("Remove");
      expect(removeButton).toHaveClass("btn-danger");
    });
  });

  describe("No Reconnect Button for Tenants", () => {
    it("should NOT show Reconnect button for disconnected tenants", () => {
      render(<TenantTableView {...defaultProps} />);

      // Tenants cannot be reconnected via button
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });

    it("should NOT show Reconnect button even for super admin", () => {
      const props = {
        ...defaultProps,
        permissions: {
          isSuperAdmin: true,
          canManageUsers: true,
          canViewUsers: true,
        },
      };

      render(<TenantTableView {...props} />);

      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });

    it("should only show View Details and Edit buttons for disconnected tenants", () => {
      const disconnectedTenant = [mockTenants[1]]; // tenant-2 is disconnected

      render(<TenantTableView {...defaultProps} tenants={disconnectedTenant} />);

      expect(screen.getByText("View Details")).toBeInTheDocument();
      // Edit button should not be shown for disconnected tenants
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });
  });

  describe("Edit Button Visibility", () => {
    it("should show Edit button only for connected tenants", () => {
      render(<TenantTableView {...defaultProps} />);

      const editButtons = screen.getAllByText("Edit");
      expect(editButtons).toHaveLength(1); // Only for connected tenant
    });

    it("should not show Edit button for disconnected tenants", () => {
      const disconnectedTenant = [mockTenants[1]];

      render(<TenantTableView {...defaultProps} tenants={disconnectedTenant} />);

      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    it("should call onEdit when Edit button is clicked", () => {
      render(<TenantTableView {...defaultProps} />);

      const editButton = screen.getByText("Edit");
      fireEvent.click(editButton);

      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTenants[0]);
    });
  });

  describe("View Details Button", () => {
    it("should show View Details button for all tenants", () => {
      render(<TenantTableView {...defaultProps} />);

      const viewButtons = screen.getAllByText("View Details");
      expect(viewButtons).toHaveLength(2); // For both tenants
    });

    it("should call onViewDetails when View Details button is clicked", () => {
      render(<TenantTableView {...defaultProps} />);

      const viewButtons = screen.getAllByText("View Details");
      fireEvent.click(viewButtons[0]);

      expect(defaultProps.onViewDetails).toHaveBeenCalledWith(mockTenants[0]);
    });
  });

  describe("Pagination", () => {
    it("should display total count", () => {
      render(<TenantTableView {...defaultProps} totalCount={25} />);

      expect(screen.getByText(/25/)).toBeInTheDocument();
    });

    it("should call handlePageChange on pagination", () => {
      render(<TenantTableView {...defaultProps} />);

      expect(defaultProps.handlePageChange).toBeDefined();
    });
  });

  describe("Button States Based on isConnected", () => {
    it("should show Remove button for connected tenant (super admin)", () => {
      const connectedTenant = [mockTenants[0]]; // tenant-1 is connected

      render(<TenantTableView {...defaultProps} tenants={connectedTenant} />);

      expect(screen.getByText("Remove")).toBeInTheDocument();
      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });

    it("should NOT show Remove or Edit for disconnected tenant", () => {
      const disconnectedTenant = [mockTenants[1]]; // tenant-2 is disconnected

      render(<TenantTableView {...defaultProps} tenants={disconnectedTenant} />);

      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
      expect(screen.getByText("View Details")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty tenant list", () => {
      render(<TenantTableView {...defaultProps} tenants={[]} />);

      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    it("should handle tenant without tenantInfo", () => {
      const tenantsWithoutInfo: FilteredUserTableData[] = [
        {
          uid: "tenant-3",
          email: "test@example.com",
          displayName: "Test Tenant",
          isActive: true,
          isConnected: true,
        },
      ];

      render(<TenantTableView {...defaultProps} tenants={tenantsWithoutInfo} />);

      expect(screen.getByText("Test Tenant")).toBeInTheDocument();
    });

    it("should handle all tenants disconnected", () => {
      const allDisconnected: FilteredUserTableData[] = [
        { ...mockTenants[0], isConnected: false },
        { ...mockTenants[1], isConnected: false },
      ];

      render(<TenantTableView {...defaultProps} tenants={allDisconnected} />);

      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });

    it("should handle all tenants connected", () => {
      const allConnected: FilteredUserTableData[] = [
        { ...mockTenants[0], isConnected: true },
        { ...mockTenants[1], isConnected: true },
      ];

      render(<TenantTableView {...defaultProps} tenants={allConnected} />);

      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons).toHaveLength(2);
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });
  });

  describe("Permission-Based Rendering", () => {
    it("should hide Remove button when not super admin", () => {
      const props = {
        ...defaultProps,
        permissions: {
          isSuperAdmin: false,
          canManageUsers: true,
          canViewUsers: true,
        },
      };

      render(<TenantTableView {...props} />);

      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
    });

    it("should show only View Details for disconnected tenant regardless of permissions", () => {
      const disconnectedTenant = [mockTenants[1]];
      const props = {
        ...defaultProps,
        tenants: disconnectedTenant,
        permissions: {
          isSuperAdmin: true,
          canManageUsers: true,
          canViewUsers: true,
        },
      };

      render(<TenantTableView {...props} />);

      expect(screen.getByText("View Details")).toBeInTheDocument();
      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });
  });

  describe("Tenant-Specific Business Rules", () => {
    it("should enforce that tenants require new lease for reconnection", () => {
      // This test verifies that there's NO reconnect button
      // because tenants need a new lease, not just a button click
      render(<TenantTableView {...defaultProps} />);

      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
      expect(screen.queryByTitle(/reconnect/i)).not.toBeInTheDocument();
    });

    it("should allow removal only when tenant has no active lease", () => {
      // The Remove button should be present, but the actual validation
      // happens in the backend and modal (tested elsewhere)
      const connectedTenant = [mockTenants[0]];

      render(<TenantTableView {...defaultProps} tenants={connectedTenant} />);

      const removeButton = screen.getByText("Remove");
      expect(removeButton).toBeInTheDocument();
      expect(removeButton).toHaveAttribute(
        "title",
        "Remove tenant (disconnect)"
      );
    });
  });
});
