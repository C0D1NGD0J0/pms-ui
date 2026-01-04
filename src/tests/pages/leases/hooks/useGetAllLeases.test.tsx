import React from "react";
import { leaseService } from "@services/lease";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useGetLeaseStats, useGetAllLeases } from "@app/(protectedRoutes)/leases/[cuid]/hooks/useGetAllLeases";

jest.mock("@services/lease");
const mockLeaseService = leaseService as jest.Mocked<typeof leaseService>;

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

describe("useGetAllLeases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return filter options", () => {
    const { result } = renderHook(() => useGetAllLeases("client-123"), {
      wrapper: createWrapper(),
    });

    expect(result.current.filterOptions).toHaveLength(7);
    expect(result.current.filterOptions[0]).toEqual({
      label: "All Leases",
      value: "",
    });
  });

  it("should call lease service with correct client ID", async () => {
    mockLeaseService.getFilteredLeases.mockResolvedValue({
      data: { data: [], pagination: { total: 0, page: 1, limit: 5 } },
    } as any);

    renderHook(() => useGetAllLeases("client-456"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockLeaseService.getFilteredLeases).toHaveBeenCalledWith(
        "client-456",
        expect.any(Object)
      );
    });
  });

  it("should return empty array when no leases", async () => {
    mockLeaseService.getFilteredLeases.mockResolvedValue({
      data: { data: [], pagination: { total: 0, page: 1, limit: 5 } },
    } as any);

    const { result } = renderHook(() => useGetAllLeases("client-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.leases).toEqual([]);
    });

    expect(result.current.totalCount).toBe(0);
  });

  it("should expose pagination handlers", () => {
    const { result } = renderHook(() => useGetAllLeases("client-123"), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.handleSortChange).toBe("function");
    expect(typeof result.current.handlePageChange).toBe("function");
    expect(typeof result.current.handleSortByChange).toBe("function");
  });
});

describe("useGetLeaseStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch lease statistics", async () => {
    const mockStats = {
      leasesByStatus: { active: 10, draft: 3 },
      expiringIn30Days: 2,
      totalMonthlyRent: 15000,
      occupancyRate: 85.5,
    };

    mockLeaseService.getLeaseStats.mockResolvedValue({
      data: mockStats,
    } as any);

    const { result } = renderHook(() => useGetLeaseStats("client-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({ data: mockStats });
    });
  });

  it("should not fetch when cuid is empty", () => {
    renderHook(() => useGetLeaseStats(""), {
      wrapper: createWrapper(),
    });

    expect(mockLeaseService.getLeaseStats).not.toHaveBeenCalled();
  });

  it("should call service with correct cuid", async () => {
    mockLeaseService.getLeaseStats.mockResolvedValue({
      data: {},
    } as any);

    renderHook(() => useGetLeaseStats("client-789"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockLeaseService.getLeaseStats).toHaveBeenCalledWith(
        "client-789"
      );
    });
  });
});
