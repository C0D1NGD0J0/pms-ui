"use client";

import { useEffect } from "react";
import { authService } from "@services/auth";
import { useQuery } from "@tanstack/react-query";
import { useAuthActions, useAuth } from "@store/hooks/useAuth";

/**
 * Hook for fetching and managing the current user
 * Handles fetching the user data with React Query and updating the auth store
 */
export const useCurrentUser = () => {
  const { setUser } = useAuthActions();
  const { isLoggedIn } = useAuth();
  const {
    data,
    isLoading: isFetchingUser,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await authService.currentuser();
      return response.data;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  const refreshUser = async () => {
    return await refetch();
  };

  return {
    user: data,
    isFetchingUser,
    isError,
    error,
    isLoggedIn,
    refreshUser,
  };
};
