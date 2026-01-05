import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useLeaseFormManagement } from "@app/(protectedRoutes)/leases/[cuid]/hooks/useLeaseFormManagement";

// Mock dependencies
jest.mock("@app/(protectedRoutes)/leases/[cuid]/hooks/useLeasePreview", () => ({
  useGetLeasePreview: jest.fn(() => ({
    previewHtml: "",
    isLoadingPreview: false,
    fetchPreview: jest.fn(),
  })),
}));

jest.mock(
  "@app/(protectedRoutes)/leases/[cuid]/hooks/useGetLeaseByLuid",
  () => ({
    useGetLeaseByLuid: jest.fn(() => ({
      data: null,
      isLoading: false,
      isError: false,
    })),
  })
);

jest.mock(
  "@app/(protectedRoutes)/leases/[cuid]/hooks/useAvailableTenants",
  () => ({
    useAvailableTenants: jest.fn(() => ({
      data: [],
      isLoading: false,
    })),
  })
);

jest.mock(
  "@app/(protectedRoutes)/leases/[cuid]/hooks/useLeaseDuplication",
  () => ({
    useLeaseDuplication: jest.fn(() => ({
      isDuplicating: false,
      duplicateSource: null,
      duplicateData: null,
      error: null,
    })),
  })
);

jest.mock(
  "@app/(protectedRoutes)/leases/[cuid]/hooks/useLeaseableProperties",
  () => ({
    useLeaseableProperties: jest.fn(() => ({
      data: {
        properties: [
          {
            id: "prop-1",
            name: "Property 1",
            address: "123 Main St",
            propertyType: "apartment",
            units: [
              { id: "unit-1", unitNumber: "101" },
              { id: "unit-2", unitNumber: "102" },
            ],
            financialInfo: {
              monthlyRent: 200000,
              securityDeposit: 200000,
              currency: "USD",
            },
          },
          {
            id: "prop-2",
            name: "Property 2",
            address: "456 Oak Ave",
            propertyType: "commercial",
            units: [],
          },
        ],
        metadata: {
          filteredProperties: [],
          filteredCount: 0,
        },
      },
      isLoading: false,
    })),
  })
);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const QueryWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  QueryWrapper.displayName = "QueryWrapper";
  return QueryWrapper;
};

describe("useLeaseFormManagement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default values for create mode", () => {
    const { result } = renderHook(
      () =>
        useLeaseFormManagement({
          cuid: "client-123",
          mode: "create",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.leaseForm.values).toBeDefined();
    expect(result.current.isFormValid).toBeDefined();
    expect(result.current.accordionItems).toHaveLength(8);
  });

  it("should handle property selection and populate form fields", async () => {
    const { result } = renderHook(
      () =>
        useLeaseFormManagement({
          cuid: "client-123",
          mode: "create",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.handleOnChange("prop-1", "property.id");
    });

    await waitFor(() => {
      expect(result.current.leaseForm.values.property.id).toBe("prop-1");
      expect(result.current.leaseForm.values.property.address).toBe(
        "123 Main St"
      );
      expect(result.current.leaseForm.values.property.hasUnits).toBe(true);
      expect(result.current.leaseForm.values.fees.monthlyRent).toBe(200000);
    });
  });

  it("should reset unitId when property changes", async () => {
    const { result } = renderHook(
      () =>
        useLeaseFormManagement({
          cuid: "client-123",
          mode: "create",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.handleOnChange("prop-1", "property.id");
    });

    await waitFor(() => {
      expect(result.current.leaseForm.values.property.id).toBe("prop-1");
    });

    act(() => {
      result.current.handleOnChange("unit-1", "property.unitId");
    });

    await waitFor(() => {
      expect(result.current.leaseForm.values.property.unitId).toBe("unit-1");
    });

    act(() => {
      result.current.handleOnChange("prop-2", "property.id");
    });

    await waitFor(() => {
      expect(result.current.leaseForm.values.property.id).toBe("prop-2");
      expect(result.current.leaseForm.values.property.unitId).toBe("");
    });
  });

  it("should set hasUnits flag correctly", async () => {
    const { result } = renderHook(
      () =>
        useLeaseFormManagement({
          cuid: "client-123",
          mode: "create",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.handleOnChange("prop-1", "property.id");
    });

    await waitFor(() => {
      expect(result.current.leaseForm.values.property.hasUnits).toBe(true);
    });

    act(() => {
      result.current.handleOnChange("prop-2", "property.id");
    });

    await waitFor(() => {
      expect(result.current.leaseForm.values.property.hasUnits).toBe(false);
    });
  });

  it("should handle tenant selection type change", () => {
    const { result } = renderHook(
      () =>
        useLeaseFormManagement({
          cuid: "client-123",
          mode: "create",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.handleTenantSelectionTypeChange("invite");
    });

    expect(result.current.tenantSelectionType).toBe("invite");
    expect(result.current.leaseForm.values.tenantInfo.email).toBe("");
    expect(result.current.leaseForm.values.tenantInfo.firstName).toBe("");
    expect(result.current.leaseForm.values.tenantInfo.lastName).toBe("");
    expect(result.current.leaseForm.values.tenantInfo.id).toBeUndefined();
  });

  it("should add and remove co-tenants", () => {
    const { result } = renderHook(
      () =>
        useLeaseFormManagement({
          cuid: "client-123",
          mode: "create",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.addCoTenant();
    });

    expect(result.current.leaseForm.values.coTenants).toHaveLength(1);

    act(() => {
      result.current.addCoTenant();
    });

    expect(result.current.leaseForm.values.coTenants).toHaveLength(2);

    act(() => {
      result.current.removeCoTenant(0);
    });

    expect(result.current.leaseForm.values.coTenants).toHaveLength(1);
  });

  it("should handle co-tenant field changes", () => {
    const { result } = renderHook(
      () =>
        useLeaseFormManagement({
          cuid: "client-123",
          mode: "create",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.addCoTenant();
    });

    act(() => {
      result.current.handleCoTenantChange(0, "name", "John Doe");
    });

    expect(result.current.leaseForm.values.coTenants?.[0].name).toBe(
      "John Doe"
    );

    act(() => {
      result.current.handleCoTenantChange(0, "email", "john@example.com");
    });

    expect(result.current.leaseForm.values.coTenants?.[0].email).toBe(
      "john@example.com"
    );
  });

  it("should handle utility toggles", () => {
    const { result } = renderHook(
      () =>
        useLeaseFormManagement({
          cuid: "client-123",
          mode: "create",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.handleUtilityToggle("water", true);
    });

    expect(result.current.leaseForm.values.utilitiesIncluded).toContain(
      "water"
    );

    act(() => {
      result.current.handleUtilityToggle("electricity", true);
    });

    expect(result.current.leaseForm.values.utilitiesIncluded).toContain(
      "electricity"
    );

    act(() => {
      result.current.handleUtilityToggle("water", false);
    });

    expect(result.current.leaseForm.values.utilitiesIncluded).not.toContain(
      "water"
    );
    expect(result.current.leaseForm.values.utilitiesIncluded).toContain(
      "electricity"
    );
  });

  it("should detect tab errors correctly", () => {
    const { result } = renderHook(
      () =>
        useLeaseFormManagement({
          cuid: "client-123",
          mode: "create",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    const hasPropertyErrors = result.current.hasTabErrors("property");
    expect(typeof hasPropertyErrors).toBe("boolean");
  });

  it("should check tab completion status", () => {
    const { result } = renderHook(
      () =>
        useLeaseFormManagement({
          cuid: "client-123",
          mode: "create",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isTabCompleted("property")).toBe(false);
    expect(result.current.isTabCompleted("tenant")).toBe(false);
    expect(result.current.isTabCompleted("leaseTerms")).toBe(false);
    expect(result.current.isTabCompleted("financial")).toBe(false);
  });

  it("should generate correct property and unit options", () => {
    const { result } = renderHook(
      () =>
        useLeaseFormManagement({
          cuid: "client-123",
          mode: "create",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.propertyOptions).toHaveLength(2);
    expect(result.current.propertyOptions[0].value).toBe("prop-1");
    expect(result.current.propertyOptions[0].label).toContain("Property 1");
    expect(result.current.propertyOptions[0].label).toContain("123 Main St");
  });

  it("should set templateType based on property type", async () => {
    const { result } = renderHook(
      () =>
        useLeaseFormManagement({
          cuid: "client-123",
          mode: "create",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.handleOnChange("prop-1", "property.id");
    });

    await waitFor(() => {
      expect(result.current.leaseForm.values.templateType).toBe(
        "residential-apartment"
      );
    });

    act(() => {
      result.current.handleOnChange("prop-2", "property.id");
    });

    await waitFor(() => {
      expect(result.current.leaseForm.values.templateType).toBe(
        "commercial-office"
      );
    });
  });
});
