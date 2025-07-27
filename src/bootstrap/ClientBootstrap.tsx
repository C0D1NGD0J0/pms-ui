"use client";
import React from "react";

import { AppBootstrap } from "./AppBootstrap";

interface ClientBootstrapProps {
  children: React.ReactNode;
  enableDebug?: boolean;
}

export const ClientBootstrap: React.FC<ClientBootstrapProps> = ({
  children,
  enableDebug = false,
}) => {
  return (
    <AppBootstrap initializerStates={[]} enableDebug={enableDebug}>
      {children}
    </AppBootstrap>
  );
};
