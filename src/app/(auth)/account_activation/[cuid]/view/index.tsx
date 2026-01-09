import Link from "next/link";
import { Popover, Result } from "antd";
import { Loading } from "@components/Loading";
import { UseFormReturnType } from "@mantine/form";
import { IAccountActivationForm } from "@interfaces/auth.interface";
import {
  FormLabel,
  FormInput,
  FormField,
  Button,
  Form,
} from "@components/FormElements/";
import {
  AuthContentHeader,
  AuthContentFooter,
  AuthContentBody,
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
              <p>Enter the email address you used for registration:</p>
              <div style={{ margin: "10px 0" }}>
                <FormInput
                  name="resendEmail"
                  id="resendEmail"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  hasError={!!emailError}
                />
                {emailError && (
                  <small className="form-field-error">
                    <i>{emailError}</i>
                  </small>
                )}
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
    <>
      {isSuccess ? (
        <Result
          status="success"
          title="Congratulations, account has now been activated. Complete your registration to continue."
          extra={[
            <Link key="register" href="/register" className="btn btn-primary">
              Complete Registration
            </Link>,
          ]}
        />
      ) : (
        <>
          <AuthContentHeader
            title="Account verification"
            subtitle="Complete registration by verifying your account"
          />
          <AuthContentBody>
            <Form
              onSubmit={form.onSubmit(handleSubmit)}
              id="verification-form"
              className="auth-form"
              disabled={isPending}
              autoComplete="off"
            >
              <div className="form-fields">
                <FormField
                  error={{
                    msg: form.errors.token ? String(form.errors.token) : "",
                    touched: form.isTouched("token"),
                  }}
                >
                  <FormLabel htmlFor="token" label="Verification code" />
                  <FormInput
                    required
                    name="token"
                    id="token"
                    onChange={(e) =>
                      form.setFieldValue("token", e.target.value)
                    }
                    hasError={!!form.errors["token"]}
                    value={form.values.token || ""}
                  />
                </FormField>
              </div>
              <div className="action-fields">
                <Button
                  label={`${isPending ? "Processing..." : "Confirm"}`}
                  className="btn btn-primary"
                  type="submit"
                  disabled={!form.isValid()}
                />
              </div>
              {showResendActivation && renderResendActivationPopover()}
            </Form>
          </AuthContentBody>
          <AuthContentFooter
            footerLink="/"
            footerLinkText="Privacy & Terms of Service"
            footerText="By continuing, you agree to accept our"
          />
        </>
      )}
    </>
  );
}
