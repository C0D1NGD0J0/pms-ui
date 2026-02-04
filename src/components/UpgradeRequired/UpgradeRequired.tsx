"use client";
import React from "react";
import { Icon } from "@components/Icon";
import { useRouter } from "next/navigation";
import { Button } from "@components/FormElements";

interface UpgradeRequiredProps {
  feature?: string;
  title?: string;
  message?: string;
  showContactSales?: boolean;
}

export const UpgradeRequired: React.FC<UpgradeRequiredProps> = ({
  feature = "This feature",
  title,
  message,
  showContactSales = true,
}) => {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/subscription");
  };

  const handleContactSales = () => {
    // TODO: Open contact modal or navigate to contact page
    router.push("/contact-sales");
  };

  return (
    <div className="upgrade-required">
      <div className="upgrade-required__container">
        <div className="upgrade-required__icon">
          <Icon name="bx-lock-alt" size="6rem" color="var(--secondary-color)" />
        </div>

        <h2 className="upgrade-required__title">
          {title || `${feature} Requires an Upgrade`}
        </h2>

        <p className="upgrade-required__message">
          {message ||
            `${feature} is not available on your current plan. Upgrade to unlock this feature and many more.`}
        </p>

        <div className="upgrade-required__features">
          <h3>Unlock with an upgrade:</h3>
          <ul>
            <li>
              <Icon name="bx-check" /> Advanced reporting and analytics
            </li>
            <li>
              <Icon name="bx-check" /> Unlimited properties and units
            </li>
            <li>
              <Icon name="bx-check" /> Priority support
            </li>
            <li>
              <Icon name="bx-check" /> API access
            </li>
            <li>
              <Icon name="bx-check" /> Custom integrations
            </li>
          </ul>
        </div>

        <div className="upgrade-required__actions">
          <Button
            label="View Plans & Upgrade"
            onClick={handleUpgrade}
            className="btn-primary btn-lg"
          />

          {showContactSales && (
            <Button
              label="Contact Sales"
              onClick={handleContactSales}
              className="btn-outline btn-lg"
            />
          )}
        </div>

        <p className="upgrade-required__note">
          Questions? Our team is here to help you choose the right plan.
        </p>
      </div>
    </div>
  );
};
