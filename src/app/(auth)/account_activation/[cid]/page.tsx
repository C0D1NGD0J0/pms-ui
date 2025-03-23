"use client";
import {
  AuthContentHeader,
  AuthContenFooter,
  AuthContentBody,
} from "@components/AuthLayout";
import {
  FormLabel,
  FormInput,
  FormField,
  Button,
  Form,
} from "@components/FormElements/";
import { AccountActivationSchema } from "@validations/auth.validations";
import { IAccountActivationForm } from "@interfaces/auth.interface";
import { useSearchParams, useParams } from "next/navigation";
import { useNotification } from "@hooks/useNotification";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { errorFormatter } from "@utils/helpers";
import { Loading } from "@components/UI/index";
import { authService } from "@services/auth";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import { Popover, Result } from "antd";
import Link from "next/link";

export default function AccountActivation() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openNotification } = useNotification();
  const [emailError, setEmailError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showResendActivation, setShowResendActivation] = useState(false);
  const [email, setEmail] = useState("");
  const token = searchParams.get("t");
  const cid = params.cid as string;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (
      values: IAccountActivationForm & { type: string; email: string }
    ) => {
      if (values.type === "resendCode") {
        return authService.resendActivationLink(values.email);
      } else if (values.type === "verifyCode") {
        return authService.accountActivation(cid, values);
      }
      throw new Error("Unknown mutation type");
    },
  });

  const form = useForm<IAccountActivationForm>({
    initialValues: {
      token: "",
      cid: cid,
    },
    validateInputOnChange: true,
    validate: zodResolver(AccountActivationSchema),
  });

  useEffect(() => {
    if (token) {
      form.setFieldValue("token", token);
    }
  }, [token]);

  const handleResendActivation = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return;
    }

    setEmailError("");
    try {
      await mutateAsync({ type: "resendCode", cid, token: "", email });
      openNotification(
        "success",
        "Activation Link Sent",
        "A new activation link has been sent to your email."
      );
      setIsPopoverOpen(false);
      setShowResendActivation(false);
      router.push("/account_activation");
    } catch (error: any) {
      openNotification("error", "Request Failed", errorFormatter(error));
    }
  };

  const handleSubmit = async (values: IAccountActivationForm) => {
    try {
      const response = await mutateAsync({
        type: "verifyCode",
        cid,
        token: values.token,
        email: "",
      });
      openNotification(
        "success",
        "Account Activated",
        response.msg || "Your account has been successfully activated."
      );
      setIsSuccess(true);
      router.push("/login");
    } catch (error: unknown) {
      openNotification("error", "Activation Failed", errorFormatter(error));
      setShowResendActivation(true); // this will show the resend activation link
    }
  };

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
          title="Contratulation, account has now been activated. Please login to proceed."
          extra={[
            <Link key="login" href="/login" className="btn btn-primary">
              Login
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
          <AuthContenFooter
            footerLink="/"
            footerLinkText="Privacy & Terms of Service"
            footerText="By continuing, you agree to accept our"
          />
        </>
      )}
    </>
  );
}
