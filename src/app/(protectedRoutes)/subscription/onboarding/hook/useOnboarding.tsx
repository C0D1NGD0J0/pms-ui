import { useEffect, useState } from "react";
import { useAuth } from "@store/auth.store";
import { ISubscriptionPlan } from "@interfaces/subscription.interface";
import { useInitSubscriptionPayment } from "@subscription/hooks/useInitSubscriptionPayment";
import { useGetSubscriptionPlans } from "@app/(auth)/register/hook/queries/useGetSubscriptionPlans";

export function useOnboarding() {
  const { user, client } = useAuth();
  const {
    data: plansResponse,
    isLoading: isLoadingPlans,
    isError: isPlansError,
  } = useGetSubscriptionPlans();

  const { initPayment, isLoading: isCheckingOut } = useInitSubscriptionPayment({
    autoRedirect: true,
  });

  const [countdown, setCountdown] = useState("48:00:00");
  const [selectedPlan, setSelectedPlan] = useState<ISubscriptionPlan | null>(
    null
  );

  const plansData = plansResponse || [];

  const updateCountdownDisplay = (diff: number) => {
    if (diff <= 0) {
      setCountdown("00:00:00");
      return false;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setCountdown(
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );
    return true;
  };

  useEffect(() => {
    if (plansData && plansData.length > 0 && user?.subscription) {
      const userPlanName = user.subscription.plan.name;
      const plan = plansData.find((p) => p.planName === userPlanName);
      setSelectedPlan(plan || plansData[0]);
    } else if (plansData && plansData.length > 0) {
      const defaultPlan =
        plansData.find((p) => p.planName === "growth") || plansData[0];
      setSelectedPlan(defaultPlan);
    }
  }, [plansData, user]);

  useEffect(() => {
    const gracePeriodEndsAt = user?.subscription?.paymentFlow?.gracePeriodEndsAt;

    let endTime: Date;
    if (gracePeriodEndsAt) {
      endTime = new Date(gracePeriodEndsAt);
    } else {
      endTime = new Date();
      endTime.setHours(endTime.getHours() + 48);
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      const shouldContinue = updateCountdownDisplay(diff);

      if (!shouldContinue) {
        clearInterval(interval);
      }
    }, 1000);

    const initialDiff = endTime.getTime() - new Date().getTime();
    updateCountdownDisplay(initialDiff);

    return () => clearInterval(interval);
  }, [user?.subscription?.paymentFlow?.gracePeriodEndsAt]);

  const handleCheckout = () => {
    if (!client?.cuid || !selectedPlan) return;

    const billingInterval =
      user?.subscription?.plan?.billingInterval || "monthly";
    const isAnnual = billingInterval === "annual";

    const priceId = isAnnual
      ? selectedPlan.pricing.annual.priceId
      : selectedPlan.pricing.monthly.priceId;
    const lookupKey = isAnnual
      ? selectedPlan.pricing.annual.lookUpKey
      : selectedPlan.pricing.monthly.lookUpKey;

    initPayment({
      cuid: client.cuid,
      priceId,
      lookupKey,
      billingInterval,
    });
  };

  const handlePlanChange = (planName: string) => {
    const plan = plansData.find((p) => p.planName === planName);
    if (plan) {
      setSelectedPlan(plan);
    }
  };

  return {
    user,
    selectedPlan,
    plansData,
    isLoadingPlans,
    isPlansError,
    countdown,
    handleCheckout,
    isCheckingOut,
    handlePlanChange,
  };
}
