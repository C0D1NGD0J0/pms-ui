import { authService } from "@services/auth";
import { EventTypes } from "@services/events";
import { LoadingReason } from "@store/auth.store";
import { renderHook } from "@testing-library/react";
import { useTokenRefresh } from "@hooks/useTokenRefresh";

// Mock dependencies
const mockSetRefreshingToken = jest.fn();
const mockClearAuthState = jest.fn();
const mockPublish = jest.fn();
const mockCurrentLoadingState = jest.fn();

let mockEventHandlers: Record<string, (...args: any[]) => void> = {};

jest.mock("@hooks/useLoadingManager", () => ({
  useLoadingManager: jest.fn(() => ({
    setRefreshingToken: mockSetRefreshingToken,
    currentLoadingState: mockCurrentLoadingState(),
  })),
}));

jest.mock("@store/auth.store", () => ({
  useAuthActions: jest.fn(() => ({
    clearAuthState: mockClearAuthState,
  })),
  LoadingReason: {
    INITIALIZING: "initializing",
    AUTHENTICATING: "authenticating",
    REFRESHING_TOKEN: "refreshing_token",
    FETCHING_USER: "fetching_user",
    PROCESSING_INVITE: "processing_invite",
    IDLE_SESSION: "idle_session",
    LOGGING_OUT: "logging_out",
  },
}));

jest.mock("@hooks/event", () => ({
  usePublish: jest.fn(() => mockPublish),
  useEvent: jest.fn((eventType: string, handler: (...args: any[]) => void) => {
    mockEventHandlers[eventType] = handler;
  }),
}));

jest.mock("@services/auth", () => ({
  authService: {
    refreshToken: jest.fn(),
  },
}));

describe("useTokenRefresh", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEventHandlers = {};
    mockCurrentLoadingState.mockReturnValue(null);
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe("Token Refresh Success", () => {
    it("should successfully refresh token and publish event", async () => {
      (authService.refreshToken as jest.Mock).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useTokenRefresh());

      const refreshResult = await result.current.refreshToken();

      expect(refreshResult).toBe(true);
      expect(mockSetRefreshingToken).toHaveBeenCalledWith(true);
      expect(authService.refreshToken).toHaveBeenCalled();
      expect(mockPublish).toHaveBeenCalledWith(
        EventTypes.TOKEN_REFRESHED,
        expect.objectContaining({
          timestamp: expect.any(String),
        })
      );
      expect(mockSetRefreshingToken).toHaveBeenCalledWith(false);
    });

    it("should set loading state during token refresh", async () => {
      (authService.refreshToken as jest.Mock).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useTokenRefresh());

      await result.current.refreshToken();

      // Verify loading state was set to true at start
      expect(mockSetRefreshingToken).toHaveBeenCalledWith(true);
      // Verify loading state was set to false at end
      expect(mockSetRefreshingToken).toHaveBeenCalledWith(false);
    });
  });

  describe("Token Refresh Failure", () => {
    it("should return false when refresh fails", async () => {
      (authService.refreshToken as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useTokenRefresh());

      const refreshResult = await result.current.refreshToken();

      expect(refreshResult).toBe(false);
      expect(mockPublish).not.toHaveBeenCalled();
    });

    it("should clear auth state on 401 error", async () => {
      const error = { statusCode: 401, message: "Unauthorized" };
      (authService.refreshToken as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useTokenRefresh());

      const refreshResult = await result.current.refreshToken();

      expect(refreshResult).toBe(false);
      expect(mockClearAuthState).toHaveBeenCalled();
      expect(mockSetRefreshingToken).toHaveBeenCalledWith(false);
    });

    it("should clear auth state on 403 error", async () => {
      const error = { statusCode: 403, message: "Forbidden" };
      (authService.refreshToken as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useTokenRefresh());

      const refreshResult = await result.current.refreshToken();

      expect(refreshResult).toBe(false);
      expect(mockClearAuthState).toHaveBeenCalled();
    });

    it("should not clear auth state on non-auth errors", async () => {
      const error = { statusCode: 500, message: "Server Error" };
      (authService.refreshToken as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useTokenRefresh());

      const refreshResult = await result.current.refreshToken();

      expect(refreshResult).toBe(false);
      expect(mockClearAuthState).not.toHaveBeenCalled();
      expect(mockSetRefreshingToken).toHaveBeenCalledWith(false);
    });

    it("should always clear loading state in finally block", async () => {
      const error = new Error("Network error");
      (authService.refreshToken as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useTokenRefresh());

      await result.current.refreshToken();

      expect(mockSetRefreshingToken).toHaveBeenCalledWith(false);
    });
  });

  describe("Auth Failure Event Handling", () => {
    it("should register AUTH_FAILURE event listener", () => {
      renderHook(() => useTokenRefresh());

      expect(mockEventHandlers[EventTypes.AUTH_FAILURE]).toBeDefined();
    });

    it("should clear refreshing state on AUTH_FAILURE event", () => {
      renderHook(() => useTokenRefresh());

      // Trigger AUTH_FAILURE event
      if (mockEventHandlers[EventTypes.AUTH_FAILURE]) {
        mockEventHandlers[EventTypes.AUTH_FAILURE]();
      }

      expect(mockSetRefreshingToken).toHaveBeenCalledWith(false);
    });
  });

  describe("Loading State", () => {
    it("should return false when not refreshing token", () => {
      mockCurrentLoadingState.mockReturnValue(null);

      const { result } = renderHook(() => useTokenRefresh());

      expect(result.current.isRefreshingToken).toBe(false);
    });

    it("should return true when refreshing token", () => {
      mockCurrentLoadingState.mockReturnValue(LoadingReason.REFRESHING_TOKEN);

      const { result } = renderHook(() => useTokenRefresh());

      expect(result.current.isRefreshingToken).toBe(true);
    });

    it("should return false when in different loading state", () => {
      mockCurrentLoadingState.mockReturnValue(LoadingReason.AUTHENTICATING);

      const { result } = renderHook(() => useTokenRefresh());

      expect(result.current.isRefreshingToken).toBe(false);
    });
  });

  describe("Event Publishing", () => {
    it("should publish TOKEN_REFRESHED event with timestamp on success", async () => {
      (authService.refreshToken as jest.Mock).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useTokenRefresh());

      await result.current.refreshToken();

      expect(mockPublish).toHaveBeenCalledWith(
        EventTypes.TOKEN_REFRESHED,
        expect.objectContaining({
          timestamp: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
          ),
        })
      );
    });

    it("should not publish event when refresh fails", async () => {
      (authService.refreshToken as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useTokenRefresh());

      await result.current.refreshToken();

      expect(mockPublish).not.toHaveBeenCalled();
    });

    it("should not publish event when refresh throws error", async () => {
      (authService.refreshToken as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => useTokenRefresh());

      await result.current.refreshToken();

      expect(mockPublish).not.toHaveBeenCalled();
    });
  });
});
