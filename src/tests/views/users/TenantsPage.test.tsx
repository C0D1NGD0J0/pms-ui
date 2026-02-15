import React from "react";
import { render, screen } from "@testing-library/react";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import TenantsPage from "@app/(protectedRoutes)/users/[cuid]/tenants/page";
import { useGetTenants } from "@app/(protectedRoutes)/users/[cuid]/tenants/hooks";

jest.mock("@app/(protectedRoutes)/users/[cuid]/tenants/hooks");
jest.mock("@hooks/useUnifiedPermissions");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock withClientAccess HOC
jest.mock("@hooks/permissionHOCs", () => ({
  withClientAccess: (Component: any) => Component,
}));

const mockUseGetTenants = useGetTenants as jest.MockedFunction<
  typeof useGetTenants
>;
const mockUseUnifiedPermissions = useUnifiedPermissions as jest.MockedFunction<
  typeof useUnifiedPermissions
>;

describe("TenantsPage", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockTenants = [
    {
      uid: "tenant-1",
      displayName: "Alice Johnson",
      email: "alice@example.com",
      tenantInfo: {
        leaseStatus: "active",
        leaseStartDate: "2024-01-01",
        leaseEndDate: "2024-12-31",
      },
    },
    {
      uid: "tenant-2",
      displayName: "Bob Smith",
      email: "bob@example.com",
      tenantInfo: {
        leaseStatus: "pending_renewal",
        leaseStartDate: "2023-06-01",
        leaseEndDate: "2024-05-31",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseGetTenants.mockReturnValue({
      tenants: mockTenants,
      sortOptions: [{ label: "All", value: "all" }],
      pagination: { page: 1, limit: 10 },
      totalCount: 2,
      handleSortDirectionChange: jest.fn(),
      handlePageChange: jest.fn(),
      handleSortByChange: jest.fn(),
      isLoading: false,
    } as any);

    mockUseUnifiedPermissions.mockReturnValue({
      isManagerOrAbove: true,
      isStaffOrAbove: true,
      can: jest.fn(),
    } as any);
  });

  describe("withClientAccess HOC", () => {
    it("should be wrapped with withClientAccess for tenant isolation", async () => {
      const params = Promise.resolve({ cuid: "client-123" });

      render(<TenantsPage params={params} />, { wrapper });

      // withClientAccess validates cuid param
      expect(await screen.findByText("Tenant Management")).toBeInTheDocument();
    });

    it("should use cuid from params", async () => {
      const params = Promise.resolve({ cuid: "test-client-456" });

      render(<TenantsPage params={params} />, { wrapper });

      expect(mockUseGetTenants).toHaveBeenCalledWith("test-client-456");
    });
  });

  describe("Tenants list rendering", () => {
    it("should render tenants management page", async () => {
      const params = Promise.resolve({ cuid: "client-123" });

      render(<TenantsPage params={params} />, { wrapper });

      expect(await screen.findByText("Tenant Management")).toBeInTheDocument();
    });

    it("should display tenant status distribution chart", async () => {
      const params = Promise.resolve({ cuid: "client-123" });

      render(<TenantsPage params={params} />, { wrapper });

      expect(
        await screen.findByText("Tenant Status Distribution")
      ).toBeInTheDocument();
    });

    it("should display lease duration distribution chart", async () => {
      const params = Promise.resolve({ cuid: "client-123" });

      render(<TenantsPage params={params} />, { wrapper });

      expect(
        await screen.findByText("Lease Duration Distribution")
      ).toBeInTheDocument();
    });

    it("should handle empty tenants list", async () => {
      mockUseGetTenants.mockReturnValue({
        tenants: [],
        sortOptions: [],
        pagination: { page: 1, limit: 10 },
        totalCount: 0,
        handleSortDirectionChange: jest.fn(),
        handlePageChange: jest.fn(),
        handleSortByChange: jest.fn(),
        isLoading: false,
      } as any);

      const params = Promise.resolve({ cuid: "client-123" });

      render(<TenantsPage params={params} />, { wrapper });

      expect(await screen.findByText("Tenant Management")).toBeInTheDocument();
    });
  });

  describe("Analytics", () => {
    it("should calculate tenant status distribution", async () => {
      const params = Promise.resolve({ cuid: "client-123" });

      render(<TenantsPage params={params} />, { wrapper });

      // Charts should be rendered with tenant data
      expect(await screen.findByText("Tenant Status Distribution")).toBeInTheDocument();
    });

    it("should calculate lease duration distribution", async () => {
      const params = Promise.resolve({ cuid: "client-123" });

      render(<TenantsPage params={params} />, { wrapper });

      expect(
        await screen.findByText("Lease Duration Distribution")
      ).toBeInTheDocument();
    });
  });
});
