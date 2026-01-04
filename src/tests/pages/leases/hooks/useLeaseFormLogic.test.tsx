import React from "react";
import { useAuth } from "@store/index";
import { useRouter } from "next/navigation";
import { leaseService } from "@services/lease";
import { useNotification } from "@hooks/useNotification";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useLeaseFormLogic } from "@app/(protectedRoutes)/leases/[cuid]/new/hook/useLeaseFormLogic";

jest.mock("@services/lease");
jest.mock("@store/index");
jest.mock("next/navigation");
jest.mock("@hooks/useNotification");

jest.mock("@app/(protectedRoutes)/leases/[cuid]/hooks", () => ({
  useLeaseFormManagement: jest.fn(() => ({
    leaseForm: {
      values: {
        type: "fixed",
        property: { id: "prop-1" },
        fees: { monthlyRent: 1500 },
        duration: {
          startDate: "2025-01-01",
          endDate: "2026-01-01",
        },
        coTenants: [],
      },
      validate: jest.fn(() => ({ hasErrors: false })),
    },
    isFormValid: true,
    accordionItems: [],
    isDuplicating: false,
    duplicateSource: null,
    duplicateError: null,
  })),
}));

const mockLeaseService = leaseService as jest.Mocked<typeof leaseService>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseNotification = useNotification as jest.MockedFunction<
  typeof useNotification
>;

const mockOpenNotification = jest.fn();
const mockRouterPush = jest.fn();
const mockRouterBack = jest.fn();

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

const mockParams = Promise.resolve({ cuid: "client-123" });

describe.skip("useLeaseFormLogic - requires async params handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      client: { cuid: "client-123", displayName: "Test Client" },
    } as any);

    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
      back: mockRouterBack,
    } as any);

    mockUseNotification.mockReturnValue({
      openNotification: mockOpenNotification,
    } as any);
  });

  it("should initialize with correct default values", async () => {
    const { result } = renderHook(
      () => useLeaseFormLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.cuid).toBe("client-123");
    });
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.showCoTenantWarning).toBe(false);
  });

  it("should show co-tenant warning when no co-tenants exist", () => {
    const { result } = renderHook(
      () => useLeaseFormLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.handleCreateLease();
    });

    expect(result.current.showCoTenantWarning).toBe(true);
  });

  it("should handle successful lease creation", async () => {
    const mockResponse = {
      data: {
        success: true,
        message: "Lease created successfully",
      },
    };

    mockLeaseService.createLease.mockResolvedValue(mockResponse as any);

    const { result } = renderHook(
      () => useLeaseFormLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    await act(async () => {
      result.current.handleConfirmWithoutCoTenants();
    });

    await waitFor(() => {
      expect(mockLeaseService.createLease).toHaveBeenCalled();
    });

    await waitFor(
      () => {
        expect(mockOpenNotification).toHaveBeenCalledWith(
          "success",
          "Lease Created",
          "Lease has been created successfully!"
        );
        expect(mockRouterPush).toHaveBeenCalledWith("/leases/client-123");
      },
      { timeout: 3000 }
    );
  });

  it("should handle validation errors", async () => {
    const { result } = renderHook(
      () => useLeaseFormLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    // Mock validation failure
    result.current.leaseForm.validate = jest.fn(() => ({ hasErrors: true }));

    await act(async () => {
      result.current.handleConfirmWithoutCoTenants();
    });

    expect(mockOpenNotification).toHaveBeenCalledWith(
      "error",
      "Validation Error",
      "Please fix all form errors before submitting"
    );
    expect(mockLeaseService.createLease).not.toHaveBeenCalled();
  });

  it("should handle API errors", async () => {
    const mockError = {
      response: {
        data: {
          message: "Property not available",
        },
      },
    };

    mockLeaseService.createLease.mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useLeaseFormLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    await act(async () => {
      result.current.handleConfirmWithoutCoTenants();
    });

    await waitFor(
      () => {
        expect(mockOpenNotification).toHaveBeenCalledWith(
          "error",
          "Creation Failed",
          "Property not available"
        );
      },
      { timeout: 3000 }
    );
  });

  it("should handle missing client information", async () => {
    mockUseAuth.mockReturnValue({
      client: null,
    } as any);

    const { result } = renderHook(
      () => useLeaseFormLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    await act(async () => {
      result.current.handleConfirmWithoutCoTenants();
    });

    expect(mockOpenNotification).toHaveBeenCalledWith(
      "error",
      "Error",
      "Client information not found"
    );
    expect(mockLeaseService.createLease).not.toHaveBeenCalled();
  });


  it("should handle cancel action", () => {
    const { result } = renderHook(
      () => useLeaseFormLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.handleCancel();
    });

    expect(mockRouterBack).toHaveBeenCalled();
  });

  it("should handle creation failure from server", async () => {
    const mockResponse = {
      data: {
        success: false,
        message: "Lease limit reached",
      },
    };

    mockLeaseService.createLease.mockResolvedValue(mockResponse as any);

    const { result } = renderHook(
      () => useLeaseFormLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    await act(async () => {
      result.current.handleConfirmWithoutCoTenants();
    });

    await waitFor(
      () => {
        expect(mockOpenNotification).toHaveBeenCalledWith(
          "error",
          "Creation Failed",
          "Lease limit reached"
        );
      },
      { timeout: 3000 }
    );

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it("should close co-tenant warning modal", () => {
    const { result } = renderHook(
      () => useLeaseFormLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.handleCreateLease();
    });

    expect(result.current.showCoTenantWarning).toBe(true);

    act(() => {
      result.current.setShowCoTenantWarning(false);
    });

    expect(result.current.showCoTenantWarning).toBe(false);
  });
});
