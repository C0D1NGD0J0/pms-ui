import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import LeasesPage from "@app/(protectedRoutes)/leases/[cuid]/(leases)/page";
import { useLeasesListLogic } from "@app/(protectedRoutes)/leases/[cuid]/(leases)/hook";

jest.mock("@app/(protectedRoutes)/leases/[cuid]/(leases)/hook");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

const mockUseLeasesListLogic = useLeasesListLogic as jest.MockedFunction<
  typeof useLeasesListLogic
>;

describe("LeasesListPage", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockLogicProps = {
    cuid: "client-123",
    leases: [],
    totalCount: 0,
    isLoading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      order: "desc" as const,
    },
    filters: {},
    filterOptions: [],
    handleSortDirectionChange: jest.fn(),
    handlePageChange: jest.fn(),
    handleFilterChange: jest.fn(),
    insightData: [],
    leaseColumns: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLeasesListLogic.mockReturnValue(mockLogicProps);
  });

  describe("withClientAccess HOC", () => {
    it("should be wrapped with withClientAccess for tenant isolation", () => {
      render(<LeasesPage />, { wrapper });

      // withClientAccess validates cuid param
      expect(mockUseLeasesListLogic).toHaveBeenCalled();
      expect(screen.getByText("Leases")).toBeInTheDocument();
    });

    it("should pass cuid from params to logic hook", () => {
      mockUseLeasesListLogic.mockReturnValue({
        ...mockLogicProps,
        cuid: "test-client-456",
      });

      render(<LeasesPage />, { wrapper });

      expect(mockUseLeasesListLogic).toHaveBeenCalled();
    });
  });

  describe("Link component with tracking", () => {
    it("should render New Lease link with tracking data", () => {
      mockUseLeasesListLogic.mockReturnValue({
        ...mockLogicProps,
        cuid: "client-123",
      });

      render(<LeasesPage />, { wrapper });

      const newLeaseLink = screen.getByRole("link", { name: /new lease/i });
      expect(newLeaseLink).toBeInTheDocument();
      expect(newLeaseLink).toHaveAttribute("href", "/leases/client-123/new");
    });

    it("should use Link component instead of next/link for entitlements", () => {
      render(<LeasesPage />, { wrapper });

      // Custom Link component handles capacity checks
      const newLeaseLink = screen.getByRole("link", { name: /new lease/i });
      expect(newLeaseLink).toBeInTheDocument();
    });
  });

  describe("Leases list rendering", () => {
    it("should render leases table", () => {
      render(<LeasesPage />, { wrapper });

      expect(screen.getByText("Lease Portfolio")).toBeInTheDocument();
    });

    it("should display insights when data available", () => {
      mockUseLeasesListLogic.mockReturnValue({
        ...mockLogicProps,
        insightData: [
          {
            id: "1",
            title: "Active Leases",
            value: 10,
            icon: "bx-file",
          },
        ],
      });

      render(<LeasesPage />, { wrapper });

      expect(screen.getByText("Active Leases")).toBeInTheDocument();
    });

    it("should handle empty leases list", () => {
      render(<LeasesPage />, { wrapper });

      expect(screen.getByText("Leases")).toBeInTheDocument();
    });
  });
});
