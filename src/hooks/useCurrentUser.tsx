"use client";

import { useEffect } from "react";
import { authService, EventTypes } from "@services/index";
import { CURRENT_USER_QUERY_KEY } from "@utils/constants";
import { useAuthActions, useAuth } from "@store/auth.store";
import { useQueryClient, useQuery } from "@tanstack/react-query";

import { usePublish, useEvent } from "./event";

const TWO_MINUTES_IN_MS = 2 * 60 * 1000;

export const useCurrentUser = () => {
  const publish = usePublish();
  const queryClient = useQueryClient();
  const { isLoggedIn, client, isRefreshingToken } = useAuth();
  const { setUser } = useAuthActions();

  const {
    data: userData,
    isLoading: isFetchingUser,
    isError,
    error,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      try {
        console.log("Current user start fetchin...");
        const response = await authService.currentuser(client?.cuid ?? "");
        return response?.data || null;
      } catch (err: any) {
        console.info("Current user fetch failed:", err);
        const status = err.statusCode;
        if (status === 401 || status === 403) {
          console.warn(`Auth error (${status}) fetching current user.`);
          // queryClient.removeQueries({ queryKey: CURRENT_USER_QUERY_KEY });
        }
        throw err;
      }
    },
    refetchOnWindowFocus: true,
    enabled: !!client?.cuid,
    staleTime: TWO_MINUTES_IN_MS, // data is fresh for 2 minutes
    retry: (
      failureCount,
      error: { success: boolean; message: string; statusCode: number }
    ) => {
      const status = error.statusCode;
      // DO NOT retry if the error is 401 (Unauthorized) or 403 (Forbidden)
      if (status === 401 || status === 403) {
        console.log(
          "Retry aborted: Unauthorized (401) or Forbidden (403) error encountered while fetching current user."
        );
        return false;
      }

      return failureCount < 2;
    },
  });

  // Event listener for GET_CURRENT_USER events
  useEvent(EventTypes.GET_CURRENT_USER, () => {
    if (client?.cuid) {
      refetch();
    }
  });

  // Listen for token refresh events to refetch user data
  useEvent(EventTypes.TOKEN_REFRESHED, () => {
    console.log("Token refreshed, refetching user data...");
    if (client?.cuid) {
      refetch().catch((err) => {
        console.error("Failed to refetch user data after token refresh:", err);
        // If user fetch fails after successful token refresh, clear user data
        setUser(null);
        publish(EventTypes.CURRENT_USER_UPDATED, null);
        queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      });
    }
  });

  // CRITICAL: Handle auth failures by immediately clearing user data
  useEvent(EventTypes.AUTH_FAILURE, (data) => {
    console.log("Auth failure detected, clearing user data:", data);
    setUser(null);
    publish(EventTypes.CURRENT_USER_UPDATED, null);
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: CURRENT_USER_QUERY_KEY });
  });

  useEffect(() => {
    if (isSuccess) {
      publish(EventTypes.CURRENT_USER_UPDATED, userData);
    }
    if (isError) {
      // request failed
      const status = error.statusCode;
      if (status === 401 || status === 403) {
        console.log(
          `Sync: Clearing user in Zustand due to auth error (${status})`
        );
        publish(EventTypes.CURRENT_USER_UPDATED, null);
        queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      } else {
        console.log("Sync: Non-auth error fetching user:", error);
      }
    }
  }, [isSuccess, isError, userData, error, queryClient, publish]);

  // Enhanced loading state that considers both user fetching and token refresh
  const isLoading = isFetchingUser || isRefreshingToken;

  return {
    user: userData,
    isFetchingUser,
    isRefreshingToken,
    isLoading, // Combined loading state
    isError,
    error,
    isLoggedIn,
    refreshUser: refetch,
  };
};
