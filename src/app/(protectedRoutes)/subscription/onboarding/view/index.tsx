"use client";
import storage from "@utils/storage";
import { Icon } from "@components/Icon";
import React, { useEffect } from "react";
import { Banner } from "@components/Banner";
import { Loading } from "@components/Loading";
import { EmptyState } from "@components/EmptyState";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal } from "@components/FormElements";
import { useSearchParams, useRouter } from "next/navigation";
import { ISubscriptionPlan } from "@interfaces/subscription.interface";
import {
  useSSENotificationActions,
  useSSENotifications,
} from "@store/sseNotification.store";

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
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { subscriptionInfo } = useSSENotifications();
  const { closePaymentModal } = useSSENotificationActions();

  const { showPaymentModal, paymentStatus, paymentMessage } = subscriptionInfo;
  const returningFromPayment =
    searchParams.get("returning_from_payment") === "true";

  useEffect(() => {
    if (showPaymentModal && paymentStatus === "success") {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["clientInfo"] });
    }
  }, [showPaymentModal, paymentStatus, queryClient]);

  // Auto-redirect to dashboard when returning from payment with success
  useEffect(() => {
    if (
      returningFromPayment &&
      showPaymentModal &&
      paymentStatus === "success"
    ) {
      // Wait a moment to ensure cache is invalidated
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [returningFromPayment, showPaymentModal, paymentStatus, router]);

  const handleSuccessAction = () => {
    closePaymentModal();
    router.push("/dashboard");
  };

  // Show loading state when returning from payment (waiting for SSE)
  if (returningFromPayment && !showPaymentModal) {
    return (
      <Loading description="Processing your payment... You'll be redirected shortly." />
    );
  }

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

  // If payment modal is showing, only render the modal (hide the onboarding overlay)
  if (showPaymentModal) {
    return (
      <Modal
        isOpen={showPaymentModal}
        onClose={closePaymentModal}
        title={
          paymentStatus === "success"
            ? "Payment Successful!"
            : paymentStatus === "failed"
              ? "Payment Failed"
              : "Payment Canceled"
        }
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Icon
            name={
              paymentStatus === "success" ? "bx-check-circle" : "bx-x-circle"
            }
            size="4rem"
            color={
              paymentStatus === "success"
                ? "var(--success-color)"
                : "var(--warning-color)"
            }
            style={{ marginBottom: "1rem" }}
          />
          <h3 style={{ marginBottom: "1rem" }}>
            {paymentStatus === "success"
              ? "Welcome to Your Premium Plan!"
              : paymentStatus === "failed"
                ? "Payment Failed"
                : "Payment Was Not Completed"}
          </h3>
          <p style={{ marginBottom: "2rem" }}>
            {paymentMessage ||
              (paymentStatus === "success"
                ? "Your payment has been processed successfully. You now have full access to all premium features."
                : "Your payment was not completed. You can retry anytime to unlock premium features.")}
          </p>
          <div className="btn-group">
            {paymentStatus === "success" ? (
              <Button
                label="Go to Dashboard"
                className="btn-primary"
                icon={<Icon name="bx-home" />}
                onClick={handleSuccessAction}
              />
            ) : (
              <>
                <Button
                  label="Try Again"
                  className="btn-primary"
                  icon={<Icon name="bx-credit-card" />}
                  onClick={closePaymentModal}
                />
                <Button
                  label="Close"
                  className="btn-outline"
                  onClick={closePaymentModal}
                />
              </>
            )}
          </div>
        </div>
      </Modal>
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
              <div className="btn-group">
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  loading={isCheckingOut}
                  label="Continue to Payment"
                  loadingText="Processing..."
                  className="btn-primary btn-full onboarding-payment-box__cta"
                  icon={<Icon name="bx-credit-card" />}
                />
              </div>

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
