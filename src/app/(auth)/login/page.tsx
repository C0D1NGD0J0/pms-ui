"use client";
import React from "react";

import { useLoginLogic } from "./hook";
import { LoginView as Component } from "./view";

export default function Login() {
  const logic = useLoginLogic();

  return (
    <Component
      form={logic.form}
      isSubmitting={logic.isSubmitting}
      isModalOpen={logic.isModalOpen}
      userAccounts={logic.userAccounts}
      selectedClient={logic.selectedClient}
      handleSubmit={logic.handleSubmit}
      handleSelect={logic.handleSelect}
      handleModalConfirm={logic.handleModalConfirm}
      toggleModal={logic.toggleModal}
    />
  );
}
