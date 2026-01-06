import React from "react";
import { propertyService } from "@services/property";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useGetAllProperties } from "@app/(protectedRoutes)/properties/[cuid]/hooks/queries/useGetAllProperties";

jest.mock("@services/property");
const mockPropertyService = propertyService as jest.Mocked<
  typeof propertyService
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

describe("useGetAllProperties", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return filter options", () => {
    const { result } = renderHook(() => useGetAllProperties("client-123"), {
      wrapper: createWrapper(),
    });

    expect(result.current.filterOptions).toEqual([
      { label: "All", value: "" },
      { label: "Status", value: "status" },
      { label: "Property Name", value: "name" },
      { label: "Date Added", value: "createdAt" },
    ]);
  });

  it("should fetch properties for given client", async () => {
    const mockProperties = {
      items: [
        { pid: "prop-1", name: "Property 1" },
        { pid: "prop-2", name: "Property 2" },
      ],
      pagination: { total: 2, page: 1, limit: 5 },
    };

    mockPropertyService.getClientProperties.mockResolvedValue(
      mockProperties as any
    );

    const { result } = renderHook(() => useGetAllProperties("client-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.properties).toHaveLength(2);
    });

    expect(result.current.totalCount).toBe(2);
  });

  it("should return empty array when no properties", async () => {
    mockPropertyService.getClientProperties.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 5 },
    } as any);

    const { result } = renderHook(() => useGetAllProperties("client-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.properties).toEqual([]);
    });

    expect(result.current.totalCount).toBe(0);
  });

  it("should call property service with correct client ID", async () => {
    mockPropertyService.getClientProperties.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 5 },
    } as any);

    renderHook(() => useGetAllProperties("client-456"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockPropertyService.getClientProperties).toHaveBeenCalledWith(
        "client-456",
        expect.any(Object)
      );
    });
  });

  it("should use initial limit of 6", async () => {
    mockPropertyService.getClientProperties.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, limit: 6 },
    } as any);

    renderHook(() => useGetAllProperties("client-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockPropertyService.getClientProperties).toHaveBeenCalledWith(
        "client-123",
        expect.objectContaining({
          pagination: expect.objectContaining({ limit: 6 }),
        })
      );
    });
  });

  it("should expose pagination handlers", () => {
    const { result } = renderHook(() => useGetAllProperties("client-123"), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.handleSortDirectionChange).toBe("function");
    expect(typeof result.current.handlePageChange).toBe("function");
    expect(typeof result.current.handleSortByChange).toBe("function");
  });

  it("should expose refetch function", () => {
    const { result } = renderHook(() => useGetAllProperties("client-123"), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.refetch).toBe("function");
  });

  it("should return pagination state", async () => {
    mockPropertyService.getClientProperties.mockResolvedValue({
      items: [],
      pagination: { total: 10, page: 1, limit: 5 },
    } as any);

    const { result } = renderHook(() => useGetAllProperties("client-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.pagination).toBeDefined();
    });
  });
});
