import { UseFormReturnType } from "@mantine/form";
import { AuthContentBody } from "@components/AuthLayout";
import { AuthContentHeader } from "@components/AuthLayout";
import { AuthContentFooter } from "@components/AuthLayout";
import { FormInput, FormField, Button, Form } from "@components/FormElements/";

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
      <AuthContentFooter footerLink="/login" footerLinkText="login" />
    </>
  );
}
