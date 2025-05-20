/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@store/auth.store";

import { useLoginLogic } from "./hook";
import { LoginView as Component } from "./view";

export default function Login() {
  const { push } = useRouter();
  const logic = useLoginLogic();
  const { isLoggedIn, isAuthLoading } = useAuth();

  useEffect(() => {
    if (isLoggedIn && !isAuthLoading) {
      push("/dashboard");
    }
  }, [isAuthLoading, isLoggedIn]);

  return (
    <Component
      form={logic.form}
      isSubmitting={logic.isSubmitting}
      isModalOpen={logic.isModalOpen}
      userAccounts={logic.userAccounts}
      selectedClient={logic.selectedClient}
      handleSubmit={logic.handleSubmit}
      handleSelect={logic.handleSelect}
      toggleModal={logic.toggleModal}
    />
  );
}
