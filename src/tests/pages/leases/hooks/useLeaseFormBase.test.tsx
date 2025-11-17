import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useLeaseFormBase } from "@app/(protectedRoutes)/leases/[cuid]/hooks/useLeaseFormBase";
import { useAvailableTenants } from "@app/(protectedRoutes)/leases/[cuid]/hooks/useAvailableTenants";
import { useLeaseDuplication } from "@app/(protectedRoutes)/leases/[cuid]/hooks/useLeaseDuplication";
import { useLeaseableProperties } from "@app/(protectedRoutes)/leases/[cuid]/hooks/useLeaseableProperties";

jest.mock(
  "@app/(protectedRoutes)/leases/[cuid]/hooks/useAvailableTenants"
);
jest.mock(
  "@app/(protectedRoutes)/leases/[cuid]/hooks/useLeaseableProperties"
);
jest.mock(
  "@app/(protectedRoutes)/leases/[cuid]/hooks/useLeaseDuplication"
);

const mockUseAvailableTenants = useAvailableTenants as jest.MockedFunction<
  typeof useAvailableTenants
>;
const mockUseLeaseableProperties =
  useLeaseableProperties as jest.MockedFunction<
    typeof useLeaseableProperties
  >;
const mockUseLeaseDuplication = useLeaseDuplication as jest.MockedFunction<
  typeof useLeaseDuplication
>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  const QueryWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  QueryWrapper.displayName = "QueryWrapper";
  return QueryWrapper;
};

describe("useLeaseFormBase", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAvailableTenants.mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    mockUseLeaseableProperties.mockReturnValue({
      data: { properties: [], metadata: null },
      isLoading: false,
    } as any);

    mockUseLeaseDuplication.mockReturnValue({
      isDuplicating: false,
      duplicateSource: null,
      duplicateData: null,
      error: null,
    });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(
      () => useLeaseFormBase({ cuid: "client-123" }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.leaseForm).toBeDefined();
    expect(result.current.tenantSelectionType).toBe("existing");
  });

  it("should load properties and tenants", async () => {
    const mockProperties = [
      {
        id: "prop-1",
        name: "Property 1",
        address: "123 Main St",
        propertyType: "residential",
      },
    ];

    const mockTenants = [
      { id: "tenant-1", fullName: "John Doe", email: "john@test.com" },
    ];

    mockUseLeaseableProperties.mockReturnValue({
      data: { properties: mockProperties, metadata: null },
      isLoading: false,
    } as any);

    mockUseAvailableTenants.mockReturnValue({
      data: mockTenants,
      isLoading: false,
    } as any);

    const { result } = renderHook(
      () => useLeaseFormBase({ cuid: "client-123" }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.properties).toHaveLength(1);
      expect(result.current.availableTenants).toHaveLength(1);
    });
  });

  it("should create property options", () => {
    const mockProperties = [
      {
        id: "prop-1",
        name: "Property 1",
        address: "123 Main St",
        propertyType: "residential",
      },
      {
        id: "prop-2",
        name: "Property 2",
        address: "456 Oak Ave",
        propertyType: "commercial",
      },
    ];

    mockUseLeaseableProperties.mockReturnValue({
      data: { properties: mockProperties, metadata: null },
      isLoading: false,
    } as any);

    const { result } = renderHook(
      () => useLeaseFormBase({ cuid: "client-123" }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.propertyOptions).toHaveLength(2);
    expect(result.current.propertyOptions[0]).toEqual({
      value: "prop-1",
      label: "Property 1 - 123 Main St",
      property: mockProperties[0],
    });
  });

  it("should create property options", async () => {
    const mockProperties = [
      {
        id: "prop-2",
        name: "Property 2",
        address: "456 Oak Ave",
        propertyType: "commercial",
      },
    ];

    mockUseLeaseableProperties.mockReturnValue({
      data: { properties: mockProperties, metadata: null },
      isLoading: false,
    } as any);

    const { result } = renderHook(
      () => useLeaseFormBase({ cuid: "client-123" }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.propertyOptions).toHaveLength(1);
      expect(result.current.propertyOptions[0].label).toContain("Property 2");
    });
  });

  it("should create tenant options", async () => {
    const mockTenants = [
      { id: "tenant-1", fullName: "John Doe", email: "john@test.com" },
      { id: "tenant-2", fullName: "Jane Smith", email: "jane@test.com" },
    ];

    mockUseAvailableTenants.mockReturnValue({
      data: mockTenants,
      isLoading: false,
    } as any);

    const { result } = renderHook(
      () => useLeaseFormBase({ cuid: "client-123" }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.tenantOptions).toHaveLength(3); // includes "Select a tenant"
    });
  });

  it("should apply duplicate data when available", async () => {
    const mockProperties = [
      {
        id: "prop-1",
        name: "Property 1",
        address: "123 Main St",
        propertyType: "residential",
      },
    ];

    mockUseLeaseableProperties.mockReturnValue({
      data: { properties: mockProperties, metadata: null },
      isLoading: false,
    } as any);

    const mockDuplicateData = {
      fees: {
        monthlyRent: 250000,
        currency: "USD",
        rentDueDay: 1,
        securityDeposit: 250000,
      },
      type: "fixed_term",
      templateType: "standard",
      property: {
        id: "",
        unitId: "",
        address: "",
      },
    };

    mockUseLeaseDuplication.mockReturnValue({
      isDuplicating: false,
      duplicateSource: "Lease #L-001",
      duplicateData: mockDuplicateData,
      error: null,
    });

    const { result } = renderHook(
      () => useLeaseFormBase({ cuid: "client-123" }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.leaseForm.values.fees?.monthlyRent).toBe(250000);
      expect(result.current.leaseForm.values.type).toBe("fixed_term");
      expect(result.current.duplicateSource).toBe("Lease #L-001");
    });
  });

  it("should expose duplication state", () => {
    mockUseLeaseDuplication.mockReturnValue({
      isDuplicating: true,
      duplicateSource: null,
      duplicateData: null,
      error: null,
    });

    const { result } = renderHook(
      () => useLeaseFormBase({ cuid: "client-123" }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isDuplicating).toBe(true);
    expect(result.current.duplicateSource).toBe(null);
  });

  it("should expose duplication error", () => {
    mockUseLeaseDuplication.mockReturnValue({
      isDuplicating: false,
      duplicateSource: null,
      duplicateData: null,
      error: "Failed to load lease data",
    });

    const { result } = renderHook(
      () => useLeaseFormBase({ cuid: "client-123" }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.duplicateError).toBe("Failed to load lease data");
  });
});
