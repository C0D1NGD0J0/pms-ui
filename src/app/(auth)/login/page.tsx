"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { authService } from "@services/auth";
import { errorFormatter } from "@utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { ILoginForm } from "@interfaces/auth.interface";
import { useNotification } from "@hooks/useNotification";
import { LoginSchema } from "@validations/auth.validations";
import {
  FormInput,
  FormField,
  Checkbox,
  Button,
  Form,
} from "@components/FormElements/";
import {
  AuthContentHeader,
  AuthContenFooter,
  AuthContentBody,
} from "@components/AuthLayout";

export default function Login() {
  const { openNotification } = useNotification();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ILoginForm) => authService.login(data),
  });

  const form = useForm<ILoginForm>({
    initialValues: {
      password: "",
      email: "",
      otpCode: "",
      rememberMe: false,
    },
    validateInputOnChange: true,
    validate: zodResolver(LoginSchema),
  });

  const handleSubmit = async (values: ILoginForm) => {
    try {
      const response = await mutateAsync(values);
      openNotification(
        "success",
        "Login",
        response.msg || "Password reset was successful."
      );
      form.reset();
    } catch (error: unknown) {
      openNotification("error", "Login process failed", errorFormatter(error));
    }
  };

  return (
    <>
      <AuthContentHeader
        title="Login"
        headerLink="/register"
        headerLinkText="Register."
        subtitle="Don't have an account?"
      />
      <AuthContentBody>
        <Form
          onSubmit={form.onSubmit(handleSubmit)}
          id="login-form"
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
                placeholder="Enter email..."
                value={form.values.email || ""}
                hasError={!!form.errors["email"]}
                onChange={(e) => form.setFieldValue("email", e.target.value)}
              />
            </FormField>
          </div>
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
            <FormField>
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                label="Remember me"
                checked={form.values.rememberMe}
                onChange={(e) =>
                  form.setFieldValue("rememberMe", e.target.checked)
                }
              />
            </FormField>
          </div>
          <div className="action-fields">
            <Button
              type="submit"
              disabled={!form.isValid()}
              className="btn btn-primary"
              label={`${isPending ? "Processing..." : "Login"}`}
            />
          </div>
        </Form>
      </AuthContentBody>
      <AuthContenFooter
        footerLink="/forgot_password"
        footerLinkText="Forgot your password?"
      />
    </>
  );
}
