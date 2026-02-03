import { renderHook, waitFor } from "@testing-library/react";
import { subscriptionService } from "@services/subscription";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  SUBSCRIPTION_QUERY_KEYS,
  CURRENT_USER_QUERY_KEY,
} from "@utils/constants";
import { useManageSeats } from "@app/(protectedRoutes)/subscription/hooks/useManageSeats";

// Mock the subscription service
jest.mock("@services/subscription", () => ({
  subscriptionService: {
    manageSeats: jest.fn(),
  },
}));

// Mock useNotification
const mockMessageSuccess = jest.fn();
const mockMessageError = jest.fn();
jest.mock("@hooks/useNotification", () => ({
  useNotification: jest.fn(() => ({
    message: {
      success: mockMessageSuccess,
      error: mockMessageError,
    },
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
    mockMessageSuccess.mockClear();
    mockMessageError.mockClear();
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

    // Should invalidate planUsage, clientDetails, currentUser, and subscriptionUsage queries
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: SUBSCRIPTION_QUERY_KEYS.getPlanUsage("test-cuid"),
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: SUBSCRIPTION_QUERY_KEYS.getClientDetails("test-cuid"),
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: CURRENT_USER_QUERY_KEY,
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: SUBSCRIPTION_QUERY_KEYS.getSubscriptionUsage("test-cuid"),
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

    expect(mockMessageError).toHaveBeenCalledWith("Failed to manage seats");
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

  it("should show success notification when seats are added", async () => {
    const mockResponse = { success: true, data: { additionalSeats: 5 } };
    (subscriptionService.manageSeats as jest.Mock).mockResolvedValue(
      mockResponse
    );

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 3 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockMessageSuccess).toHaveBeenCalledWith("Successfully added 3 seats");
  });

  it("should show success notification when seats are removed", async () => {
    const mockResponse = { success: true, data: { additionalSeats: 0 } };
    (subscriptionService.manageSeats as jest.Mock).mockResolvedValue(
      mockResponse
    );

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: -2 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockMessageSuccess).toHaveBeenCalledWith("Successfully removed 2 seats");
  });

  it("should handle seat removal validation error with 'Cannot remove' message", async () => {
    const mockError = {
      response: {
        data: {
          message:
            "Cannot remove 1 seat. You currently have 21 active users but would only have 11 seats allowed. Please archive 10 user(s) first.",
        },
      },
    };
    (subscriptionService.manageSeats as jest.Mock).mockRejectedValue(
      mockError
    );

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: -1 });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockMessageError).toHaveBeenCalledWith(
      "Cannot remove 1 seat. You currently have 21 active users but would only have 11 seats allowed. Please archive 10 user(s) first."
    );
  });

  it("should handle API error with custom message", async () => {
    const mockError = {
      response: {
        data: {
          message: "Insufficient permissions to manage seats",
        },
      },
    };
    (subscriptionService.manageSeats as jest.Mock).mockRejectedValue(
      mockError
    );

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 1 });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockMessageError).toHaveBeenCalledWith(
      "Insufficient permissions to manage seats"
    );
  });

  it("should show success with singular 'seat' for single seat change", async () => {
    const mockResponse = { success: true, data: {} };
    (subscriptionService.manageSeats as jest.Mock).mockResolvedValue(
      mockResponse
    );

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 1 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockMessageSuccess).toHaveBeenCalledWith("Successfully added 1 seat");
  });
});
