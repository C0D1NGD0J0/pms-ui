"use client";

import React, { useEffect } from "react";
import { useAuth } from "@store/auth.store";
import { Loading } from "@components/Loading";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { usePathname, useRouter } from "next/navigation";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication provider component that:
 * 1. Fetches current user data when needed
 * 2. Redirects unauthenticated users away from protected routes
 * 3. Redirects authenticated users away from auth routes
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const { isFetchingUser, isError } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

  // Define route patterns
  const isAuthRoute =
    pathname.startsWith("/(auth)") ||
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/forgot_password");
  const isProtectedRoute =
    pathname.startsWith("/(protectedRoutes)") ||
    pathname.includes("/dashboard");

  useEffect(() => {
    // Redirect logic
    if (!isFetchingUser) {
      // If user is logged in but tries to access auth routes, redirect to dashboard
      if (isLoggedIn && isAuthRoute) {
        router.replace("/dashboard");
      }

      // If user is not logged in but tries to access protected routes, redirect to login
      if (!isLoggedIn && isProtectedRoute) {
        router.replace("/login");
      }
    }
  }, [isLoggedIn, isFetchingUser, isAuthRoute, isProtectedRoute, router]);

  // Show loading state while determining auth status
  if (isFetchingUser && isProtectedRoute) {
    return (
      <Loading
        size="fullscreen"
        description="Loading your account..."
        showLogo={true}
      />
    );
  }

  // If there's an error fetching user data and user is trying to access protected routes
  if (isError && isProtectedRoute) {
    router.replace("/login");
    return (
      <Loading
        size="fullscreen"
        description="Error loading your account data"
        showLogo={true}
      />
    );
  }

  return <>{children}</>;
};
