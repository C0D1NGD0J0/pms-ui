import { Loading } from "@components/Loading";
import { UseFormReturnType } from "@mantine/form";
import { IResetPasswordForm } from "@interfaces/auth.interface";
import { FormInput, FormField, Button, Form } from "@components/FormElements/";
import {
  AuthContentHeader,
  AuthContentFooter,
  AuthContentBody,
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
      <AuthContentFooter
        footerLink="/login"
        footerLinkText="Already have an account? Log in"
      />
    </>
  );
}
