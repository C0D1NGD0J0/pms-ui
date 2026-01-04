import React from "react";
import { leaseService } from "@services/lease";
import { useNotification } from "@hooks/useNotification";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useLeaseRenewal } from "@app/(protectedRoutes)/leases/[cuid]/hooks/useLeaseRenewal";

jest.mock("@services/lease");
jest.mock("@hooks/useNotification");

const mockLeaseService = leaseService as jest.Mocked<typeof leaseService>;
const mockUseNotification = useNotification as jest.MockedFunction<
  typeof useNotification
>;

const mockOpenNotification = jest.fn();

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
  return { queryClient, QueryWrapper };
};

const mockRenewalData = {
  tenant: { id: "tenant-123" },
  fees: { monthlyRent: 2000 },
} as any;

const mockSuccessResponse = {
  status: 201,
  data: {
    success: true,
    data: { luid: "lease-789", status: "draft_renewal" },
  },
};

describe("useLeaseRenewal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNotification.mockReturnValue({
      openNotification: mockOpenNotification,
    } as any);
  });

  it("should successfully create a lease renewal", async () => {
    mockLeaseService.renewLease.mockResolvedValue(mockSuccessResponse as any);

    const { QueryWrapper } = createWrapper();
    const { result } = renderHook(
      () => useLeaseRenewal("client-123", "lease-456"),
      { wrapper: QueryWrapper }
    );

    await act(async () => {
      result.current.mutate(mockRenewalData);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockLeaseService.renewLease).toHaveBeenCalledWith(
      "client-123",
      "lease-456",
      mockRenewalData
    );
  });

  it("should show success notification and invalidate queries", async () => {
    mockLeaseService.renewLease.mockResolvedValue(mockSuccessResponse as any);

    const { QueryWrapper, queryClient } = createWrapper();
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(
      () => useLeaseRenewal("client-123", "lease-456"),
      { wrapper: QueryWrapper }
    );

    await act(async () => {
      result.current.mutate(mockRenewalData);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockOpenNotification).toHaveBeenCalledWith(
      "success",
      "Lease Renewal Created",
      "The renewal lease has been created successfully. Next step: Send for signatures."
    );

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["/leases/client-123/lease-456"],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["/leases/client-123"],
    });
  });

  it("should handle renewal errors", async () => {
    const mockError = {
      response: { data: { message: "Lease has already been renewed" } },
    };
    mockLeaseService.renewLease.mockRejectedValue(mockError);

    const { QueryWrapper } = createWrapper();
    const { result } = renderHook(
      () => useLeaseRenewal("client-123", "lease-456"),
      { wrapper: QueryWrapper }
    );

    await act(async () => {
      result.current.mutate(mockRenewalData);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockOpenNotification).toHaveBeenCalledWith(
      "error",
      "Renewal Failed",
      "Lease has already been renewed"
    );
  });

  it("should handle errors with fallback message", async () => {
    mockLeaseService.renewLease.mockRejectedValue({});

    const { QueryWrapper } = createWrapper();
    const { result } = renderHook(
      () => useLeaseRenewal("client-123", "lease-456"),
      { wrapper: QueryWrapper }
    );

    await act(async () => {
      result.current.mutate(mockRenewalData);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockOpenNotification).toHaveBeenCalledWith(
      "error",
      "Renewal Failed",
      "Failed to create lease renewal"
    );
  });

  it("should track loading state during mutation", async () => {
    mockLeaseService.renewLease.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockSuccessResponse as any), 100)
        )
    );

    const { QueryWrapper } = createWrapper();
    const { result } = renderHook(
      () => useLeaseRenewal("client-123", "lease-456"),
      { wrapper: QueryWrapper }
    );

    act(() => {
      result.current.mutate(mockRenewalData);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
