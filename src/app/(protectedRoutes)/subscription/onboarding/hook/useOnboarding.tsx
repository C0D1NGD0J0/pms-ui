import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { ISubscriptionPlan } from "@interfaces/subscription.interface";
import { useGetSubscriptionPlans } from "@app/(auth)/register/hook/queries/useGetSubscriptionPlans";

export function useOnboarding() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const {
    data: plansResponse,
    isLoading: isLoadingPlans,
    isError: isPlansError,
  } = useGetSubscriptionPlans();

  const [countdown, setCountdown] = useState("48:00:00");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ISubscriptionPlan | null>(
    null
  );

  const plansData = plansResponse || [];

  // Helper function to update countdown display
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

  // Get the user's selected plan from subscription data
  useEffect(() => {
    if (plansData && plansData.length > 0 && user?.subscription) {
      const userPlanName = user.subscription.plan.name;
      const plan = plansData.find((p) => p.planName === userPlanName);
      setSelectedPlan(plan || plansData[0]);
    } else if (plansData && plansData.length > 0) {
      // Fallback if no subscription data
      const defaultPlan =
        plansData.find((p) => p.planName === "growth") || plansData[0];
      setSelectedPlan(defaultPlan);
    }
  }, [plansData, user]);

  // Countdown timer based on gracePeriodEndsAt
  useEffect(() => {
    const gracePeriodEndsAt = user?.subscription?.paymentFlow.gracePeriodEndsAt;

    let endTime: Date;
    if (gracePeriodEndsAt) {
      endTime = new Date(gracePeriodEndsAt);
    } else {
      // No grace period, use default 48 hours
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

    // Initial update
    const initialDiff = endTime.getTime() - new Date().getTime();
    updateCountdownDisplay(initialDiff);

    return () => clearInterval(interval);
  }, [user?.subscription?.paymentFlow.gracePeriodEndsAt]);

  // Handle Stripe checkout
  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      // TODO: Replace with actual API call to create Stripe checkout session
      // const response = await fetch('/api/v1/subscription/checkout', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     planId: selectedPlan?.planName,
      //     billingInterval: user?.subscription?.plan.billingInterval || 'monthly'
      //   })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   window.location.href = data.checkoutUrl; // Redirect to Stripe
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo: redirect to dashboard (in production, this would redirect to Stripe)
      router.push("/dashboard");
    } catch (error) {
      console.error("Checkout error:", error);
      setIsCheckingOut(false);
    }
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
