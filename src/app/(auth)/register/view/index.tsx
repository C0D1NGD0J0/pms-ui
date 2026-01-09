import Link from "next/link";
import { ChangeEvent } from "react";
import { ISignupForm } from "@interfaces/index";
import { Form } from "@components/FormElements";
import { UseFormReturnType } from "@mantine/form";
import {
  ModernAuthLayout,
  AuthBrandPanel,
  AuthFormPanel,
} from "@components/AuthLayout";

import UserInfo from "./UserInfo";
import CompanyInfo from "./CompanyInfo";

interface RegisterViewProps {
  form: UseFormReturnType<ISignupForm, (values: ISignupForm) => ISignupForm>;
  isPending: boolean;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  handleOnChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    field?: keyof ISignupForm
  ) => void;
  handleSubmit: (values: ISignupForm) => void;
}

export function RegisterView({
  form,
  isPending,
  currentStep,
  nextStep,
  prevStep,
  handleOnChange,
  handleSubmit,
}: RegisterViewProps) {
  const renderButtons = (disable = false) => {
    const isBusnessAccount = form.values.accountType.isCorporate;
    if (currentStep === 0 && isBusnessAccount) {
      return (
        <button type="button" className="auth-button" onClick={nextStep}>
          Next
        </button>
      );
    } else if (currentStep === 1 && isBusnessAccount) {
      return (
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="button"
            className="auth-button"
            onClick={prevStep}
            style={{
              background: "transparent",
              border: "2px solid var(--primary-color)",
              color: "var(--primary-color)",
            }}
          >
            Back
          </button>
          <button
            type="submit"
            className="auth-button"
            disabled={disable || isPending}
          >
            {isPending ? "Creating account..." : "Create Account"}
          </button>
        </div>
      );
    } else {
      return (
        <button
          type="submit"
          className="auth-button"
          disabled={disable || isPending}
        >
          {isPending ? "Creating account..." : "Create Account"}
        </button>
      );
    }
  };

  return (
    <>
      <ModernAuthLayout
        brandContent={
          <AuthBrandPanel>
            <i className="bx bx-buildings auth-brand-panel__icon"></i>
            <h1 className="auth-brand-panel__title">Join PropertyFlow</h1>
            <p className="auth-brand-panel__subtitle">
              Start Managing Your Properties Today
            </p>
            <div className="auth-brand-panel__stats">
              <div className="auth-brand-panel__stat">
                <span className="auth-brand-panel__stat-value">10K+</span>
                <span className="auth-brand-panel__stat-label">
                  Active Users
                </span>
              </div>
              <div className="auth-brand-panel__stat">
                <span className="auth-brand-panel__stat-value">50K+</span>
                <span className="auth-brand-panel__stat-label">Properties</span>
              </div>
              <div className="auth-brand-panel__stat">
                <span className="auth-brand-panel__stat-value">$2B+</span>
                <span className="auth-brand-panel__stat-label">
                  Rent Managed
                </span>
              </div>
            </div>
          </AuthBrandPanel>
        }
      >
        <AuthFormPanel
          title={
            currentStep === 0 ? "Create Your Account" : "Company Information"
          }
          footer={
            <>
              Already have an account? <Link href="/login">Sign in</Link>
            </>
          }
        >
          <Form
            onSubmit={form.onSubmit(handleSubmit)}
            id="auth-form"
            disabled={isPending}
            autoComplete="off"
          >
            {currentStep === 0 ? (
              <UserInfo formContext={form} onChange={handleOnChange} />
            ) : (
              <CompanyInfo formContext={form} onChange={handleOnChange} />
            )}
            {renderButtons(!form.isValid())}
          </Form>
        </AuthFormPanel>
      </ModernAuthLayout>
    </>
  );
}
