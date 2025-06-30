import { renderHook, act, waitFor } from "@testing-library/react";
import { useAccountActivationLogic } from "@app/(auth)/account_activation/[cid]/hook/useAccountActivationLogic";
import { authService } from "@services/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "@hooks/useNotification";
import { ReactNode } from "react";

// Mock dependencies
jest.mock("@services/auth");
jest.mock("next/navigation", () => ({
  useParams: () => ({ cid: "test-cid" }),
  useSearchParams: () => ({
    get: (key: string) => key === "t" ? "test-token" : null,
  }),
  useRouter: () => ({
    push: jest.fn(),
  }),
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

describe("useAccountActivationLogic Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useAccountActivationLogic(), {
      wrapper: TestWrapper,
    });

    expect(result.current.form.values.cid).toBe("test-cid");
    expect(result.current.form.values.token).toBe("test-token");
    expect(result.current.token).toBe("test-token");
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.showResendActivation).toBe(false);
  });

  it("should handle successful account activation", async () => {
    const mockResponse = { msg: "Account activated successfully" };
    mockAuthService.accountActivation.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAccountActivationLogic(), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await result.current.handleSubmit({
        cid: "test-cid",
        token: "test-token",
      });
    });

    await waitFor(() => {
      expect(mockAuthService.accountActivation).toHaveBeenCalledWith("test-cid", {
        type: "verifyCode",
        cid: "test-cid",
        token: "test-token",
        email: "",
      });
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("should handle resend activation link", async () => {
    const mockResponse = { msg: "Activation link sent" };
    mockAuthService.resendActivationLink.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAccountActivationLogic(), {
      wrapper: TestWrapper,
    });

    // Set email
    act(() => {
      result.current.setEmail("test@example.com");
    });

    await act(async () => {
      await result.current.handleResendActivation();
    });

    await waitFor(() => {
      expect(mockAuthService.resendActivationLink).toHaveBeenCalledWith("test@example.com");
    });
  });
});