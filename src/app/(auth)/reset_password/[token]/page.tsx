"use client";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { authService } from "@services/auth";
import { Loading } from "@components/Loading";
import { errorFormatter } from "@utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
import { IResetPasswordForm } from "@interfaces/auth.interface";
import { ResetPasswordSchema } from "@validations/auth.validations";
import { FormInput, FormField, Button, Form } from "@components/FormElements/";
import {
  AuthContentHeader,
  AuthContenFooter,
  AuthContentBody,
} from "@components/AuthLayout";

export default function ResetPassword() {
  const params = useParams();
  const token = params.token as string;
  const { openNotification } = useNotification();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IResetPasswordForm) =>
      authService.resetPassword(data.token, data.password),
  });

  useEffect(() => {
    if (token) {
      form.setFieldValue("token", token);
    }
  }, [token]);

  const form = useForm<IResetPasswordForm>({
    initialValues: {
      password: "",
      cpassword: "",
      token: "",
    },
    validateInputOnChange: true,
    validate: zodResolver(ResetPasswordSchema),
  });

  const handleSubmit = async (values: IResetPasswordForm) => {
    try {
      const response = await mutateAsync(values);
      openNotification(
        "success",
        "Password reset",
        response.msg || "Password reset was successful."
      );
      form.reset();
    } catch (error: unknown) {
      openNotification(
        "error",
        "Password reset process failed",
        errorFormatter(error)
      );
    }
  };

  if (!token) {
    return <Loading description="Broken url..." />;
  }

  return (
    <>
      <AuthContentHeader
        title="Reset your password"
        subtitle="It happens to the best of us, enter your new password."
      />
      <AuthContentBody>
        <Form
          onSubmit={form.onSubmit(handleSubmit)}
          id="resetPwd-form"
          className="auth-form"
          disabled={isPending}
          autoComplete="off"
        >
          {form.errors["token"] && (
            <p className="error-msg pb-2">{form.errors["token"]}</p>
          )}
          <div className="form-fields">
            <FormField
              error={{
                msg: (form.errors["password"] as string) || "",
                touched: form.isTouched("password"),
              }}
            >
              <FormInput
                required
                name="password"
                type="password"
                id="password"
                value={form.values.password || ""}
                hasError={!!form.errors["password"]}
                placeholder="New password..."
                onChange={(e) => form.setFieldValue("password", e.target.value)}
              />
            </FormField>
          </div>
          <div className="form-fields">
            <FormField
              error={{
                msg: (form.errors["cpassword"] as string) || "",
                touched: form.isTouched("cpassword"),
              }}
            >
              <FormInput
                required
                name="cpassword"
                type="password"
                id="cpassword"
                placeholder="Confirm password..."
                value={form.values.cpassword || ""}
                hasError={!!form.errors["cpassword"]}
                onChange={(e) =>
                  form.setFieldValue("cpassword", e.target.value)
                }
              />
            </FormField>
          </div>
          <div className="action-fields">
            <Button
              type="submit"
              disabled={!form.isValid()}
              className="btn btn-primary"
              label={`${isPending ? "Processing..." : "Reset Password"}`}
            />
          </div>
        </Form>
      </AuthContentBody>
      <AuthContenFooter footerLink="/login" footerLinkText="Login" />
    </>
  );
}
