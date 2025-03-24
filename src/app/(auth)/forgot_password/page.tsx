"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { authService } from "@services/auth";
import { errorFormatter } from "@utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
import { ForgotPasswordSchema } from "@validations/auth.validations";
import { FormInput, FormField, Button, Form } from "@components/FormElements/";
import {
  AuthContentHeader,
  AuthContenFooter,
  AuthContentBody,
} from "@components/AuthLayout";

export default function ForgotPassword() {
  const { openNotification } = useNotification();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.forgotPassword,
  });

  const form = useForm<{ email: string }>({
    initialValues: {
      email: "",
    },
    validateInputOnChange: true,
    validate: zodResolver(ForgotPasswordSchema),
  });

  const handleSubmit = async (values: { email: string }) => {
    try {
      const response = await mutateAsync(values.email);
      openNotification(
        "success",
        "Forgot password",
        response.msg || "Password reset link has been sent to your inbox."
      );
      form.reset();
    } catch (error: unknown) {
      openNotification(
        "error",
        "Forgot password process failed",
        errorFormatter(error)
      );
    }
  };

  return (
    <>
      <AuthContentHeader
        title="Forgot password?"
        subtitle="It happens to the best of us. Just enter your email address."
      />
      <AuthContentBody>
        <Form
          onSubmit={form.onSubmit(handleSubmit)}
          id="forgotPwd-form"
          className="auth-form"
          disabled={isPending}
          autoComplete="off"
        >
          <div className="form-fields">
            <FormField
              error={{
                msg: (form.errors["email"] as string) || "",
                touched: form.isTouched("email"),
              }}
            >
              <FormInput
                required
                name="email"
                type="email"
                id="email"
                value={form.values.email || ""}
                hasError={!!form.errors["email"]}
                placeholder="Enter your email address..."
                onChange={(e) => form.setFieldValue("email", e.target.value)}
              />
            </FormField>
          </div>
          <div className="action-fields">
            <Button
              type="submit"
              disabled={!form.isValid()}
              className="btn btn-primary"
              label={`${isPending ? "Processing..." : "Send reset link"}`}
            />
          </div>
        </Form>
      </AuthContentBody>
      <AuthContenFooter
        footerLink="/"
        footerLinkText="Privacy & Terms of Service"
        footerText="By continuing, you agree to accept our"
      />
    </>
  );
}
