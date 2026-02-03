import { ReactNode } from "react";
import { authService } from "@services/auth";
import { NotificationProvider } from "@hooks/useNotification";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useRegisterLogic } from "@app/(auth)/register/hook/useRegisterLogic";

// Mock dependencies
jest.mock("@services/auth");

const mockAuthService = authService as jest.Mocked<typeof authService>;

function TestWrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>{children}</NotificationProvider>
    </QueryClientProvider>
  );
}

describe("useRegisterLogic Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useRegisterLogic(), {
      wrapper: TestWrapper,
    });

    expect(result.current.currentStep).toBe(0);
    expect(result.current.isPending).toBe(false);
    expect(result.current.selectedPlan).toBe(null);
    expect(result.current.accountType).toBe(null);
    expect(typeof result.current.handleSelectPlan).toBe("function");
    expect(typeof result.current.handleSelectAccountType).toBe("function");
  });

  it("should handle step navigation", () => {
    const { result } = renderHook(() => useRegisterLogic(), {
      wrapper: TestWrapper,
    });

    expect(result.current.currentStep).toBe(0);

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(1);

    act(() => {
      result.current.prevStep();
    });

    expect(result.current.currentStep).toBe(0);
  });

  it("should handle account type selection", () => {
    const { result } = renderHook(() => useRegisterLogic(), {
      wrapper: TestWrapper,
    });

    expect(result.current.accountType).toBe(null);
    expect(result.current.currentStep).toBe(0);

    act(() => {
      result.current.handleSelectAccountType("business");
    });

    expect(result.current.accountType).toBe("business");
    expect(result.current.currentStep).toBe(1);
  });

  it("should handle plan selection and update form", () => {
    const { result } = renderHook(() => useRegisterLogic(), {
      wrapper: TestWrapper,
    });

    // First select account type
    act(() => {
      result.current.handleSelectAccountType("business");
    });

    expect(result.current.accountType).toBe("business");

    // Then select plan
    act(() => {
      result.current.handleSelectPlan("growth", "price_growth", "growth_monthly", "monthly");
    });

    expect(result.current.selectedPlan).toBe("growth");
    expect(result.current.currentStep).toBe(2);
    expect(result.current.form.values.accountType.planId).toBe("price_growth");
    expect(result.current.form.values.accountType.isEnterpriseAccount).toBe(true);
    expect(result.current.form.values.accountType.billingInterval).toBe("monthly");
  });

  it("should handle individual account type selection", () => {
    const { result } = renderHook(() => useRegisterLogic(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.handleSelectAccountType("individual");
    });

    expect(result.current.accountType).toBe("individual");

    act(() => {
      result.current.handleSelectPlan("essential", "price_essential", "essential_monthly", "monthly");
    });

    expect(result.current.selectedPlan).toBe("essential");
    expect(result.current.form.values.accountType.isEnterpriseAccount).toBe(false);
  });

  it("should handle successful registration", async () => {
    const mockResponse = { msg: "Registration successful" };
    mockAuthService.signup.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegisterLogic(), {
      wrapper: TestWrapper,
    });

    const formData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password",
      cpassword: "password",
      location: "Test City",
      accountType: {
        planId: "price_essential",
        isEnterpriseAccount: false,
        billingInterval: "monthly" as const,
      },
      phoneNumber: "+1234567890",
      displayName: "John Doe",
      companyProfile: {
        tradingName: "",
        legalEntityName: "",
        website: "",
        companyEmail: "",
        companyPhone: "",
      },
    };

    await act(async () => {
      await result.current.handleSubmit(formData);
    });

    await waitFor(() => {
      expect(mockAuthService.signup).toHaveBeenCalledWith({
        ...formData,
        companyProfile: undefined, // Should be undefined for individual account
      });
    });
  });
});
