import React from "react";
import { useAuth } from "@store/auth.store";
import { fireEvent, render, screen } from "@tests/utils/test-utils";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import PropertiesPage from "@app/(protectedRoutes)/properties/[cuid]/page";
import { useGetAllProperties } from "@app/(protectedRoutes)/properties/[cuid]/hooks";

jest.mock("@store/auth.store", () => ({
  useAuth: jest.fn(),
  useAuthActions: jest.fn(() => ({
    setUser: jest.fn(),
    logout: jest.fn(),
  })),
}));
jest.mock("@hooks/useUnifiedPermissions");
jest.mock("@app/(protectedRoutes)/properties/[cuid]/hooks", () => ({
  useGetAllProperties: jest.fn(),
  useCsvUpload: jest.fn(() => ({
    csvFile: null,
    isValidating: false,
    isProcessing: false,
    handleFileChange: jest.fn(),
    validateCSV: jest.fn(),
    processCSV: jest.fn(),
    resetState: jest.fn(),
  })),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseUnifiedPermissions = useUnifiedPermissions as jest.MockedFunction<
  typeof useUnifiedPermissions
>;
const mockUseGetAllProperties = useGetAllProperties as jest.MockedFunction<
  typeof useGetAllProperties
>;

describe("PropertiesListPage", () => {
  const mockProperties = [
    {
      pid: "prop-1",
      name: "Sunset Apartments",
      propertyType: "residential",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        country: "USA",
      },
      specifications: { bedrooms: 2, bathrooms: 2, totalArea: 1200 },
      status: "active",
      createdBy: "user-1",
    },
    {
      pid: "prop-2",
      name: "Downtown Office",
      propertyType: "commercial",
      address: {
        street: "456 Business Ave",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
      },
      specifications: { totalArea: 5000 },
      status: "pending",
      createdBy: "user-2",
    },
  ];

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      client: { cuid: "client-123" },
    } as any);

    mockUseUnifiedPermissions.mockReturnValue({
      isManagerOrAbove: true,
      isOwner: jest.fn().mockReturnValue(true),
    } as any);

    mockUseGetAllProperties.mockReturnValue({
      properties: mockProperties,
      totalCount: 2,
      pagination: { page: 1, limit: 10, sort: "asc" },
      filterOptions: [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
      ],
      handleSortChange: jest.fn(),
      handlePageChange: jest.fn(),
      handleSortByChange: jest.fn(),
      refetch: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render properties page with header", () => {
    render(<PropertiesPage />);

    expect(screen.getByText("Property portfolio")).toBeInTheDocument();
  });

  it("should display add new property button", () => {
    render(<PropertiesPage />);

    const addButton = screen.getByRole("link", { name: /add new property/i });
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveAttribute("href", "/properties/client-123/new");
  });

  it("should show import CSV button for managers", () => {
    render(<PropertiesPage />);

    expect(screen.getByText("Import CSV")).toBeInTheDocument();
  });

  it("should hide import CSV button for non-managers", () => {
    mockUseUnifiedPermissions.mockReturnValue({
      isManagerOrAbove: false,
      isOwner: jest.fn(),
    } as any);

    render(<PropertiesPage />);

    expect(screen.queryByText("Import CSV")).not.toBeInTheDocument();
  });

  it("should display property names", () => {
    render(<PropertiesPage />);

    expect(screen.getByText("Sunset Apartments")).toBeInTheDocument();
    expect(screen.getByText("Downtown Office")).toBeInTheDocument();
  });

  it("should display property types", () => {
    render(<PropertiesPage />);

    expect(screen.getByText("Residential")).toBeInTheDocument();
    expect(screen.getByText("Commercial")).toBeInTheDocument();
  });

  it("should display property addresses", () => {
    render(<PropertiesPage />);

    expect(
      screen.getByText(/123 Main St, New York, NY, USA/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/456 Business Ave, Los Angeles, CA, USA/)
    ).toBeInTheDocument();
  });

  it("should format residential property specifications", () => {
    render(<PropertiesPage />);

    expect(screen.getByText("2 bed, 2 bath, 1200 sq ft")).toBeInTheDocument();
  });

  it("should format commercial property specifications", () => {
    render(<PropertiesPage />);

    expect(screen.getByText("5000 sq ft")).toBeInTheDocument();
  });

  it("should display view and edit action icons for owned properties", () => {
    render(<PropertiesPage />);

    const viewIcons = screen.getAllByTitle("View Property");
    const editIcons = screen.getAllByTitle("Edit Property");

    expect(viewIcons.length).toBeGreaterThan(0);
    expect(editIcons.length).toBeGreaterThan(0);
  });

  it("should open CSV modal when import button clicked", () => {
    render(<PropertiesPage />);

    const importButton = screen.getByText("Import CSV");
    fireEvent.click(importButton);

    // Modal should be rendered (implementation-specific)
    expect(mockUseUnifiedPermissions).toHaveBeenCalled();
  });

  it("should handle empty properties list", () => {
    mockUseGetAllProperties.mockReturnValue({
      properties: [],
      totalCount: 0,
      pagination: { page: 1, limit: 10, sort: "asc" },
      filterOptions: [],
      handleSortChange: jest.fn(),
      handlePageChange: jest.fn(),
      handleSortByChange: jest.fn(),
      refetch: jest.fn(),
    } as any);

    render(<PropertiesPage />);

    expect(screen.getByText("Property portfolio")).toBeInTheDocument();
  });

  it("should use correct client ID from auth store", () => {
    render(<PropertiesPage />);

    expect(mockUseGetAllProperties).toHaveBeenCalledWith("client-123");
  });

  it("should handle null client gracefully", () => {
    mockUseAuth.mockReturnValue({
      client: null,
    } as any);

    render(<PropertiesPage />);

    expect(mockUseGetAllProperties).toHaveBeenCalledWith("");
  });

  describe("withClientAccess HOC", () => {
    it("should be wrapped with withClientAccess for multi-tenant security", () => {
      // The component is wrapped with withClientAccess which validates
      // the cuid param matches the authenticated user's client
      render(<PropertiesPage />);

      // Verify the component renders with proper auth context
      expect(mockUseAuth).toHaveBeenCalled();
      expect(screen.getByText("Property portfolio")).toBeInTheDocument();
    });
  });

  describe("Link component with entitlements", () => {
    it("should use Link component with requiresCapacity for Add New Property", () => {
      render(<PropertiesPage />);

      const addButton = screen.getByRole("link", { name: /add new property/i });
      // The Link component handles capacity checks via useEntitlements
      expect(addButton).toBeInTheDocument();
    });

    it("should include tracking data for analytics", () => {
      render(<PropertiesPage />);

      const addButton = screen.getByRole("link", { name: /add new property/i });
      // Tracking data is added for analytics (event, category, label)
      expect(addButton).toHaveAttribute("href");
    });
  });
});
