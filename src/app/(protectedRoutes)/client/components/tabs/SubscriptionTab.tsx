"use client";

import React from "react";
import { Button } from "@components/FormElements";
import { IClient } from "@interfaces/client.interface";
import { FormSection } from "@components/FormLayout/formSection";

interface SubscriptionTabProps {
  clientInfo: IClient;
}

export const SubscriptionTab: React.FC<SubscriptionTabProps> = ({
  clientInfo,
}) => {
  return (
    <div className="resource-form">
      <FormSection
        title="Subscription Details"
        description="Current subscription plan and billing information"
      >
        <div className="client-account__subscription-info">
          <div className="client-account__subscription-details">
            <div className="subscription-plan">
              <h4>
                Current Plan:{" "}
                <span className="plan-name">
                  {clientInfo.accountType.planName}
                </span>
              </h4>
              <p>Your subscription renews on April 1, 2025</p>
            </div>
            <div className="subscription-actions">
              <Button label="Change Plan" className="btn-outline" />
              <Button
                label="Cancel Subscription"
                className="btn-text text-danger"
              />
            </div>
          </div>

          <div className="client-account__plan-features">
            <h4>Plan Features</h4>
            <ul>
              <li>
                <i className="bx bx-check success"></i> Up to 50 properties
              </li>
              <li>
                <i className="bx bx-check success"></i> Unlimited users
              </li>
              <li>
                <i className="bx bx-check success"></i> Advanced reporting
              </li>
              <li>
                <i className="bx bx-check success"></i> Custom branding
              </li>
              <li>
                <i className="bx bx-check success"></i> API access
              </li>
              <li>
                <i className="bx bx-check success"></i> Priority support
              </li>
            </ul>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Payment Method"
        description="Update your payment information"
      >
        <div className="client-account__payment-methods">
          <div className="client-account__current-payment-method">
            <div className="card-info">
              <i className="bx bxl-visa"></i>
              <span>•••• •••• •••• 4567</span>
              <span>Expires 12/2026</span>
            </div>
            <div className="payment-actions">
              <Button label="Update Card" className="btn-outline" />
              <Button label="Change Method" className="btn-text" />
            </div>
          </div>
        </div>
      </FormSection>
    </div>
  );
};
