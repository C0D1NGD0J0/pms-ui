import Link from "next/link";
import { UseFormReturnType } from "@mantine/form";
import { ILoginForm } from "@interfaces/auth.interface";
import { SelectClientAccountModal } from "@components/SelectClientAccountModal";
import {
  ModernAuthLayout,
  AuthBrandPanel,
  AuthFormPanel,
} from "@components/AuthLayout";
import {
  SocialLoginButtons,
  AuthIconInput,
  Checkbox,
  Button,
  Form,
} from "@components/FormElements/";

interface LoginViewProps {
  form: UseFormReturnType<ILoginForm>;
  isSubmitting: boolean;
  isModalOpen: boolean;
  userAccounts: Array<{ cuid: string; clientDisplayName: string }>;
  selectedClient: string;
  handleSubmit: (values: ILoginForm) => void;
  handleSelect: (cuid: string) => void;
  handleModalConfirm: () => void;
  toggleModal: (isOpen: boolean) => void;
}

export function LoginView({
  form,
  isModalOpen,
  userAccounts,
  selectedClient,
  handleSelect,
  handleModalConfirm,
  toggleModal,
  handleSubmit,
  isSubmitting,
}: LoginViewProps) {
  return (
    <>
      <ModernAuthLayout
        brandContent={
          <AuthBrandPanel>
            <i className="bx bx-buildings auth-brand-panel__icon"></i>
            <h1 className="auth-brand-panel__title">PropertyFlow</h1>
            <p className="auth-brand-panel__subtitle">
              Manage Your Properties With Confidence
            </p>
            <p
              style={{
                fontSize: "1.5rem",
                lineHeight: "1.6",
                opacity: "0.9",
                marginBottom: "3rem",
              }}
            >
              The all-in-one platform for landlords and property managers.
              Streamline rent collection, maintenance requests, and tenant
              communication.
            </p>
            <ul className="auth-brand-panel__features">
              <li className="auth-brand-panel__feature">
                <i className="bx bx-shield-alt-2"></i>
                <span>Secure online payments with instant notifications</span>
              </li>
              <li className="auth-brand-panel__feature">
                <i className="bx bx-wrench"></i>
                <span>Track maintenance requests in real-time</span>
              </li>
              <li className="auth-brand-panel__feature">
                <i className="bx bx-bar-chart-alt-2"></i>
                <span>Comprehensive reporting and analytics</span>
              </li>
              <li className="auth-brand-panel__feature">
                <i className="bx bx-user-check"></i>
                <span>Tenant screening and lease management</span>
              </li>
            </ul>
          </AuthBrandPanel>
        }
      >
        <AuthFormPanel
          title="Welcome Back"
          footer={
            <>
              Don&apos;t have an account?{" "}
              <Link href="/register">Sign up for free</Link>
            </>
          }
        >
          <Form
            onSubmit={form.onSubmit(handleSubmit)}
            id="login-form"
            disabled={isSubmitting}
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

            <AuthIconInput
              label="Password"
              type="password"
              icon="bx-lock-alt"
              placeholder="Enter your password"
              name="password"
              value={form.values.password || ""}
              onChange={(e) => form.setFieldValue("password", e.target.value)}
              error={
                form.isTouched("password")
                  ? (form.errors["password"] as string)
                  : undefined
              }
              autoComplete="current-password"
            />

            <div className="flex-row flex-between">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                label="Remember me"
                checked={form.values.rememberMe}
                onChange={(e) =>
                  form.setFieldValue("rememberMe", e.target.checked)
                }
              />
              <Link href="/forgot_password" className="btn-text">
                Forgot password?
              </Link>
            </div>
            <div className="btn-group">
              <Button
                type="submit"
                disabled={!form.isValid()}
                loading={isSubmitting}
                label="Sign In"
                loadingText="Signing in..."
                className="btn-primary btn-full"
              />
            </div>
          </Form>

          <SocialLoginButtons />
        </AuthFormPanel>
      </ModernAuthLayout>

      {isModalOpen && userAccounts.length > 0 && (
        <SelectClientAccountModal
          isOpen={isModalOpen}
          userAccounts={userAccounts}
          selectedClient={selectedClient}
          onSelect={handleSelect}
          onCancel={() => toggleModal(false)}
          onConfirm={handleModalConfirm}
        />
      )}
    </>
  );
}
