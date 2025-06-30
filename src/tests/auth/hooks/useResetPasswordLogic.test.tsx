import { renderHook, act, waitFor } from "@testing-library/react";
import { useResetPasswordLogic } from "@app/(auth)/reset_password/[token]/hook/useResetPasswordLogic";
import { authService } from "@services/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "@hooks/useNotification";
import { ReactNode } from "react";

// Mock dependencies
jest.mock("@services/auth");
jest.mock("next/navigation", () => ({
  useParams: () => ({ token: "test-token" }),
}));

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
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </QueryClientProvider>
  );
}

describe("useResetPasswordLogic Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useResetPasswordLogic(), {
      wrapper: TestWrapper,
    });

    expect(result.current.form.values.password).toBe("");
    expect(result.current.form.values.cpassword).toBe("");
    expect(result.current.form.values.token).toBe("test-token");
    expect(result.current.token).toBe("test-token");
    expect(result.current.isPending).toBe(false);
  });

  it("should handle successful password reset", async () => {
    const mockResponse = { msg: "Password reset successful" };
    mockAuthService.resetPassword.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useResetPasswordLogic(), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await result.current.handleSubmit({
        password: "newpassword",
        cpassword: "newpassword",
        token: "test-token",
      });
    });

    await waitFor(() => {
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith("test-token", "newpassword");
    });
  });

  it("should reset form after successful submission", async () => {
    const mockResponse = { msg: "Password reset successful" };
    mockAuthService.resetPassword.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useResetPasswordLogic(), {
      wrapper: TestWrapper,
    });

    // Set form values
    act(() => {
      result.current.form.setFieldValue("password", "newpassword");
      result.current.form.setFieldValue("cpassword", "newpassword");
    });

    expect(result.current.form.values.password).toBe("newpassword");
    expect(result.current.form.values.cpassword).toBe("newpassword");

    await act(async () => {
      await result.current.handleSubmit({
        password: "newpassword",
        cpassword: "newpassword",
        token: "test-token",
      });
    });

    await waitFor(() => {
      expect(result.current.form.values.password).toBe("");
      expect(result.current.form.values.cpassword).toBe("");
    });
  });
});