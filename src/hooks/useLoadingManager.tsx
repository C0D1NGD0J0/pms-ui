import { useMemo } from "react";
import { useAuthActions, LoadingReason, useAuth } from "@store/auth.store";

/**
 * Simple loading manager that uses the existing auth store
 * Follows established patterns and removes Map/Set complexity
 */
export const useLoadingManager = () => {
  const { currentLoadingState, isLoading, loadingMessage } = useAuth();
  const { setLoadingState } = useAuthActions();

  // Memoize helper functions to prevent unnecessary recreations
  const loadingHelpers = useMemo(() => {
    const setAuthenticating = (loading: boolean) => {
      setLoadingState(loading ? LoadingReason.AUTHENTICATING : null);
    };

    const setRefreshingToken = (loading: boolean) => {
      setLoadingState(loading ? LoadingReason.REFRESHING_TOKEN : null);
    };

    const setFetchingUser = (loading: boolean) => {
      setLoadingState(loading ? LoadingReason.FETCHING_USER : null);
    };

    const setProcessingInvite = (loading: boolean) => {
      setLoadingState(loading ? LoadingReason.PROCESSING_INVITE : null);
    };

    const setIdleSession = (idle: boolean) => {
      setLoadingState(idle ? LoadingReason.IDLE_SESSION : null);
    };

    const setLoggingOut = (loading: boolean) => {
      setLoadingState(loading ? LoadingReason.LOGGING_OUT : null);
    };

    const setInitializing = (loading: boolean) => {
      setLoadingState(loading ? LoadingReason.INITIALIZING : null);
    };

    const clearLoadingState = () => {
      setLoadingState(null);
    };

    return {
      setAuthenticating,
      setRefreshingToken,
      setFetchingUser,
      setProcessingInvite,
      setIdleSession,
      setLoggingOut,
      setInitializing,
      clearLoadingState,
    };
  }, [setLoadingState]);

  return {
    // Current state
    isLoading,
    loadingMessage,
    currentLoadingState,

    // Individual loading setters (spread from memoized helpers)
    ...loadingHelpers,
  };
};
