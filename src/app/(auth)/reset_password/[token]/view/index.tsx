import Link from "next/link";
import { Loading } from "@components/Loading";
import { UseFormReturnType } from "@mantine/form";
import { IResetPasswordForm } from "@interfaces/auth.interface";
import {
  PasswordRequirements,
  AuthIconInput,
  Form,
} from "@components/FormElements/";
import {
  ModernAuthLayout,
  AuthBrandPanel,
  AuthFormPanel,
} from "@components/AuthLayout";

interface ResetPasswordViewProps {
  form: UseFormReturnType<IResetPasswordForm>;
  isPending: boolean;
  handleSubmit: (values: IResetPasswordForm) => void;
  token: string;
}

export function ResetPasswordView({
  form,
  isPending,
  handleSubmit,
  token,
}: ResetPasswordViewProps) {
  if (!token) {
    return <Loading description="Broken url..." />;
  }

  return (
    <>
      <ModernAuthLayout
        brandContent={
          <AuthBrandPanel>
            <i className="bx bx-shield-alt-2 auth-brand-panel__icon"></i>
            <h1 className="auth-brand-panel__title">Create New Password</h1>
            <p className="auth-brand-panel__subtitle">
              Secure your account with a strong password
            </p>
            <ul className="auth-brand-panel__features">
              <li className="auth-brand-panel__feature">
                <i className="bx bx-check-circle"></i>
                <span>At least 8 characters long</span>
              </li>
              <li className="auth-brand-panel__feature">
                <i className="bx bx-check-circle"></i>
                <span>Include uppercase and lowercase letters</span>
              </li>
              <li className="auth-brand-panel__feature">
                <i className="bx bx-check-circle"></i>
                <span>Add numbers for extra security</span>
              </li>
            </ul>
          </AuthBrandPanel>
        }
      >
        <AuthFormPanel
          title="Reset Your Password"
          footer={
            <>
              Remember your password? <Link href="/login">Sign in</Link>
            </>
          }
        >
          <Form
            onSubmit={form.onSubmit(handleSubmit)}
            id="resetPwd-form"
            disabled={isPending}
            autoComplete="off"
          >
            {form.errors["token"] && (
              <p
                style={{
                  color: "var(--danger-color)",
                  marginBottom: "1.5rem",
                  fontSize: "1.4rem",
                }}
              >
                {form.errors["token"]}
              </p>
            )}

            <AuthIconInput
              label="New Password"
              type="password"
              icon="bx-lock-alt"
              placeholder="Create new password"
              name="password"
              value={form.values.password || ""}
              onChange={(e) => form.setFieldValue("password", e.target.value)}
              error={
                form.isTouched("password")
                  ? (form.errors["password"] as string)
                  : undefined
              }
              autoComplete="new-password"
            />

            <AuthIconInput
              label="Confirm Password"
              type="password"
              icon="bx-lock-alt"
              placeholder="Confirm new password"
              name="cpassword"
              value={form.values.cpassword || ""}
              onChange={(e) => form.setFieldValue("cpassword", e.target.value)}
              error={
                form.isTouched("cpassword")
                  ? (form.errors["cpassword"] as string)
                  : undefined
              }
              autoComplete="new-password"
            />

            <PasswordRequirements
              password={form.values.password}
              confirmPassword={form.values.cpassword}
            />

            <button
              type="submit"
              disabled={!form.isValid() || isPending}
              className="auth-button"
              style={{ marginTop: "1rem" }}
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </button>
          </Form>
        </AuthFormPanel>
      </ModernAuthLayout>
    </>
  );
}
