import axiosService from "@configs/axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  SUBSCRIPTION_QUERY_KEYS,
  CURRENT_USER_QUERY_KEY,
} from "@utils/constants";
import { useManageSeats } from "@app/(protectedRoutes)/subscription/hooks/useManageSeats";

// Mock useNotification - still needed for UI feedback testing
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
  let mock: MockAdapter;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    mock = new MockAdapter(axiosService.getInstance());
    jest.clearAllMocks();
    mockMessageSuccess.mockClear();
    mockMessageError.mockClear();
  });

  afterEach(() => {
    mock.restore();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should successfully purchase seats", async () => {
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(200, {
      data: {
        success: true,
        message: "Seats added successfully",
        data: {
          additionalSeatsCount: 5,
          additionalSeatsCost: 3995,
          totalMonthlyPrice: 4794,
          currentSeats: 4,
          billingInterval: "monthly",
          paymentGateway: {
            seatItemId: "si_mock_seat_item",
          },
        },
      },
    });

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    const params = { cuid: "test-cuid", seatDelta: 3 };
    result.current.mutate(params);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Check the returned data from the real API call
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.data.additionalSeatsCount).toBe(5);
  });

  it("should successfully remove seats", async () => {
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(200, {
      data: {
        success: true,
        message: "Seats removed successfully",
        data: {
          additionalSeatsCount: 1,
          additionalSeatsCost: 799,
          totalMonthlyPrice: 1598,
          currentSeats: 4,
          billingInterval: "monthly",
          paymentGateway: {
            seatItemId: "si_mock_seat_item",
          },
        },
      },
    });

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    const params = { cuid: "test-cuid", seatDelta: -1 };
    result.current.mutate(params);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.additionalSeatsCount).toBe(1);
  });

  it("should invalidate relevant queries on success", async () => {
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(200, {
      success: true,
      message: "Seats added successfully",
      data: {
        additionalSeatsCount: 3,
        additionalSeatsCost: 2397,
        totalMonthlyPrice: 3196,
        currentSeats: 4,
        billingInterval: "monthly",
        paymentGateway: {
          seatItemId: "si_mock",
        },
      },
    });

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
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(500, {
      success: false,
      message: "Failed to manage seats",
    });

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 1 });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockMessageError).toHaveBeenCalled();
  });

  it("should track loading state", async () => {
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            200,
            {
              success: true,
              message: "Seats managed successfully",
              data: {
                additionalSeatsCount: 3,
                additionalSeatsCost: 2397,
                totalMonthlyPrice: 3196,
                currentSeats: 4,
                billingInterval: "monthly",
                paymentGateway: {
                  seatItemId: "si_mock",
                },
              },
            },
          ]);
        }, 100);
      });
    });

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
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(200, {
      data: {
        success: true,
        message: "Seats unchanged",
        data: {
          additionalSeatsCount: 2,
          additionalSeatsCost: 1598,
          totalMonthlyPrice: 2397,
          currentSeats: 4,
          billingInterval: "monthly",
          paymentGateway: {
            seatItemId: "si_mock",
          },
        },
      },
    });

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 0 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.additionalSeatsCount).toBe(2);
  });

  it("should show success notification when seats are added", async () => {
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(200, {
      success: true,
      message: "Seats added successfully",
      data: {
        additionalSeatsCount: 5,
        additionalSeatsCost: 3995,
        totalMonthlyPrice: 4794,
        currentSeats: 4,
        billingInterval: "monthly",
        paymentGateway: {
          seatItemId: "si_mock",
        },
      },
    });

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 3 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockMessageSuccess).toHaveBeenCalledWith("Successfully added 3 seats");
  });

  it("should show success notification when seats are removed", async () => {
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(200, {
      success: true,
      message: "Seats removed successfully",
      data: {
        additionalSeatsCount: 0,
        additionalSeatsCost: 0,
        totalMonthlyPrice: 799,
        currentSeats: 4,
        billingInterval: "monthly",
        paymentGateway: {
          seatItemId: "si_mock",
        },
      },
    });

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: -2 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockMessageSuccess).toHaveBeenCalledWith("Successfully removed 2 seats");
  });

  it("should handle seat removal validation error with 'Cannot remove' message", async () => {
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(400, {
      success: false,
      message:
        "Cannot remove 2 seats. You can only remove 1 seats (currently using 4 of 5 seats).",
    });

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: -2 });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockMessageError).toHaveBeenCalled();
    const errorMessage = mockMessageError.mock.calls[0][0];
    expect(errorMessage).toContain("Cannot remove 2 seats");
  });

  it("should handle API error with custom message", async () => {
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(403, {
      success: false,
      message: "Insufficient permissions to manage seats",
    });

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 1 });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockMessageError).toHaveBeenCalled();
  });

  it("should show success with singular 'seat' for single seat change", async () => {
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(200, {
      success: true,
      message: "Seat added successfully",
      data: {
        additionalSeatsCount: 3,
        additionalSeatsCost: 2397,
        totalMonthlyPrice: 3196,
        currentSeats: 4,
        billingInterval: "monthly",
        paymentGateway: {
          seatItemId: "si_mock",
        },
      },
    });

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 1 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockMessageSuccess).toHaveBeenCalledWith("Successfully added 1 seat");
  });

  it("should calculate correct pricing for additional seats", async () => {
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(200, {
      data: {
        success: true,
        message: "Seats added successfully",
        data: {
          additionalSeatsCount: 5,
          additionalSeatsCost: 5 * 799,
          totalMonthlyPrice: 799 + 5 * 799,
          currentSeats: 4,
          billingInterval: "monthly",
          paymentGateway: {
            seatItemId: "si_mock",
          },
        },
      },
    });

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 3 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.additionalSeatsCost).toBe(5 * 799);
    expect(result.current.data?.data.totalMonthlyPrice).toBe(799 + 5 * 799);
  });

  it("should prevent exceeding maximum additional seats", async () => {
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(400, {
      success: false,
      message: "Cannot exceed maximum of 50 additional seats",
    });

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 49 });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockMessageError).toHaveBeenCalled();
    const errorMessage = mockMessageError.mock.calls[0][0];
    expect(errorMessage).toContain("Cannot exceed maximum");
  });

  it("should return payment gateway seat item ID", async () => {
    mock.onPost("/api/v1/subscriptions/test-cuid/seats").reply(200, {
      data: {
        success: true,
        message: "Seats added successfully",
        data: {
          additionalSeatsCount: 3,
          additionalSeatsCost: 2397,
          totalMonthlyPrice: 3196,
          currentSeats: 4,
          billingInterval: "monthly",
          paymentGateway: {
            seatItemId: "si_test_12345",
          },
        },
      },
    });

    const { result } = renderHook(() => useManageSeats(), { wrapper });

    result.current.mutate({ cuid: "test-cuid", seatDelta: 1 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.paymentGateway.seatItemId).toBeDefined();
    expect(result.current.data?.data.paymentGateway.seatItemId).toContain("si_");
  });
});
