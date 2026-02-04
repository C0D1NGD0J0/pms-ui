import Link from "next/link";
import { ChangeEvent } from "react";
import { ISignupForm } from "@interfaces/index";
import { UseFormReturnType } from "@mantine/form";
import { Button, Form } from "@components/FormElements";
import {
  ModernAuthLayout,
  AuthBrandPanel,
  AuthFormPanel,
} from "@components/AuthLayout";

import UserInfo from "./UserInfo";
import CompanyInfo from "./CompanyInfo";
import SubscriptionPlans from "./SubscriptionPlans";
import AccountTypeSelection from "./AccountTypeSelection";

interface RegisterViewProps {
  form: UseFormReturnType<ISignupForm, (values: ISignupForm) => ISignupForm>;
  isPending: boolean;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  accountType: "business" | "individual" | null;
  goToPlanSelection: () => void;
  goToAccountTypeSelection: () => void;
  handleSelectAccountType: (type: "business" | "individual") => void;
  handleOnChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    field?: keyof ISignupForm
  ) => void;
  handleSubmit: (values: ISignupForm) => void;
  selectedPlan: string | null;
  handleSelectPlan: (
    plan: "essential" | "growth" | "portfolio",
    pricingId: string | null,
    lookUpKey: string | null,
    billingInterval: "monthly" | "annual"
  ) => void;
  plansData: any;
  isLoadingPlans: boolean;
  isPlansError: boolean;
}

export function RegisterView({
  form,
  isPending,
  currentStep,
  nextStep,
  prevStep,
  goToPlanSelection,
  handleSelectAccountType,
  handleOnChange,
  handleSubmit,
  selectedPlan,
  handleSelectPlan,
  plansData,
  isLoadingPlans,
  isPlansError,
}: RegisterViewProps) {
  if (currentStep === 0) {
    return (
      <div className="register-plan-wrapper">
        <AccountTypeSelection onSelectAccountType={handleSelectAccountType} />
      </div>
    );
  }

  if (currentStep === 1) {
    return (
      <div className="register-plan-wrapper">
        <SubscriptionPlans
          onSelectPlan={handleSelectPlan}
          plansData={plansData}
          isLoadingPlans={isLoadingPlans}
          isPlansError={isPlansError}
        />
      </div>
    );
  }

  const renderButtons = (disable = false) => {
    const isBusinessAccount = form.values.accountType.isEnterpriseAccount;
    if (currentStep === 2 && isBusinessAccount) {
      return (
        <div className="btn-group">
          <Button
            label="Next"
            onClick={nextStep}
            iconPosition="right"
            className="btn-primary btn-block"
            icon={<i className="bx bx-right-arrow-circle"></i>}
          />
        </div>
      );
    } else if (currentStep === 3 && isBusinessAccount) {
      return (
        <div className="btn-group">
          <Button
            label="Back"
            onClick={prevStep}
            className="btn-outline btn-full"
            icon={<i className="bx bx-arrow-back"></i>}
          />
          <Button
            type="submit"
            iconPosition="right"
            disabled={disable || isPending}
            className="btn-primary btn-full"
            icon={<i className="bx bxs-user-account"></i>}
            label={isPending ? "Creating account..." : "Create Account"}
          />
        </div>
      );
    } else {
      return (
        <div className="btn-group">
          <Button
            type="submit"
            iconPosition="right"
            disabled={disable || isPending}
            className="btn-primary btn-block"
            icon={<i className="bx bxs-user-account "></i>}
            label={isPending ? "Creating account..." : "Create Account"}
          />
        </div>
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
                <span className="auth-brand-panel__stat-label">
                  Properties Managed
                </span>
              </div>
              <div className="auth-brand-panel__stat">
                <span className="auth-brand-panel__stat-value">$2B+</span>
                <span className="auth-brand-panel__stat-label">
                  Rent Collected
                </span>
              </div>
            </div>
          </AuthBrandPanel>
        }
      >
        <AuthFormPanel
          title={
            currentStep === 2 ? "Create Your Account" : "Company Information"
          }
          subtitle={
            selectedPlan
              ? `Selected Plan: ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}`
              : undefined
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
            {currentStep === 2 ? (
              <UserInfo
                formContext={form}
                onChange={handleOnChange}
                onChangePlan={goToPlanSelection}
                selectedPlan={selectedPlan}
              />
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
