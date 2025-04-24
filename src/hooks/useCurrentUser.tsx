"use client";

import { useEffect } from "react";
import { authService } from "@services/index";
import { useAuthActions, useAuth } from "@store/auth.store";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const FIVE_MINUTES_IN_MS = 2 * 60 * 1000;
const USER_QUERY_KEY = ["currentUser"];

export const useCurrentUser = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthActions();
  const { isLoggedIn, client } = useAuth();

  const {
    data: userData,
    isLoading: isFetchingUser,
    isError,
    error,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await authService.currentuser(client.csub);
        console.log("Current user fetched:", response);
        return response?.data || null;
      } catch (err: any) {
        console.info("Current user fetch failed:", err);
        const status = err.statusCode;
        if (status === 401 || status === 403) {
          console.warn(`Auth error (${status}) fetching current user.`);
          // queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
        }
        throw err;
      }
    },
    refetchOnWindowFocus: true,
    enabled: client.csub !== null,
    staleTime: FIVE_MINUTES_IN_MS, // data is considered fresh for 5 minutes
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

  useEffect(() => {
    if (isSuccess) {
      setUser(userData);
    }
    if (isError) {
      // request failed
      const status = error.statusCode;
      if (status === 401 || status === 403) {
        console.log(
          `Sync: Clearing user in Zustand due to auth error (${status})`
        );
        setUser(null);
        queryClient.setQueryData(USER_QUERY_KEY, null);
      } else {
        console.log("Sync: Non-auth error fetching user:", error);
      }
    }
  }, [isSuccess, isError, userData, error, setUser, queryClient]);

  return {
    user: userData,
    isFetchingUser,
    isError,
    error,
    isLoggedIn,
    refreshUser: refetch,
  };
};
