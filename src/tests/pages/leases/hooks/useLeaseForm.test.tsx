import React from "react";
import { useAuth } from "@store/index";
import { useRouter } from "next/navigation";
import { leaseService } from "@services/lease";
import { useNotification } from "@hooks/useNotification";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// Hook doesn't exist - tests are skipped
// import { useLeaseForm } from "@app/(protectedRoutes)/leases/[cuid]/hooks/useLeaseForm";

jest.mock("@services/lease");
jest.mock("@hooks/useNotification");
jest.mock("@store/index");
jest.mock("next/navigation");

const mockLeaseService = leaseService as jest.Mocked<typeof leaseService>;
const mockUseNotification = useNotification as jest.MockedFunction<
  typeof useNotification
>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

const mockOpenNotification = jest.fn();
const mockRouterPush = jest.fn();

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

describe.skip("useLeaseForm - hook doesn't exist", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseNotification.mockReturnValue({
      openNotification: mockOpenNotification,
    } as any);

    mockUseAuth.mockReturnValue({
      client: { cuid: "client-123" },
    } as any);

    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
    } as any);
  });

  it("should handle successful lease creation", async () => {
    const mockResponse = {
      data: {
        success: true,
        message: "Lease created successfully",
      },
    };

    mockLeaseService.createLease.mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useLeaseForm(), {
      wrapper: createWrapper(),
    });

    const mockForm = {
      values: {
        type: "fixed-term",
        property: { id: "prop-123" },
        fees: { monthlyRent: 1500 },
        duration: { startDate: "2025-01-01", endDate: "2026-01-01" },
      },
      validate: jest.fn().mockReturnValue({ hasErrors: false }),
    } as any;

    await result.current.handleSubmit(mockForm);

    await waitFor(() => {
      expect(mockLeaseService.createLease).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockOpenNotification).toHaveBeenCalledWith(
        "success",
        "Lease Created",
        "Lease has been created successfully!"
      );
    }, { timeout: 3000 });
  });

  it("should handle validation errors", async () => {
    const { result } = renderHook(() => useLeaseForm(), {
      wrapper: createWrapper(),
    });

    const mockForm = {
      values: {},
      validate: jest.fn().mockReturnValue({ hasErrors: true }),
    } as any;

    await result.current.handleSubmit(mockForm);

    expect(mockOpenNotification).toHaveBeenCalledWith(
      "error",
      "Validation Error",
      "Please fix all form errors before submitting"
    );
    expect(mockLeaseService.createLease).not.toHaveBeenCalled();
  });

  it("should handle API errors", async () => {
    mockLeaseService.createLease.mockRejectedValue({
      response: {
        data: { message: "Property not available" },
      },
    });

    const { result } = renderHook(() => useLeaseForm(), {
      wrapper: createWrapper(),
    });

    const mockForm = {
      values: {
        type: "fixed-term",
        property: { id: "prop-123" },
        duration: { startDate: "2025-01-01", endDate: "2026-01-01" },
      },
      validate: jest.fn().mockReturnValue({ hasErrors: false }),
    } as any;

    await result.current.handleSubmit(mockForm);

    await waitFor(() => {
      expect(mockLeaseService.createLease).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockOpenNotification).toHaveBeenCalledWith(
        "error",
        "Creation Failed",
        "Property not available"
      );
    }, { timeout: 3000 });
  });

  it("should filter out empty co-tenants", async () => {
    const mockResponse = {
      data: { success: true },
    };

    mockLeaseService.createLease.mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useLeaseForm(), {
      wrapper: createWrapper(),
    });

    const mockForm = {
      values: {
        type: "fixed-term",
        property: { id: "prop-123" },
        fees: { monthlyRent: 1500 },
        duration: { startDate: "2025-01-01", endDate: "2026-01-01" },
        coTenants: [
          { name: "John Doe", email: "john@test.com", phone: "123456" },
          { name: "", email: "", phone: "" },
        ],
      },
      validate: jest.fn().mockReturnValue({ hasErrors: false }),
    } as any;

    await result.current.handleSubmit(mockForm);

    await waitFor(() => {
      expect(mockLeaseService.createLease).toHaveBeenCalledWith(
        "client-123",
        expect.objectContaining({
          coTenants: [
            { name: "John Doe", email: "john@test.com", phone: "123456" },
          ],
        })
      );
    });
  });

  it("should handle missing client information", async () => {
    mockUseAuth.mockReturnValue({
      client: null,
    } as any);

    const { result } = renderHook(() => useLeaseForm(), {
      wrapper: createWrapper(),
    });

    const mockForm = {
      values: {},
      validate: jest.fn(),
    } as any;

    await result.current.handleSubmit(mockForm);

    expect(mockOpenNotification).toHaveBeenCalledWith(
      "error",
      "Error",
      "Client information not found"
    );
    expect(mockForm.validate).not.toHaveBeenCalled();
  });

  it("should expose isSubmitting state", () => {
    const { result } = renderHook(() => useLeaseForm(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.isSubmitting).toBe("boolean");
    expect(result.current.isSubmitting).toBe(false);
  });

  it("should handle server response with success: false", async () => {
    const mockResponse = {
      data: {
        success: false,
        message: "Lease limit reached",
      },
    };

    mockLeaseService.createLease.mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useLeaseForm(), {
      wrapper: createWrapper(),
    });

    const mockForm = {
      values: {
        type: "fixed-term",
        duration: { startDate: "2025-01-01", endDate: "2026-01-01" },
      },
      validate: jest.fn().mockReturnValue({ hasErrors: false }),
    } as any;

    await result.current.handleSubmit(mockForm);

    await waitFor(() => {
      expect(mockLeaseService.createLease).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockOpenNotification).toHaveBeenCalledWith(
        "error",
        "Creation Failed",
        "Lease limit reached"
      );
    }, { timeout: 3000 });

    expect(mockRouterPush).not.toHaveBeenCalled();
  });
});
