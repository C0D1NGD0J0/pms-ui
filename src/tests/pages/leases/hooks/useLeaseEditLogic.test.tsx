import React from "react";
import { useAuth } from "@store/index";
import { useRouter } from "next/navigation";
import { leaseService } from "@services/lease";
import { extractChanges } from "@utils/helpers";
import { useNotification } from "@hooks/useNotification";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useLeaseEditLogic } from "@app/(protectedRoutes)/leases/[cuid]/[luid]/edit/hook/useLeaseEditLogic";

jest.mock("@services/lease");
jest.mock("@store/index");
jest.mock("next/navigation");
jest.mock("@hooks/useNotification");
jest.mock("@utils/helpers");

jest.mock("@app/(protectedRoutes)/leases/[cuid]/hooks", () => ({
  useLeaseFormManagement: jest.fn(() => ({
    leaseForm: {
      values: {
        type: "fixed",
        property: {
          id: "prop-1",
          address: "123 Main St",
        },
        fees: { monthlyRent: 2000 },
        duration: {
          startDate: "2025-01-01",
          endDate: "2026-01-01",
        },
        coTenants: [],
      },
      validate: jest.fn(() => ({ hasErrors: false })),
    },
    originalValues: {
      type: "fixed",
      property: {
        id: "prop-1",
        address: "123 Main St",
      },
      fees: { monthlyRent: 1500 },
      duration: {
        startDate: "2025-01-01",
        endDate: "2026-01-01",
      },
      coTenants: [],
    },
    isFormValid: true,
    accordionItems: [],
    isEditing: true,
    editLuid: "lease-123",
    isLoadingEdit: false,
    editError: null,
    hasUnsavedChanges: true,
    html: "",
    isLoadingPreview: false,
    handlePreviewClick: jest.fn(),
    clearPreview: jest.fn(),
  })),
}));

const mockLeaseService = leaseService as jest.Mocked<typeof leaseService>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseNotification = useNotification as jest.MockedFunction<
  typeof useNotification
>;
const mockExtractChanges = extractChanges as jest.MockedFunction<
  typeof extractChanges
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

const mockParams = Promise.resolve({
  cuid: "client-123",
  luid: "lease-123",
});

describe("useLeaseEditLogic", () => {
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

    mockExtractChanges.mockReturnValue({
      fees: { monthlyRent: 2000 },
    });
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(
      () => useLeaseEditLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.cuid).toBe("client-123");
    expect(result.current.luid).toBe("lease-123");
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.showCoTenantWarning).toBe(false);
    expect(result.current.showPropertyChangeWarning).toBe(false);
  });


  it("should show co-tenant warning when no co-tenants exist", () => {
    const { result } = renderHook(
      () => useLeaseEditLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.handleUpdateLease();
    });

    expect(result.current.showCoTenantWarning).toBe(true);
  });

  it("should handle successful lease update", async () => {
    mockLeaseService.updateLease.mockResolvedValue({
      success: true,
      message: "Lease updated successfully",
    } as any);

    const { result } = renderHook(
      () => useLeaseEditLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    await act(async () => {
      result.current.handleConfirmWithoutCoTenants();
    });

    await waitFor(() => {
      expect(mockLeaseService.updateLease).toHaveBeenCalledWith(
        "client-123",
        "lease-123",
        expect.objectContaining({
          fees: { monthlyRent: 2000 },
        })
      );
    });

    await waitFor(
      () => {
        expect(mockOpenNotification).toHaveBeenCalledWith(
          "success",
          "Lease Updated",
          "Lease has been updated successfully!"
        );
        expect(mockRouterPush).toHaveBeenCalledWith("/leases/client-123");
      },
      { timeout: 3000 }
    );
  });

  it("should handle validation errors", async () => {
    const { result } = renderHook(
      () => useLeaseEditLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    result.current.leaseForm.validate = jest.fn(() => ({ hasErrors: true }));

    await act(async () => {
      result.current.handleConfirmWithoutCoTenants();
    });

    expect(mockOpenNotification).toHaveBeenCalledWith(
      "error",
      "Validation Error",
      "Please fix all form errors before submitting"
    );
    expect(mockLeaseService.updateLease).not.toHaveBeenCalled();
  });

  it("should handle no changes detected", async () => {
    mockExtractChanges.mockReturnValue(null);

    const { result } = renderHook(
      () => useLeaseEditLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    await act(async () => {
      result.current.handleConfirmWithoutCoTenants();
    });

    expect(mockOpenNotification).toHaveBeenCalledWith(
      "info",
      "No Changes",
      "No changes detected to update"
    );
    expect(mockLeaseService.updateLease).not.toHaveBeenCalled();
  });

  it("should handle API errors", async () => {
    const mockError = {
      response: {
        data: {
          message: "Lease is already expired",
        },
      },
    };

    mockLeaseService.updateLease.mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useLeaseEditLogic({ params: mockParams }),
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
          "Update Failed",
          "Lease is already expired"
        );
      },
      { timeout: 3000 }
    );
  });

  it("should ignore immutable fields when extracting changes", async () => {
    mockLeaseService.updateLease.mockResolvedValue({
      success: true,
    } as any);

    const { result } = renderHook(
      () => useLeaseEditLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    await act(async () => {
      result.current.handleConfirmWithoutCoTenants();
    });

    await waitFor(() => {
      expect(mockExtractChanges).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.objectContaining({
          ignoreKeys: [
            "cuid",
            "tenantInfo",
            "luid",
            "leaseNumber",
            "createdAt",
            "createdBy",
          ],
        })
      );
    });
  });


  it("should handle cancel action", () => {
    const { result } = renderHook(
      () => useLeaseEditLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.handleCancel();
    });

    expect(mockRouterBack).toHaveBeenCalled();
  });

  it("should handle update failure from server", async () => {
    mockLeaseService.updateLease.mockResolvedValue({
      success: false,
      message: "Update permission denied",
    } as any);

    const { result } = renderHook(
      () => useLeaseEditLogic({ params: mockParams }),
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
          "Update Failed",
          "Update permission denied"
        );
      },
      { timeout: 3000 }
    );

    expect(mockRouterPush).not.toHaveBeenCalled();
  });


  it("should close warning modals", () => {
    const { result } = renderHook(
      () => useLeaseEditLogic({ params: mockParams }),
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.handleUpdateLease();
    });

    expect(result.current.showCoTenantWarning).toBe(true);

    act(() => {
      result.current.setShowCoTenantWarning(false);
    });

    expect(result.current.showCoTenantWarning).toBe(false);

    act(() => {
      result.current.setShowPropertyChangeWarning(true);
    });

    expect(result.current.showPropertyChangeWarning).toBe(true);

    act(() => {
      result.current.setShowPropertyChangeWarning(false);
    });

    expect(result.current.showPropertyChangeWarning).toBe(false);
  });
});
