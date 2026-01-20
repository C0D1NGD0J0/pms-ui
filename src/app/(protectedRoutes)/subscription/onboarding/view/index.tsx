"use client";
import React from "react";
import storage from "@utils/storage";
import { Icon } from "@components/Icon";
import { useRouter } from "next/navigation";
import { Banner } from "@components/Banner";
import { Loading } from "@components/Loading";
import { Button } from "@components/FormElements";
import { EmptyState } from "@components/EmptyState";
import { ISubscriptionPlan } from "@interfaces/subscription.interface";

interface OnboardingViewProps {
  user: any;
  selectedPlan: ISubscriptionPlan | null;
  plansData?: ISubscriptionPlan[];
  isLoadingPlans: boolean;
  isPlansError: boolean;
  countdown: string;
  handleCheckout: () => void;
  isCheckingOut: boolean;
  onPlanChange: (planName: string) => void;
}

const PREMIUM_FEATURES = [
  "Unlimited properties",
  "Advanced reporting",
  "Priority support",
];

const SUMMARY_ROWS = [{ label: "Tax", value: "Calculated at checkout" }];

export function OnboardingView({
  user,
  selectedPlan,
  plansData,
  isLoadingPlans,
  isPlansError,
  countdown,
  handleCheckout,
  isCheckingOut,
  onPlanChange,
}: OnboardingViewProps) {
  const router = useRouter();

  if (isLoadingPlans) {
    return <Loading description="Loading subscription details..." />;
  }

  if (isPlansError) {
    return (
      <EmptyState
        type="error"
        title="Error Loading Subscription"
        description="We couldn't load your subscription details. Please try again later."
      />
    );
  }

  const planName = user?.subscription?.plan?.name || "Starter";
  const billingInterval =
    user?.subscription?.plan?.billingInterval || "monthly";
  const displayPlanName =
    selectedPlan?.name || planName.charAt(0).toUpperCase() + planName.slice(1);
  const displayPrice = selectedPlan?.pricing.monthly.displayPrice || "$79";
  const billingPeriod = billingInterval === "annual" ? "year" : "month";
  const billingCycle = billingInterval === "annual" ? "Annual" : "Monthly";

  const handleClose = () => {
    storage.set("onboarding_dismissed", true);
    router.push("/dashboard");
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container">
        <Button
          onClick={handleClose}
          label=""
          className="onboarding-close-btn"
          aria-label="Close"
          title="I'll pay later"
          icon={<Icon name="bx-x" />}
        />

        <Banner
          type="warning"
          title="Complete Your Payment to Unlock Full Access"
          description={
            <div className="onboarding-countdown">
              <Icon name="bx-timer" />
              <span>
                Trial expires in: <strong>{countdown}</strong>
              </span>
            </div>
          }
          icon="bx-time-five"
          className="onboarding-banner"
        />

        <div className="onboarding-content">
          <div className="onboarding-content__visual">
            <div className="onboarding-visual-card">
              <div className="onboarding-visual-card__icon">
                <Icon name="bx-rocket" />
              </div>
              <h3 className="onboarding-visual-card__title">
                Unlock Your Full Potential
              </h3>
              <p className="onboarding-visual-card__description">
                Complete your payment to access all premium features and start
                managing your properties like a pro.
              </p>

              <div className="onboarding-features-preview">
                {PREMIUM_FEATURES.map((feature) => (
                  <div
                    key={feature}
                    className="onboarding-features-preview__item"
                  >
                    <Icon name="bx-check-circle" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="onboarding-content__payment">
            <div className="onboarding-payment-box">
              <div className="onboarding-plan-selector">
                {plansData && plansData.length > 0 ? (
                  plansData.map((plan) => (
                    <button
                      key={plan.planName}
                      className={`onboarding-plan-selector__option ${
                        selectedPlan?.planName === plan.planName
                          ? "onboarding-plan-selector__option--active"
                          : ""
                      }`}
                      onClick={() => onPlanChange(plan.planName)}
                    >
                      <span className="onboarding-plan-selector__name">
                        {plan.name}
                      </span>
                      <span className="onboarding-plan-selector__price">
                        {plan.pricing.monthly.displayPrice}
                      </span>
                    </button>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      color: "#999",
                    }}
                  >
                    Loading plans...
                  </div>
                )}
              </div>

              <div className="onboarding-payment-box__header">
                <span className="onboarding-payment-box__badge">
                  {displayPlanName} Plan
                </span>
                <div className="onboarding-payment-box__price">
                  <span className="onboarding-payment-box__amount">
                    {displayPrice}
                  </span>
                  <span className="onboarding-payment-box__period">
                    /{billingPeriod}
                  </span>
                </div>
              </div>

              <div className="onboarding-payment-box__summary">
                <div className="onboarding-payment-box__row">
                  <span>
                    {displayPlanName} Plan ({billingCycle})
                  </span>
                  <span>{displayPrice}</span>
                </div>
                {SUMMARY_ROWS.map((row) => (
                  <div key={row.label} className="onboarding-payment-box__row">
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
                <div className="onboarding-payment-box__row onboarding-payment-box__row--total">
                  <span>Total Due Today</span>
                  <span>{displayPrice}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                loading={isCheckingOut}
                label="Continue to Payment"
                loadingText="Processing..."
                className="btn-primary btn-full onboarding-payment-box__cta"
                icon={<Icon name="bx-credit-card" />}
              />

              <div className="onboarding-payment-box__footer">
                <Icon name="bx-lock-alt" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
