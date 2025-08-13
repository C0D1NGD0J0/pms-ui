import { useCallback } from "react";
import { useAuthActions, LoadingReason, useAuth } from "@store/auth.store";

/**
 * Simple loading manager that uses the existing auth store
 * Follows established patterns and removes Map/Set complexity
 */
export const useLoadingManager = () => {
  const { currentLoadingState, isLoading, loadingMessage } = useAuth();
  const { setLoadingState } = useAuthActions();

  // Helper functions for different loading states
  const setAuthenticating = useCallback(
    (loading: boolean) => {
      setLoadingState(loading ? LoadingReason.AUTHENTICATING : null);
    },
    [setLoadingState]
  );

  const setRefreshingToken = useCallback(
    (loading: boolean) => {
      setLoadingState(loading ? LoadingReason.REFRESHING_TOKEN : null);
    },
    [setLoadingState]
  );

  const setFetchingUser = useCallback(
    (loading: boolean) => {
      setLoadingState(loading ? LoadingReason.FETCHING_USER : null);
    },
    [setLoadingState]
  );

  const setProcessingInvite = useCallback(
    (loading: boolean) => {
      setLoadingState(loading ? LoadingReason.PROCESSING_INVITE : null);
    },
    [setLoadingState]
  );

  const setIdleSession = useCallback(
    (idle: boolean) => {
      setLoadingState(idle ? LoadingReason.IDLE_SESSION : null);
    },
    [setLoadingState]
  );

  const setLoggingOut = useCallback(
    (loading: boolean) => {
      setLoadingState(loading ? LoadingReason.LOGGING_OUT : null);
    },
    [setLoadingState]
  );

  const setInitializing = useCallback(
    (loading: boolean) => {
      setLoadingState(loading ? LoadingReason.INITIALIZING : null);
    },
    [setLoadingState]
  );

  const clearLoadingState = useCallback(() => {
    setLoadingState(null);
  }, [setLoadingState]);

  return {
    // Current state
    isLoading,
    loadingMessage,
    currentLoadingState,

    // Individual loading setters
    setAuthenticating,
    setRefreshingToken,
    setFetchingUser,
    setProcessingInvite,
    setIdleSession,
    setLoggingOut,
    setInitializing,

    // Utility
    clearLoadingState,
  };
};
