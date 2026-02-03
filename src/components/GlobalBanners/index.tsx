"use client";

import { useAuth } from "@store/auth.store";
import { useDowngradeSubscription } from "@subscription/hooks";
import { useInitSubscriptionPayment } from "@subscription/hooks";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { DowngradeWarningBanner } from "@components/DowngradeWarningBanner";
import { useGetSubscriptionPlans } from "@app/(auth)/register/hook/queries/useGetSubscriptionPlans";

export function GlobalBanners() {
  const { user, client } = useAuth();
  const { isSuperAdmin } = useUnifiedPermissions();
  const { downgrade, isDowngrading } = useDowngradeSubscription();
  const { initPayment } = useInitSubscriptionPayment();
  const { data: plansData } = useGetSubscriptionPlans();

  const subscription = user?.subscription;
  const pendingDowngradeAt = subscription?.paymentFlow?.gracePeriodEndsAt;
  const currentPlanName = subscription?.plan?.name || "essential";

  const handlePayNow = () => {
    if (!client?.cuid || !subscription) return;

    // Get the current plan details
    const currentPlan = plansData?.find(
      (p: any) => p.planName === subscription.plan.name
    );
    if (!currentPlan) return;

    const billingInterval = subscription.plan.billingInterval || "monthly";
    const isAnnual = billingInterval === "annual";

    const priceId = isAnnual
      ? currentPlan.pricing.annual.priceId
      : currentPlan.pricing.monthly.priceId;
    const lookupKey = isAnnual
      ? currentPlan.pricing.annual.lookUpKey
      : currentPlan.pricing.monthly.lookUpKey;

    initPayment({
      cuid: client.cuid,
      priceId,
      lookupKey,
      billingInterval,
    });
  };

  const handleConfirmDowngrade = () => {
    if (client?.cuid) {
      downgrade(client.cuid);
    }
  };

  const showDowngradeBanner =
    isSuperAdmin && pendingDowngradeAt && client?.cuid;

  return (
    <>
      {showDowngradeBanner && (
        <DowngradeWarningBanner
          pendingDowngradeAt={pendingDowngradeAt}
          currentPlanName={currentPlanName}
          cuid={client.cuid}
          onPayNow={handlePayNow}
          onConfirmDowngrade={handleConfirmDowngrade}
          isDowngrading={isDowngrading}
        />
      )}
      {/* Future: Add more banners here (announcements, maintenance, etc.) */}
    </>
  );
}
