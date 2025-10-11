"use client";
import React from "react";

import { AccountActivationView } from "./view";
import { useAccountActivationLogic } from "./hook/useAccountActivationLogic";

interface AccountActivationProps {
  params: Promise<{ cuid: string }>;
}

export default function AccountActivation({ params }: AccountActivationProps) {
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
  } = useAccountActivationLogic({ params });

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
