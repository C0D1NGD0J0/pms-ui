"use client";
import React, { useMemo } from "react";
import { Loading } from "@components/Loading";

import { AppBootstrapProps } from "./types";

const DefaultFallback = () => (
  <Loading size="fullscreen" description="Initializing application..." />
);

export const AppBootstrap: React.FC<AppBootstrapProps> = ({
  children,
  initializerStates = [],
  fallback = <DefaultFallback />,
  enableDebug = false,
}) => {
  // memoize sorting only when states actually change
  const sortedStates = useMemo(
    () =>
      initializerStates.sort((a, b) => (a.priority || 0) - (b.priority || 0)),
    [initializerStates]
  );

  // check if all initializers are ready
  const isAppReady = sortedStates.every((state) => state.isReady);
  const isAnyLoading = sortedStates.some((state) => state.isLoading);
  const hasErrors = sortedStates.some((state) => state.error);

  if (enableDebug) {
    console.log("🚀 AppBootstrap Debug:", {
      isAppReady,
      isAnyLoading,
      hasErrors,
      initializers: initializerStates.map((state) => ({
        name: state.name,
        isReady: state.isReady,
        isLoading: state.isLoading,
        error: state.error,
      })),
    });
  }

  if (!isAppReady || isAnyLoading) {
    return fallback;
  }

  return <>{children}</>;
};
