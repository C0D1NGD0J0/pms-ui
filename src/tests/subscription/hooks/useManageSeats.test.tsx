import { renderHook, waitFor } from "@testing-library/react";
import { subscriptionService } from "@services/subscription";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useManageSeats } from "@app/(protectedRoutes)/subscription/hooks/useManageSeats";

// Mock the subscription service
jest.mock("@services/subscription", () => ({
  subscriptionService: {
    manageSeats: jest.fn(),
  },
}));

// Mock useErrorHandler
const mockHandleMutationError = jest.fn();
jest.mock("@hooks/useErrorHandler", () => ({
  useErrorHandler: jest.fn(() => ({
    handleMutationError: mockHandleMutationError,
  })),
}));

describe("useManageSeats", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should successfully purchase seats", async () => {
    const mockResponse = {
      success: true,
      data: {
        additionalSeats: 3,
        totalSeats: 13,
      },
    };

    (subscriptionService.manageSeats as jest.Mock).mockResolvedValue(
      mockResponse
    );

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    const params = { cuid: "test-cuid", seatDelta: 3 };
    result.current.mutate(params);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(subscriptionService.manageSeats).toHaveBeenCalledWith(
      "test-cuid",
      3
    );
  });

  it("should successfully remove seats", async () => {
    const mockResponse = {
      success: true,
      data: {
        additionalSeats: 0,
        totalSeats: 10,
      },
    };

    (subscriptionService.manageSeats as jest.Mock).mockResolvedValue(
      mockResponse
    );

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    const params = { cuid: "test-cuid", seatDelta: -2 };
    result.current.mutate(params);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(subscriptionService.manageSeats).toHaveBeenCalledWith(
      "test-cuid",
      -2
    );
  });

  it("should invalidate relevant queries on success", async () => {
    const mockResponse = { success: true, data: {} };
    (subscriptionService.manageSeats as jest.Mock).mockResolvedValue(
      mockResponse
    );

    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 1 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should invalidate planUsage, clientDetails, and currentUser queries
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["planUsage", "test-cuid"],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["clientDetails", "test-cuid"],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["currentUser"],
    });
  });

  it("should handle errors correctly", async () => {
    const mockError = new Error("Failed to manage seats");
    (subscriptionService.manageSeats as jest.Mock).mockRejectedValue(
      mockError
    );

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 1 });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockHandleMutationError).toHaveBeenCalledWith(
      mockError,
      "Failed to manage seats"
    );
  });

  it("should track loading state", async () => {
    const mockResponse = { success: true, data: {} };
    (subscriptionService.manageSeats as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockResponse), 100);
        })
    );

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    expect(result.current.isPending).toBe(false);

    result.current.mutate({ cuid: "test-cuid", seatDelta: 1 });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isPending).toBe(false);
  });

  it("should handle zero seat delta", async () => {
    const mockResponse = { success: true, data: {} };
    (subscriptionService.manageSeats as jest.Mock).mockResolvedValue(
      mockResponse
    );

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 0 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(subscriptionService.manageSeats).toHaveBeenCalledWith(
      "test-cuid",
      0
    );
  });
});
