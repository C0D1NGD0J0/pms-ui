"use client";

import { useEffect } from "react";
import { useAuth } from "@store/auth.store";
import { authService, EventTypes } from "@services/index";
import { CURRENT_USER_QUERY_KEY } from "@utils/constants";
import { useQueryClient, useQuery } from "@tanstack/react-query";

import { usePublish, useEvent } from "./event";

const TWO_MINUTES_IN_MS = 2 * 60 * 1000;

export const useCurrentUser = () => {
  const publish = usePublish();
  const queryClient = useQueryClient();
  const { isLoggedIn, client } = useAuth();

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
        const response = await authService.currentuser(client?.csub ?? "");
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
    enabled: !!client?.csub,
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
    if (client?.csub) {
      refetch();
    }
  });

  // Listen for token refresh events to refetch user data
  useEvent(EventTypes.TOKEN_REFRESHED, () => {
    console.log("Token refreshed, refetching user data...");
    if (client?.csub) {
      refetch();
    }
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

  return {
    user: userData,
    isFetchingUser,
    isError,
    error,
    isLoggedIn,
    refreshUser: refetch,
  };
};
