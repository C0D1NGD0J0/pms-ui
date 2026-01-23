"use client";

import { useState } from "react";
import { Icon } from "@components/Icon";
import { Banner } from "@components/Banner";

interface DowngradeWarningBannerProps {
  pendingDowngradeAt: string;
  currentPlanName: string;
  cuid: string;
  dismiss?: boolean;
  onPayNow: () => void;
  onConfirmDowngrade: () => void;
  isDowngrading: boolean;
}

export function DowngradeWarningBanner({
  pendingDowngradeAt,
  currentPlanName,
  cuid,
  onPayNow,
  onConfirmDowngrade,
  isDowngrading,
  dismiss = false,
}: DowngradeWarningBannerProps) {
  const isPastDue = new Date(pendingDowngradeAt) <= new Date();

  const [isDismissed, setIsDismissed] = useState(() => {
    if (isPastDue) return false;
    return sessionStorage.getItem(`downgrade-dismissed-${cuid}`) === "true";
  });

  const handleDismiss = () => {
    if (!isPastDue) {
      sessionStorage.setItem(`downgrade-dismissed-${cuid}`, "true");
      setIsDismissed(true);
    }
  };

  if (isDismissed) return null;

  const downgradeDate = new Date(pendingDowngradeAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const description = isPastDue ? (
    <>
      Your payment is overdue. Your account will be downgraded from{" "}
      <strong>{currentPlanName}</strong> to <strong>Essential</strong> plan.
      Please complete payment or confirm the downgrade.
    </>
  ) : (
    <>
      Payment required by <strong>{downgradeDate}</strong>. Without payment,
      your account will be downgraded from <strong>{currentPlanName}</strong> to{" "}
      <strong>Essential</strong> plan.
    </>
  );

  const actions = isPastDue
    ? [
        {
          label: "Confirm Downgrade",
          onClick: onConfirmDowngrade,
          className: "btn-danger",
          icon: <Icon name="bx-error" />,
          loading: isDowngrading,
        },
        {
          label: "Pay Now",
          onClick: onPayNow,
          className: "btn-primary",
          icon: <Icon name="bx-wallet" />,
        },
      ]
    : [
        {
          label: "Pay Now",
          onClick: onPayNow,
          className: "btn-primary",
          icon: <Icon name="bx-wallet" />,
        },
      ];

  return (
    <Banner
      type={isPastDue ? "error" : "warning"}
      title={
        isPastDue ? "Payment Overdue - Action Required" : "Payment Required"
      }
      description={description}
      icon={isPastDue ? "bx-error" : "bx-error-circle"}
      actions={actions}
      dismissible={!isPastDue || dismiss}
      onDismiss={handleDismiss}
    />
  );
}
