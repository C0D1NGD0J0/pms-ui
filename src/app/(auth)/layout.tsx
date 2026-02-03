"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { useLoadingManager } from "@hooks/useLoadingManager";

const AuthPageLayout = ({ children }: { children: React.ReactNode }) => {
  const { push } = useRouter();
  const { setInitializing, isLoading, loadingMessage } = useLoadingManager();
  const { isLoggedIn, isLoading: isAuthLoading } = useCurrentUser();

  useEffect(() => {
    setInitializing(true);
  }, [setInitializing]);

  useEffect(() => {
    if (isLoggedIn && !isAuthLoading) {
      setInitializing(false);
      push("/dashboard");
    }

    if (!isLoggedIn && !isAuthLoading) {
      setInitializing(false);
    }
  }, [isLoggedIn, isAuthLoading, setInitializing, push]);

  if (isLoading || isLoggedIn) {
    return <Loading description={loadingMessage} size="fullscreen" />;
  }

  return <>{children}</>;
};

export default AuthPageLayout;
