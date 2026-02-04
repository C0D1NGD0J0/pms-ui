import Link from "next/link";
import { UseFormReturnType } from "@mantine/form";
import { AuthIconInput, Form } from "@components/FormElements/";
import {
  ModernAuthLayout,
  AuthBrandPanel,
  AuthFormPanel,
} from "@components/AuthLayout";

import { ForgotPasswordForm } from "../hook/useForgotPasswordLogic";

interface ForgotPasswordViewProps {
  form: UseFormReturnType<ForgotPasswordForm>;
  isPending: boolean;
  handleSubmit: (values: ForgotPasswordForm) => void;
}

export function ForgotPasswordView({
  form,
  isPending,
  handleSubmit,
}: ForgotPasswordViewProps) {
  return (
    <>
      <ModernAuthLayout
        brandContent={
          <AuthBrandPanel>
            <i className="bx bx-lock-open auth-brand-panel__icon"></i>
            <h1 className="auth-brand-panel__title">Reset Your Password</h1>
            <p className="auth-brand-panel__subtitle">
              Don&apos;t worry, it happens to everyone
            </p>
            <p
              style={{
                fontSize: "1.5rem",
                lineHeight: "1.6",
                opacity: "0.9",
                marginTop: "2rem",
              }}
            >
              Enter your email address and we&apos;ll send you instructions to
              reset your password.
            </p>
          </AuthBrandPanel>
        }
      >
        <AuthFormPanel
          title="Forgot Password?"
          footer={
            <>
              Remember your password? <Link href="/login">Sign in</Link>
            </>
          }
        >
          <Form
            onSubmit={form.onSubmit(handleSubmit)}
            id="forgotPwd-form"
            disabled={isPending}
            autoComplete="off"
          >
            <AuthIconInput
              label="Email Address"
              type="email"
              icon="bx-envelope"
              placeholder="Enter your email"
              name="email"
              value={form.values.email || ""}
              onChange={(e) => form.setFieldValue("email", e.target.value)}
              error={
                form.isTouched("email")
                  ? (form.errors["email"] as string)
                  : undefined
              }
              autoComplete="email"
            />

            <button
              type="submit"
              disabled={!form.isValid() || isPending}
              className="auth-button"
            >
              {isPending ? "Sending..." : "Send Reset Link"}
            </button>
          </Form>
        </AuthFormPanel>
      </ModernAuthLayout>
    </>
  );
}
