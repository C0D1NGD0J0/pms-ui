import Link from "next/link";
import { Popover } from "antd";
import { Loading } from "@components/Loading";
import { UseFormReturnType } from "@mantine/form";
import { IAccountActivationForm } from "@interfaces/auth.interface";
import { AuthIconInput, Button, Form } from "@components/FormElements/";
import {
  ModernAuthLayout,
  AuthBrandPanel,
  AuthFormPanel,
} from "@components/AuthLayout";

interface AccountActivationViewProps {
  form: UseFormReturnType<IAccountActivationForm>;
  isPending: boolean;
  handleSubmit: (values: IAccountActivationForm) => void;
  token: string | null;
  email: string;
  setEmail: (email: string) => void;
  emailError: string;
  isSuccess: boolean;
  isPopoverOpen: boolean;
  setIsPopoverOpen: (isOpen: boolean) => void;
  showResendActivation: boolean;
  handleResendActivation: () => void;
  setEmailError: (error: string) => void;
}

export function AccountActivationView({
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
}: AccountActivationViewProps) {
  const renderResendActivationPopover = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <Popover
          content={
            <div style={{ width: "300px", padding: "2rem" }}>
              <p style={{ marginBottom: "1rem" }}>
                Enter the email address you used for registration:
              </p>
              <div style={{ margin: "10px 0" }}>
                <AuthIconInput
                  name="resendEmail"
                  type="email"
                  icon="bx-envelope"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  autoComplete="email"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  label="Cancel"
                  className="btn btn-outline"
                  onClick={() => {
                    setIsPopoverOpen(false);
                    setEmailError("");
                    setEmail("");
                  }}
                  type="button"
                />
                <Button
                  label={"Send"}
                  className="btn btn-primary"
                  onClick={handleResendActivation}
                  type="button"
                  disabled={false}
                />
              </div>
            </div>
          }
          title={null}
          trigger="click"
          open={isPopoverOpen}
          onOpenChange={() => {
            setIsPopoverOpen(!isPopoverOpen);
            setEmailError("");
          }}
        >
          <span
            className="link-text"
            style={{
              cursor: "pointer",
              marginBottom: "15px",
              display: "inline-block",
            }}
          >
            Request new code
          </span>
        </Popover>
      </div>
    );
  };

  if (!token) {
    return <Loading description="Broken url..." />;
  }

  return (
    <ModernAuthLayout
      brandContent={
        <AuthBrandPanel>
          <i className="bx bx-shield-check auth-brand-panel__icon"></i>
          <h1 className="auth-brand-panel__title">Verify Your Account</h1>
          <p className="auth-brand-panel__subtitle">
            Complete your registration to access all features
          </p>
        </AuthBrandPanel>
      }
    >
      <AuthFormPanel>
        {isSuccess ? (
          <div className="auth-success-panel">
            <i className="bx bx-check-circle success-icon"></i>
            <h2>Account Activated!</h2>
            <p>
              Congratulations, your account has been activated. You can now log
              in to your account.
            </p>
            <div className="btn-group">
              <Link href="/login" className="btn btn-primary">
                Login to your account
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="auth-form-panel__header">
              <h2 className="auth-form-panel__title">Account Verification</h2>
              <p className="auth-form-panel__subtitle">
                Enter the verification code sent to your email
              </p>
            </div>

            <Form
              onSubmit={form.onSubmit(handleSubmit)}
              id="verification-form"
              disabled={isPending}
              autoComplete="off"
            >
              <AuthIconInput
                label="Verification Code"
                type="text"
                icon="bx-key"
                placeholder="Enter verification code"
                name="token"
                value={form.values.token || ""}
                onChange={(e) => form.setFieldValue("token", e.target.value)}
                error={form.errors.token ? String(form.errors.token) : ""}
              />
              <div className="btn-group">
                <Button
                  label={isPending ? "Verifying..." : "Confirm code"}
                  className="btn btn-primary btn-full"
                  type="submit"
                  disabled={!form.isValid() || isPending}
                  loading={isPending}
                />
              </div>

              {showResendActivation && (
                <div style={{ marginTop: "1rem" }}>
                  {renderResendActivationPopover()}
                </div>
              )}
            </Form>

            <div className="auth-form-panel__footer">
              <p>
                By continuing, you agree to our{" "}
                <Link href="/">Privacy & Terms of Service</Link>
              </p>
            </div>
          </>
        )}
      </AuthFormPanel>
    </ModernAuthLayout>
  );
}
