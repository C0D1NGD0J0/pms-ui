import { useCurrentUser } from "@hooks/useCurrentUser";
import { authService, EventTypes } from "@services/index";
import { renderHook, waitFor } from "@testing-library/react";
import { createTestQueryClient } from "@tests/utils/testHelpers";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Mock dependencies
jest.mock("@services/index");
jest.mock("@store/auth.store", () => ({
  useAuth: jest.fn(() => ({
    isLoggedIn: true,
    client: { cuid: "client-123" },
  })),
  useAuthActions: jest.fn(() => ({
    setUser: jest.fn(),
  })),
}));

// Mock event hooks
const mockPublish = jest.fn();
const mockEventHandlers: Record<string, (() => void) | undefined> = {};
jest.mock("@hooks/event", () => ({
  usePublish: () => mockPublish,
  useEvent: (eventType: string, handler: () => void) => {
    mockEventHandlers[eventType] = handler;
  },
}));

const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe("useCurrentUser", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    jest.clearAllMocks();
    mockEventHandlers[EventTypes.GET_CURRENT_USER] = undefined;
    mockEventHandlers[EventTypes.TOKEN_REFRESHED] = undefined;
    mockEventHandlers[EventTypes.AUTH_FAILURE] = undefined;
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should fetch current user data on mount", async () => {
    const mockUserData = {
      success: true,
      data: {
        user: {
          uid: "user-123",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
        },
        client: { cuid: "client-123", companyName: "Test Company" },
      },
    };

    mockedAuthService.currentuser.mockResolvedValue({
      status: 200,
      data: mockUserData,
    } as any);

    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUserData);
    expect(mockedAuthService.currentuser).toHaveBeenCalledWith("client-123");
  });

  it("should handle account switching by refetching user data", async () => {
    const userData1 = {
      success: true,
      data: {
        user: { uid: "user-123", email: "user1@example.com" },
        client: { cuid: "client-123" },
      },
    };

    const userData2 = {
      success: true,
      data: {
        user: { uid: "user-456", email: "user2@example.com" },
        client: { cuid: "client-456" },
      },
    };

    mockedAuthService.currentuser.mockResolvedValueOnce({
      status: 200,
      data: userData1,
    } as any);

    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(userData1);
    });

    // Simulate account switch
    mockedAuthService.currentuser.mockResolvedValueOnce({
      status: 200,
      data: userData2,
    } as any);

    // Trigger GET_CURRENT_USER event
    if (mockEventHandlers[EventTypes.GET_CURRENT_USER]) {
      mockEventHandlers[EventTypes.GET_CURRENT_USER]();
    }

    await waitFor(() => {
      expect(result.current.user).toEqual(userData2);
    });
  });

  it("should refetch user data on TOKEN_REFRESHED event", async () => {
    const mockUserData = {
      success: true,
      data: {
        user: { uid: "user-123" },
        client: { cuid: "client-123" },
      },
    };

    mockedAuthService.currentuser.mockResolvedValue({
      status: 200,
      data: mockUserData,
    } as any);

    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUserData);
    });

    // Clear previous calls
    jest.clearAllMocks();

    // Trigger TOKEN_REFRESHED event
    if (mockEventHandlers[EventTypes.TOKEN_REFRESHED]) {
      mockEventHandlers[EventTypes.TOKEN_REFRESHED]();
    }

    await waitFor(() => {
      expect(mockedAuthService.currentuser).toHaveBeenCalled();
    });
  });

  it("should clear user data on AUTH_FAILURE event", async () => {
    const mockUserData = {
      success: true,
      data: {
        user: { uid: "user-123" },
        client: { cuid: "client-123" },
      },
    };

    mockedAuthService.currentuser.mockResolvedValue({
      status: 200,
      data: mockUserData,
    } as any);

    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUserData);
    });

    // Trigger AUTH_FAILURE event
    if (mockEventHandlers[EventTypes.AUTH_FAILURE]) {
      mockEventHandlers[EventTypes.AUTH_FAILURE]({ reason: "session_expired" });
    }

    // Verify user data is cleared
    await waitFor(() => {
      expect(mockPublish).toHaveBeenCalledWith(
        EventTypes.CURRENT_USER_UPDATED,
        null
      );
    });
  });

  it("should not retry on 401 error", async () => {
    const error = { statusCode: 401, message: "Unauthorized", success: false };
    mockedAuthService.currentuser.mockRejectedValue(error);

    renderHook(() => useCurrentUser(), { wrapper });

    await waitFor(
      () => {
        expect(mockedAuthService.currentuser).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    // Should only call once (no retries)
    expect(mockedAuthService.currentuser).toHaveBeenCalledTimes(1);
  });

  it("should not retry on 403 error", async () => {
    const error = { statusCode: 403, message: "Forbidden", success: false };
    mockedAuthService.currentuser.mockRejectedValue(error);

    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    await waitFor(
      () => {
        expect(mockedAuthService.currentuser).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    // Should only call once (no retries)
    expect(mockedAuthService.currentuser).toHaveBeenCalledTimes(1);
  });

  it("should publish CURRENT_USER_UPDATED on successful fetch", async () => {
    const mockUserData = {
      success: true,
      data: {
        user: { uid: "user-123" },
        client: { cuid: "client-123" },
      },
    };

    mockedAuthService.currentuser.mockResolvedValue({
      status: 200,
      data: mockUserData,
    } as any);

    renderHook(() => useCurrentUser(), { wrapper });

    await waitFor(() => {
      expect(mockPublish).toHaveBeenCalledWith(
        EventTypes.CURRENT_USER_UPDATED,
        mockUserData
      );
    });
  });
});
