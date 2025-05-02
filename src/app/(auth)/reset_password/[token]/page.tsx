"use client";
import React from "react";

import { ResetPasswordView } from "./view";
import { useResetPasswordLogic } from "./hook/useResetPasswordLogic";

export default function ResetPassword() {
  const { form, isPending, handleSubmit, token } = useResetPasswordLogic();

  return (
    <ResetPasswordView
      form={form}
      isPending={isPending}
      handleSubmit={handleSubmit}
      token={token}
    />
  );
}
