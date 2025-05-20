"use client";
import React from "react";

import { AccountActivationView } from "./view";
import { useAccountActivationLogic } from "./hook/useAccountActivationLogic";

export default function AccountActivation() {
  const {
    form,
    isPending,
    handleSubmit,
    token,
    email,
    setEmail,
    emailError,
    isSuccess,
    isPopoverOpen,
    setIsPopoverOpen,
    showResendActivation,
    handleResendActivation,
    setEmailError,
  } = useAccountActivationLogic();

  return (
    <AccountActivationView
      form={form}
      isPending={isPending}
      handleSubmit={handleSubmit}
      token={token}
      email={email}
      setEmail={setEmail}
      emailError={emailError}
      isSuccess={isSuccess}
      isPopoverOpen={isPopoverOpen}
      setIsPopoverOpen={setIsPopoverOpen}
      showResendActivation={showResendActivation}
      handleResendActivation={handleResendActivation}
      setEmailError={setEmailError}
    />
  );
}
