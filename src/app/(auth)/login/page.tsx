"use client";
import React from "react";
import { useAuth } from "@store/auth.store";
import { useRouter } from "next/navigation";

import { useLoginLogic } from "./hook";
import { LoginView as Component } from "./view";

export default function Login() {
  const { push } = useRouter();
  const logic = useLoginLogic();
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return push("/dashboard");
  }

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
