import { LoadingReason } from "@store/auth.store";
import { renderHook, act } from "@testing-library/react";
import { useLoadingManager } from "@hooks/useLoadingManager";

// Mock the auth store
jest.mock("@store/auth.store", () => ({
  useAuth: jest.fn(),
  useAuthActions: jest.fn(),
  LoadingReason: {
    AUTHENTICATING: "AUTHENTICATING",
    REFRESHING_TOKEN: "REFRESHING_TOKEN",
    FETCHING_USER: "FETCHING_USER",
    PROCESSING_INVITE: "PROCESSING_INVITE",
    IDLE_SESSION: "IDLE_SESSION",
    LOGGING_OUT: "LOGGING_OUT",
    INITIALIZING: "INITIALIZING",
  },
}));

import { useAuthActions, useAuth } from "@store/auth.store";

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseAuthActions = useAuthActions as jest.MockedFunction<
  typeof useAuthActions
>;

describe("useLoadingManager", () => {
  const mockSetLoadingState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      currentLoadingState: null,
      isLoading: false,
      loadingMessage: null,
    } as any);

    mockUseAuthActions.mockReturnValue({
      setLoadingState: mockSetLoadingState,
    } as any);
  });

  it("should return auth state and loading functions", () => {
    const { result } = renderHook(() => useLoadingManager());

    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("loadingMessage");
    expect(result.current).toHaveProperty("currentLoadingState");
    expect(result.current).toHaveProperty("setAuthenticating");
    expect(result.current).toHaveProperty("clearLoadingState");
  });

  it("should set authenticating state", () => {
    const { result } = renderHook(() => useLoadingManager());

    act(() => {
      result.current.setAuthenticating(true);
    });

    expect(mockSetLoadingState).toHaveBeenCalledWith(
      LoadingReason.AUTHENTICATING
    );

    act(() => {
      result.current.setAuthenticating(false);
    });

    expect(mockSetLoadingState).toHaveBeenCalledWith(null);
  });

  it("should set refreshing token state", () => {
    const { result } = renderHook(() => useLoadingManager());

    act(() => {
      result.current.setRefreshingToken(true);
    });

    expect(mockSetLoadingState).toHaveBeenCalledWith(
      LoadingReason.REFRESHING_TOKEN
    );

    act(() => {
      result.current.setRefreshingToken(false);
    });

    expect(mockSetLoadingState).toHaveBeenCalledWith(null);
  });

  it("should set fetching user state", () => {
    const { result } = renderHook(() => useLoadingManager());

    act(() => {
      result.current.setFetchingUser(true);
    });

    expect(mockSetLoadingState).toHaveBeenCalledWith(
      LoadingReason.FETCHING_USER
    );
  });

  it("should set processing invite state", () => {
    const { result } = renderHook(() => useLoadingManager());

    act(() => {
      result.current.setProcessingInvite(true);
    });

    expect(mockSetLoadingState).toHaveBeenCalledWith(
      LoadingReason.PROCESSING_INVITE
    );
  });

  it("should set idle session state", () => {
    const { result } = renderHook(() => useLoadingManager());

    act(() => {
      result.current.setIdleSession(true);
    });

    expect(mockSetLoadingState).toHaveBeenCalledWith(
      LoadingReason.IDLE_SESSION
    );
  });

  it("should set logging out state", () => {
    const { result } = renderHook(() => useLoadingManager());

    act(() => {
      result.current.setLoggingOut(true);
    });

    expect(mockSetLoadingState).toHaveBeenCalledWith(LoadingReason.LOGGING_OUT);
  });

  it("should set initializing state", () => {
    const { result } = renderHook(() => useLoadingManager());

    act(() => {
      result.current.setInitializing(true);
    });

    expect(mockSetLoadingState).toHaveBeenCalledWith(
      LoadingReason.INITIALIZING
    );
  });

  it("should clear loading state", () => {
    const { result } = renderHook(() => useLoadingManager());

    act(() => {
      result.current.clearLoadingState();
    });

    expect(mockSetLoadingState).toHaveBeenCalledWith(null);
  });

  it("should return current auth state values", () => {
    const mockAuthState = {
      currentLoadingState: LoadingReason.AUTHENTICATING,
      isLoading: true,
      loadingMessage: "Authenticating user...",
    };

    mockUseAuth.mockReturnValue(mockAuthState as any);

    const { result } = renderHook(() => useLoadingManager());

    expect(result.current.currentLoadingState).toBe(
      LoadingReason.AUTHENTICATING
    );
    expect(result.current.isLoading).toBe(true);
    expect(result.current.loadingMessage).toBe("Authenticating user...");
  });

  it("should maintain stable function references", () => {
    const { result, rerender } = renderHook(() => useLoadingManager());

    const firstFunctions = {
      setAuthenticating: result.current.setAuthenticating,
      setRefreshingToken: result.current.setRefreshingToken,
      clearLoadingState: result.current.clearLoadingState,
    };

    rerender();

    const secondFunctions = {
      setAuthenticating: result.current.setAuthenticating,
      setRefreshingToken: result.current.setRefreshingToken,
      clearLoadingState: result.current.clearLoadingState,
    };

    expect(firstFunctions.setAuthenticating).toBe(
      secondFunctions.setAuthenticating
    );
    expect(firstFunctions.setRefreshingToken).toBe(
      secondFunctions.setRefreshingToken
    );
    expect(firstFunctions.clearLoadingState).toBe(
      secondFunctions.clearLoadingState
    );
  });

  it("should handle multiple loading state changes", () => {
    const { result } = renderHook(() => useLoadingManager());

    act(() => {
      result.current.setAuthenticating(true);
      result.current.setRefreshingToken(true);
      result.current.setFetchingUser(true);
    });

    expect(mockSetLoadingState).toHaveBeenCalledTimes(3);
    expect(mockSetLoadingState).toHaveBeenNthCalledWith(
      1,
      LoadingReason.AUTHENTICATING
    );
    expect(mockSetLoadingState).toHaveBeenNthCalledWith(
      2,
      LoadingReason.REFRESHING_TOKEN
    );
    expect(mockSetLoadingState).toHaveBeenNthCalledWith(
      3,
      LoadingReason.FETCHING_USER
    );
  });

  it("should handle boolean toggles for all loading states", () => {
    const { result } = renderHook(() => useLoadingManager());

    const loadingStates = [
      {
        setter: result.current.setAuthenticating,
        reason: LoadingReason.AUTHENTICATING,
      },
      {
        setter: result.current.setRefreshingToken,
        reason: LoadingReason.REFRESHING_TOKEN,
      },
      {
        setter: result.current.setFetchingUser,
        reason: LoadingReason.FETCHING_USER,
      },
      {
        setter: result.current.setProcessingInvite,
        reason: LoadingReason.PROCESSING_INVITE,
      },
      {
        setter: result.current.setIdleSession,
        reason: LoadingReason.IDLE_SESSION,
      },
      {
        setter: result.current.setLoggingOut,
        reason: LoadingReason.LOGGING_OUT,
      },
      {
        setter: result.current.setInitializing,
        reason: LoadingReason.INITIALIZING,
      },
    ];

    loadingStates.forEach(({ setter, reason }) => {
      act(() => {
        setter(true);
      });
      expect(mockSetLoadingState).toHaveBeenCalledWith(reason);

      act(() => {
        setter(false);
      });
      expect(mockSetLoadingState).toHaveBeenCalledWith(null);
    });
  });
});
