"use client";

import { useCallback } from "react";
import { authService } from "@services/auth";
import { EventTypes } from "@services/events";
import { useLoadingManager } from "@hooks/useLoadingManager";
import { useAuthActions, LoadingReason } from "@store/auth.store";

import { usePublish, useEvent } from "./event";

export const useTokenRefresh = () => {
  const { clearAuthState } = useAuthActions();
  const { setRefreshingToken, currentLoadingState } = useLoadingManager();

  const publish = usePublish();

  const refreshToken = useCallback(async () => {
    try {
      setRefreshingToken(true);

      console.log("Manually triggering token refresh...");
      const response = await authService.refreshToken();

      if (response) {
        console.log("Manual token refresh successful");
        // Trigger user data refresh using proper event system
        publish(EventTypes.TOKEN_REFRESHED, {
          timestamp: new Date().toISOString(),
        });
        return true;
      }

      return false;
    } catch (error: any) {
      console.error("Manual token refresh failed:", error);

      // If refresh fails due to auth error, clear auth state
      if (error.statusCode === 401 || error.statusCode === 403) {
        console.log(
          "Token refresh failed with auth error, clearing auth state"
        );
        clearAuthState();
      }

      return false;
    } finally {
      setRefreshingToken(false);
    }
  }, [setRefreshingToken, clearAuthState, publish]);

  // Listen for auth failures from axios interceptor using proper event system
  useEvent(EventTypes.AUTH_FAILURE, () => {
    console.log("Auth failure detected, clearing token refresh state");
    setRefreshingToken(false);
  });

  return {
    isRefreshingToken: currentLoadingState === LoadingReason.REFRESHING_TOKEN,
    refreshToken,
  };
};
