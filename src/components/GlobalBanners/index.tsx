"use client";

import { useAuth } from "@store/auth.store";
import { useDowngradeSubscription } from "@subscription/hooks";
import { useInitSubscriptionPayment } from "@subscription/hooks";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { DowngradeWarningBanner } from "@components/DowngradeWarningBanner";

export function GlobalBanners() {
  const { user, client } = useAuth();
  const { isSuperAdmin } = useUnifiedPermissions();
  const { downgrade, isDowngrading } = useDowngradeSubscription();
  const { initPayment } = useInitSubscriptionPayment();

  const subscription = user?.subscription;
  const pendingDowngradeAt = subscription?.paymentFlow?.gracePeriodEndsAt;
  const currentPlanName = subscription?.plan?.name || "essential";

  const handlePayNow = () => {
    if (client?.cuid) {
      initPayment({ cuid: client.cuid });
    }
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
