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
    expect(typeof result.current.handleSelectPlan).toBe("function");
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

  it("should handle plan selection and update form", () => {
    const { result } = renderHook(() => useRegisterLogic(), {
      wrapper: TestWrapper,
    });

    expect(result.current.selectedPlan).toBe(null);
    expect(result.current.currentStep).toBe(0);

    act(() => {
      result.current.handleSelectPlan("business");
    });

    expect(result.current.selectedPlan).toBe("business");
    expect(result.current.currentStep).toBe(1);
    expect(result.current.form.values.accountType.planId).toBe("business");
    expect(result.current.form.values.accountType.planName).toBe("Business");
    expect(result.current.form.values.accountType.isCorporate).toBe(true);
  });

  it("should handle personal plan selection correctly", () => {
    const { result } = renderHook(() => useRegisterLogic(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.handleSelectPlan("personal");
    });

    expect(result.current.selectedPlan).toBe("personal");
    expect(result.current.form.values.accountType.planId).toBe("personal");
    expect(result.current.form.values.accountType.planName).toBe("Personal");
    expect(result.current.form.values.accountType.isCorporate).toBe(false);
  });

  it("should handle professional plan selection correctly", () => {
    const { result } = renderHook(() => useRegisterLogic(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.handleSelectPlan("professional");
    });

    expect(result.current.selectedPlan).toBe("professional");
    expect(result.current.form.values.accountType.planId).toBe("professional");
    expect(result.current.form.values.accountType.planName).toBe(
      "Professional"
    );
    expect(result.current.form.values.accountType.isCorporate).toBe(true);
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
        planId: "personal",
        planName: "personal",
        isCorporate: false,
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
        companyProfile: undefined, // Should be undefined for personal account
      });
    });
  });
});
