"use client";
import React from "react";

import { ForgotPasswordView } from "./view";
import { useForgotPasswordLogic } from "./hook/useForgotPasswordLogic";

export default function ForgotPassword() {
  const { form, isPending, handleSubmit } = useForgotPasswordLogic();

  return (
    <ForgotPasswordView
      form={form}
      isPending={isPending}
      handleSubmit={handleSubmit}
    />
  );
}
