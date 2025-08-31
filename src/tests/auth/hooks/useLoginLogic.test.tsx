import { ReactNode } from "react";
import { authService } from "@services/auth";
import { NotificationProvider } from "@hooks/useNotification";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useLoginLogic } from "@app/(auth)/login/hook/useLoginLogic";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Mock dependencies
jest.mock("@services/auth");
jest.mock("next/navigation", () => ({
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
      <NotificationProvider>{children}</NotificationProvider>
    </QueryClientProvider>
  );
}

describe("useLoginLogic Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useLoginLogic(), {
      wrapper: TestWrapper,
    });

    expect(result.current.form.values.rememberMe).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isModalOpen).toBe(false);
  });

  it("should handle successful login with single account", async () => {
    const mockResponse = {
      msg: "Login successful",
      accounts: [],
      activeAccount: { cuid: "123", displayName: "Test User" },
    };
    mockAuthService.login.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLoginLogic(), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await result.current.handleSubmit({
        email: "test@example.com",
        password: "password",
        otpCode: "",
        rememberMe: false,
      });
    });

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
        otpCode: "",
        rememberMe: false,
      });
    });
  });

  it("should handle login with multiple accounts", async () => {
    const mockResponse = {
      msg: "Login successful",
      accounts: [
        { cuid: "123", displayName: "Account 1" },
        { cuid: "456", displayName: "Account 2" },
      ],
      activeAccount: { cuid: "123", displayName: "Account 1" },
    };
    mockAuthService.login.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLoginLogic(), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await result.current.handleSubmit({
        email: "test@example.com",
        password: "password",
        otpCode: "",
        rememberMe: false,
      });
    });

    await waitFor(() => {
      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.userAccounts).toEqual(mockResponse.accounts);
    });
  });
});
