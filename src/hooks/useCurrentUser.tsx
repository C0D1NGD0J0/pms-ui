"use client";

import { useEffect } from "react";
import { authService } from "@services/auth";
import { useAuthActions, useAuth } from "@store/hooks/useAuth";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
const USER_QUERY_KEY = ["currentUser"];

export const useCurrentUser = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthActions();
  const { isLoggedIn } = useAuth();

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
        const response = await authService.currentuser();
        return response.data || null;
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
    enabled: true,
    refetchOnWindowFocus: true,
    staleTime: FIVE_MINUTES_IN_MS, // data is considered fresh for 5 minutes
    retry: (
      failureCount,
      error: { success: boolean; message: string; statusCode: number }
    ) => {
      const status = error.statusCode;
      // DO NOT retry if the error is 401 (Unauthorized) or 403 (Forbidden)
      if (status === 401 || status === 403) {
        console.log("na 401 error oh----");
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
