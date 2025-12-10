import React from "react";
import { useSearchParams } from "next/navigation";
import { useNotification } from "@hooks/useNotification";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useGetLeaseByLuid } from "@app/(protectedRoutes)/leases/[cuid]/hooks/useGetLeaseByLuid";
import { useLeaseDuplication } from "@app/(protectedRoutes)/leases/[cuid]/hooks/useLeaseDuplication";

jest.mock("next/navigation");
jest.mock("@app/(protectedRoutes)/leases/[cuid]/hooks/useGetLeaseByLuid");
jest.mock("@hooks/useNotification");

const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;
const mockUseGetLeaseByLuid = useGetLeaseByLuid as jest.MockedFunction<
  typeof useGetLeaseByLuid
>;
const mockUseNotification = useNotification as jest.MockedFunction<
  typeof useNotification
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

const mockLeaseData = {
  data: {
    leaseNumber: "L-001",
    property: {
      id: "prop-1",
      unitId: "unit-1",
      address: "123 Main St",
    },
    fees: {
      monthlyRent: 250000,
      currency: "USD",
      rentDueDay: 1,
      securityDeposit: 250000,
      lateFeeAmount: 5000,
      lateFeeDays: 5,
      lateFeeType: "fixed" as const,
      lateFeePercentage: 0,
      acceptedPaymentMethod: ["bank_transfer"],
    },
    type: "fixed_term",
    templateType: "standard",
    signingMethod: "electronic",
    utilitiesIncluded: ["water"],
    petPolicy: {
      allowed: true,
      depositRequired: 50000,
      monthlyFee: 2500,
    },
    renewalOptions: {
      autoRenew: false,
      noticePeriodDays: 30,
    },
  },
};

describe("useLeaseDuplication", () => {
  const mockOpenNotification = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNotification.mockReturnValue({
      openNotification: mockOpenNotification,
    } as any);
  });

  it("should return initial state when no duplicate query param", () => {
    mockUseSearchParams.mockReturnValue({
      get: () => null,
    } as any);

    mockUseGetLeaseByLuid.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useLeaseDuplication("client-123"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isDuplicating).toBe(false);
    expect(result.current.duplicateSource).toBe(null);
    expect(result.current.duplicateData).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("should load and transform lease data when duplicate param exists", async () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "duplicate" ? "lease-123" : null),
    } as any);

    mockUseGetLeaseByLuid.mockReturnValue({
      data: mockLeaseData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useLeaseDuplication("client-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.duplicateData).not.toBe(null);
    });

    expect(result.current.duplicateSource).toBe("Lease #L-001");
    expect(result.current.duplicateData?.fees?.monthlyRent).toBe(250000);
    expect(result.current.duplicateData?.fees?.currency).toBe("USD");
    expect(result.current.duplicateData?.property?.id).toBe("");
    expect(result.current.duplicateData?.property?.unitId).toBe("");
    expect(result.current.isDuplicating).toBe(false);
  });

  it("should show loading state while fetching", () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "duplicate" ? "lease-123" : null),
    } as any);

    mockUseGetLeaseByLuid.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useLeaseDuplication("client-123"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isDuplicating).toBe(true);
    expect(result.current.duplicateData).toBe(null);
  });

  it("should handle errors and show notification", async () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "duplicate" ? "lease-123" : null),
    } as any);

    mockUseGetLeaseByLuid.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch"),
    } as any);

    const { result } = renderHook(() => useLeaseDuplication("client-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockOpenNotification).toHaveBeenCalledWith(
        "error",
        "Duplication Failed",
        "Failed to load lease data"
      );
    });

    expect(result.current.error).toBe("Failed to load lease data");
    expect(result.current.duplicateData).toBe(null);
  });

  it("should clear property and tenant data in duplicated lease", async () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "duplicate" ? "lease-123" : null),
    } as any);

    mockUseGetLeaseByLuid.mockReturnValue({
      data: mockLeaseData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useLeaseDuplication("client-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.duplicateData).not.toBe(null);
    });

    expect(result.current.duplicateData?.property?.id).toBe("");
    expect(result.current.duplicateData?.property?.unitId).toBe("");
    expect(result.current.duplicateData?.tenantInfo).toEqual({
      id: "",
      email: "",
      firstName: "",
      lastName: "",
    });
    expect(result.current.duplicateData?.duration).toEqual({
      startDate: "",
      endDate: "",
      moveInDate: "",
    });
  });
});
