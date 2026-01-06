import { ReactNode } from "react";
import { authService } from "@services/auth";
import { NotificationProvider } from "@hooks/useNotification";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useForgotPasswordLogic } from "@app/(auth)/forgot_password/hook/useForgotPasswordLogic";

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

describe("useForgotPasswordLogic Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useForgotPasswordLogic(), {
      wrapper: TestWrapper,
    });

    expect(result.current.form.values.email).toBe("");
    expect(result.current.isPending).toBe(false);
  });

  it("should handle successful password reset request", async () => {
    const mockResponse = { msg: "Password reset link sent" };
    mockAuthService.forgotPassword.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useForgotPasswordLogic(), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await result.current.handleSubmit({ email: "test@example.com" });
    });

    await waitFor(() => {
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(
        "test@example.com"
      );
    });
  });

  it("should handle form reset after successful submission", async () => {
    const mockResponse = { msg: "Password reset link sent" };
    mockAuthService.forgotPassword.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useForgotPasswordLogic(), {
      wrapper: TestWrapper,
    });

    // Set email value
    act(() => {
      result.current.form.setFieldValue("email", "test@example.com");
    });

    expect(result.current.form.values.email).toBe("test@example.com");

    await act(async () => {
      await result.current.handleSubmit({ email: "test@example.com" });
    });

    await waitFor(() => {
      expect(result.current.form.values.email).toBe("");
    });
  });
});
