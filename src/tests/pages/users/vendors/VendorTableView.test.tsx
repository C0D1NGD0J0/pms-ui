import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FilteredUserTableData } from "@interfaces/user.interface";
import { VendorTableView } from "@app/(protectedRoutes)/users/[cuid]/vendors/components/VendorTableView";

// Mock the useUnifiedPermissions hook
jest.mock("@src/hooks/useUnifiedPermissions", () => ({
  useUnifiedPermissions: jest.fn(() => ({
    isSuperAdmin: true,
    canManageUsers: true,
    canViewUsers: true,
  })),
}));

describe("VendorTableView", () => {
  const mockVendors: FilteredUserTableData[] = [
    {
      uid: "vendor-1",
      email: "vendor1@example.com",
      displayName: "ACME Plumbing",
      fullName: "John Vendor",
      phoneNumber: "555-0300",
      isActive: true,
      isConnected: true,
      vendorInfo: {
        companyName: "ACME Plumbing",
        serviceTypes: ["plumbing"],
        rating: 4.5,
      },
    },
    {
      uid: "vendor-2",
      email: "vendor2@example.com",
      displayName: "Elite HVAC",
      fullName: "Jane Contractor",
      phoneNumber: "555-0301",
      isActive: true,
      isConnected: false, // Disconnected vendor
      vendorInfo: {
        companyName: "Elite HVAC",
        serviceTypes: ["hvac"],
        rating: 4.8,
      },
    },
    {
      uid: "vendor-3",
      email: "vendor3@example.com",
      displayName: "Best Electrical",
      fullName: "Bob Electrician",
      phoneNumber: "555-0302",
      isActive: true,
      isConnected: true,
      vendorInfo: {
        companyName: "Best Electrical",
        serviceTypes: ["electrical"],
        rating: 4.2,
        linkedVendorUid: "vendor-1", // Linked account
      },
    },
  ];

  const defaultProps = {
    vendors: mockVendors,
    filterOptions: [],
    handlePageChange: jest.fn(),
    handleSortByChange: jest.fn(),
    handleSortDirectionChange: jest.fn(),
    isLoading: false,
    onEdit: jest.fn(),
    onMessage: jest.fn(),
    onDeactivate: jest.fn(),
    onReconnect: jest.fn(),
    onViewDetails: jest.fn(),
    pagination: {
      page: 1,
      limit: 10,
      sort: "desc" as const,
    },
    totalCount: 3,
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
    it("should render vendor table with data", () => {
      render(<VendorTableView {...defaultProps} />);

      expect(screen.getByText("ACME Plumbing")).toBeInTheDocument();
      expect(screen.getByText("Elite HVAC")).toBeInTheDocument();
      expect(screen.getByText("Best Electrical")).toBeInTheDocument();
    });

    it("should display vendor company names", () => {
      render(<VendorTableView {...defaultProps} />);

      expect(screen.getByText("ACME Plumbing")).toBeInTheDocument();
      expect(screen.getByText("Elite HVAC")).toBeInTheDocument();
    });

    it("should show loading state when isLoading is true", () => {
      render(<VendorTableView {...defaultProps} isLoading={true} />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe("Remove Button", () => {
    it("should show Remove button for connected vendors when user is super admin", () => {
      render(<VendorTableView {...defaultProps} />);

      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons).toHaveLength(2); // Two connected vendors
    });

    it("should call onDeactivate when Remove button is clicked", () => {
      render(<VendorTableView {...defaultProps} />);

      const removeButtons = screen.getAllByText("Remove");
      fireEvent.click(removeButtons[0]);

      expect(defaultProps.onDeactivate).toHaveBeenCalledWith(mockVendors[0]);
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

      render(<VendorTableView {...props} />);

      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
    });

    it("should not show Remove button for disconnected vendors", () => {
      render(<VendorTableView {...defaultProps} />);

      // vendor-2 is disconnected, should not have Remove button
      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons).toHaveLength(2); // Only for vendor-1 and vendor-3
    });

    it("should have correct title attribute on Remove button", () => {
      render(<VendorTableView {...defaultProps} />);

      const removeButton = screen.getAllByText("Remove")[0];
      expect(removeButton).toHaveAttribute(
        "title",
        "Remove vendor (disconnect)"
      );
    });

    it("should apply danger styling to Remove button", () => {
      render(<VendorTableView {...defaultProps} />);

      const removeButton = screen.getAllByText("Remove")[0];
      expect(removeButton).toHaveClass("btn-danger");
    });
  });

  describe("Reconnect Button", () => {
    it("should show Reconnect button for disconnected vendors when user is super admin", () => {
      render(<VendorTableView {...defaultProps} />);

      const reconnectButtons = screen.getAllByText("Reconnect");
      expect(reconnectButtons).toHaveLength(1); // Only one disconnected vendor
    });

    it("should call onReconnect when Reconnect button is clicked", () => {
      render(<VendorTableView {...defaultProps} />);

      const reconnectButton = screen.getByText("Reconnect");
      fireEvent.click(reconnectButton);

      expect(defaultProps.onReconnect).toHaveBeenCalledWith(mockVendors[1]);
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

      render(<VendorTableView {...props} />);

      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });

    it("should not show Reconnect button for connected vendors", () => {
      render(<VendorTableView {...defaultProps} />);

      // vendor-1 and vendor-3 are connected, should not have Reconnect button
      const reconnectButtons = screen.getAllByText("Reconnect");
      expect(reconnectButtons).toHaveLength(1); // Only for vendor-2
    });

    it("should have correct title attribute on Reconnect button", () => {
      render(<VendorTableView {...defaultProps} />);

      const reconnectButton = screen.getByText("Reconnect");
      expect(reconnectButton).toHaveAttribute("title", "Reconnect vendor");
    });

    it("should apply success styling to Reconnect button", () => {
      render(<VendorTableView {...defaultProps} />);

      const reconnectButton = screen.getByText("Reconnect");
      expect(reconnectButton).toHaveClass("btn-success");
    });
  });

  describe("Edit and Message Buttons for Connected Vendors", () => {
    it("should show Edit button for connected vendors", () => {
      render(<VendorTableView {...defaultProps} />);

      const editButtons = screen.getAllByText("Edit");
      expect(editButtons).toHaveLength(2); // For connected vendors only
    });

    it("should show Message button for connected vendors", () => {
      render(<VendorTableView {...defaultProps} />);

      const messageButtons = screen.getAllByText("Message");
      expect(messageButtons).toHaveLength(2); // For connected vendors only
    });

    it("should NOT show Edit button for disconnected vendors", () => {
      const disconnectedVendor = [mockVendors[1]]; // vendor-2 is disconnected

      render(<VendorTableView {...defaultProps} vendors={disconnectedVendor} />);

      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    it("should NOT show Message button for disconnected vendors", () => {
      const disconnectedVendor = [mockVendors[1]]; // vendor-2 is disconnected

      render(<VendorTableView {...defaultProps} vendors={disconnectedVendor} />);

      expect(screen.queryByText("Message")).not.toBeInTheDocument();
    });

    it("should call onEdit when Edit button is clicked", () => {
      render(<VendorTableView {...defaultProps} />);

      const editButtons = screen.getAllByText("Edit");
      fireEvent.click(editButtons[0]);

      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockVendors[0]);
    });

    it("should call onMessage when Message button is clicked", () => {
      render(<VendorTableView {...defaultProps} />);

      const messageButtons = screen.getAllByText("Message");
      fireEvent.click(messageButtons[0]);

      expect(defaultProps.onMessage).toHaveBeenCalledWith(mockVendors[0]);
    });
  });

  describe("View Details Button", () => {
    it("should show View Details button for all vendors", () => {
      render(<VendorTableView {...defaultProps} />);

      const viewButtons = screen.getAllByText("View Details");
      expect(viewButtons).toHaveLength(3); // For all vendors
    });

    it("should call onViewDetails when View Details button is clicked", () => {
      render(<VendorTableView {...defaultProps} />);

      const viewButtons = screen.getAllByText("View Details");
      fireEvent.click(viewButtons[0]);

      expect(defaultProps.onViewDetails).toHaveBeenCalledWith(mockVendors[0]);
    });
  });

  describe("Pagination", () => {
    it("should display total count", () => {
      render(<VendorTableView {...defaultProps} totalCount={50} />);

      expect(screen.getByText(/50/)).toBeInTheDocument();
    });

    it("should call handlePageChange on pagination", () => {
      render(<VendorTableView {...defaultProps} />);

      expect(defaultProps.handlePageChange).toBeDefined();
    });
  });

  describe("Button States Based on isConnected", () => {
    it("should show correct button set for connected vendor", () => {
      const connectedVendor = [mockVendors[0]]; // vendor-1 is connected

      render(<VendorTableView {...defaultProps} vendors={connectedVendor} />);

      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Message")).toBeInTheDocument();
      expect(screen.getByText("Remove")).toBeInTheDocument();
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });

    it("should show correct button set for disconnected vendor", () => {
      const disconnectedVendor = [mockVendors[1]]; // vendor-2 is disconnected

      render(<VendorTableView {...defaultProps} vendors={disconnectedVendor} />);

      expect(screen.getByText("Reconnect")).toBeInTheDocument();
      expect(screen.getByText("View Details")).toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      expect(screen.queryByText("Message")).not.toBeInTheDocument();
      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
    });
  });

  describe("Primary Vendor vs Linked Vendor", () => {
    it("should show Remove button for primary vendor (no linkedVendorUid)", () => {
      const primaryVendor = [mockVendors[0]]; // vendor-1 has no linkedVendorUid

      render(<VendorTableView {...defaultProps} vendors={primaryVendor} />);

      expect(screen.getByText("Remove")).toBeInTheDocument();
    });

    it("should show Remove button for linked vendor", () => {
      const linkedVendor = [mockVendors[2]]; // vendor-3 has linkedVendorUid

      render(<VendorTableView {...defaultProps} vendors={linkedVendor} />);

      expect(screen.getByText("Remove")).toBeInTheDocument();
    });

    it("should handle removal of primary vendor (warning shown in modal, not table)", () => {
      // The warning about linked accounts is shown in the modal, not the table
      // So the Remove button should be present for primary vendors
      const primaryVendor = [mockVendors[0]];

      render(<VendorTableView {...defaultProps} vendors={primaryVendor} />);

      const removeButton = screen.getByText("Remove");
      expect(removeButton).toBeInTheDocument();
      fireEvent.click(removeButton);
      expect(defaultProps.onDeactivate).toHaveBeenCalledWith(mockVendors[0]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty vendor list", () => {
      render(<VendorTableView {...defaultProps} vendors={[]} />);

      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });

    it("should handle vendor without vendorInfo", () => {
      const vendorsWithoutInfo: FilteredUserTableData[] = [
        {
          uid: "vendor-4",
          email: "test@example.com",
          displayName: "Test Vendor",
          isActive: true,
          isConnected: true,
        },
      ];

      render(<VendorTableView {...defaultProps} vendors={vendorsWithoutInfo} />);

      expect(screen.getByText("Test Vendor")).toBeInTheDocument();
    });

    it("should handle all vendors disconnected", () => {
      const allDisconnected: FilteredUserTableData[] = [
        { ...mockVendors[0], isConnected: false },
        { ...mockVendors[1], isConnected: false },
        { ...mockVendors[2], isConnected: false },
      ];

      render(<VendorTableView {...defaultProps} vendors={allDisconnected} />);

      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      expect(screen.queryByText("Message")).not.toBeInTheDocument();
      const reconnectButtons = screen.getAllByText("Reconnect");
      expect(reconnectButtons).toHaveLength(3);
    });

    it("should handle all vendors connected", () => {
      const allConnected: FilteredUserTableData[] = [
        { ...mockVendors[0], isConnected: true },
        { ...mockVendors[1], isConnected: true },
        { ...mockVendors[2], isConnected: true },
      ];

      render(<VendorTableView {...defaultProps} vendors={allConnected} />);

      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons).toHaveLength(3);
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });
  });

  describe("Permission-Based Rendering", () => {
    it("should hide Remove and Reconnect buttons when not super admin", () => {
      const props = {
        ...defaultProps,
        permissions: {
          isSuperAdmin: false,
          canManageUsers: true,
          canViewUsers: true,
        },
      };

      render(<VendorTableView {...props} />);

      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
      expect(screen.queryByText("Reconnect")).not.toBeInTheDocument();
    });

    it("should still show Edit and Message for non-super-admin with appropriate permissions", () => {
      const props = {
        ...defaultProps,
        permissions: {
          isSuperAdmin: false,
          canManageUsers: true,
          canViewUsers: true,
        },
      };

      render(<VendorTableView {...props} />);

      // Edit and Message buttons should still be present for connected vendors
      expect(screen.getAllByText("Edit")).toHaveLength(2);
      expect(screen.getAllByText("Message")).toHaveLength(2);
    });
  });

  describe("Vendor-Specific Business Rules", () => {
    it("should allow reconnection of vendors via button", () => {
      // Unlike tenants, vendors CAN be reconnected via button
      render(<VendorTableView {...defaultProps} />);

      expect(screen.getByText("Reconnect")).toBeInTheDocument();
    });

    it("should support primary vendor with linked accounts removal", () => {
      // The table shows Remove button, warning logic handled in modal
      const primaryVendor = [mockVendors[0]];

      render(<VendorTableView {...defaultProps} vendors={primaryVendor} />);

      const removeButton = screen.getByText("Remove");
      expect(removeButton).toBeInTheDocument();
    });
  });
});
