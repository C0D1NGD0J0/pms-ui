"use client";
import React from "react";

import { ResetPasswordView } from "./view";
import { useResetPasswordLogic } from "./hook/useResetPasswordLogic";

interface ResetPasswordProps {
  params: Promise<{ token: string }>;
}

export default function ResetPassword({ params }: ResetPasswordProps) {
  const { form, isPending, handleSubmit, token } = useResetPasswordLogic({
    params,
  });

  return (
    <ResetPasswordView
      form={form}
      isPending={isPending}
      handleSubmit={handleSubmit}
      token={token}
    />
  );
}
