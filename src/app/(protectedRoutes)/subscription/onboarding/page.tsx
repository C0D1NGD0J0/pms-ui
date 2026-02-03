"use client";
import React from "react";

import { OnboardingView } from "./view";
import { useOnboarding } from "./hook/useOnboarding";

export default function SubscriptionOnboarding() {
  const {
    user,
    selectedPlan,
    plansData,
    isLoadingPlans,
    isPlansError,
    countdown,
    handleCheckout,
    isCheckingOut,
    handlePlanChange,
  } = useOnboarding();

  return (
    <OnboardingView
      user={user}
      selectedPlan={selectedPlan}
      plansData={plansData}
      isLoadingPlans={isLoadingPlans}
      isPlansError={isPlansError}
      countdown={countdown}
      handleCheckout={handleCheckout}
      isCheckingOut={isCheckingOut}
      onPlanChange={handlePlanChange}
    />
  );
}
