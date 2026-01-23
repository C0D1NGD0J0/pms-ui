"use client";

import { Icon } from "@components/Icon";
import { Loading } from "@components/Loading";
import React, { useState, useMemo } from "react";
import { TableColumn, Table } from "@components/Table";
import { IClient } from "@interfaces/client.interface";
import { FormSection } from "@components/FormLayout/formSection";
import { Checkbox, Button, Select } from "@components/FormElements";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { useInitSubscriptionPayment } from "@subscription/hooks/useInitSubscriptionPayment";
import { useGetSubscriptionPlans } from "@app/(auth)/register/hook/queries/useGetSubscriptionPlans";

interface SubscriptionTabProps {
  clientInfo: IClient;
  inEditMode: boolean;
  currentProperties?: number;
  currentSeats?: number;
}

interface BillingHistory {
  id: string;
  invoice: string;
  date: string;
  amount: string;
  status: string;
}

export const SubscriptionTab: React.FC<SubscriptionTabProps> = ({
  clientInfo,
  currentProperties = 0,
  currentSeats = 0,
}) => {
  const { isSuperAdmin } = useUnifiedPermissions();
  const { data: plansData, isLoading: isLoadingPlans } =
    useGetSubscriptionPlans();
  const { initPayment, isLoading: isInitializingPayment } =
    useInitSubscriptionPayment();

  const subscription = clientInfo.subscription;
  const currentPlanName = subscription?.planName || "professional";
  const [selectedPlan, setSelectedPlan] = useState(currentPlanName);
  const [isAnnualBilling, setIsAnnualBilling] = useState(
    subscription?.billingInterval === "annual"
  );

  const PLAN_ICONS: Record<string, string> = {
    essential: "bx-user",
    growth: "bx-rocket",
    portfolio: "bx-crown",
    enterprise: "bx-buildings",
  };

  const currentPlan = plansData?.find(
    (p) => p.planName === subscription?.planName
  );
  const selectedPlanData = plansData?.find((p) => p.planName === selectedPlan);

  const planOptions = useMemo(
    () =>
      plansData?.map((plan) => ({
        value: plan.planName,
        label: `${plan.name} - ${plan.pricing.monthly.displayPrice}/month`,
      })) || [],
    [plansData]
  );

  const currentPlanDetails = selectedPlanData
    ? {
        name: selectedPlanData.name,
        icon: PLAN_ICONS[selectedPlanData.planName] || "bx-briefcase",
        monthlyPrice: selectedPlanData.pricing.monthly.displayPrice,
        annualPrice: selectedPlanData.pricing.annual.displayPrice,
        monthlyPriceId: selectedPlanData.pricing.monthly.priceId,
        annualPriceId: selectedPlanData.pricing.annual.priceId,
        monthlyLookupKey: selectedPlanData.pricing.monthly.lookUpKey,
        annualLookupKey: selectedPlanData.pricing.annual.lookUpKey,
        features: [
          ...selectedPlanData.featureList.map((feature) => ({
            icon: "bx-check",
            text: feature,
            included: true,
          })),
          ...(selectedPlanData.disabledFeatures || []).map((feature) => ({
            icon: "bx-x",
            text: feature,
            included: false,
          })),
        ],
      }
    : null;

  const handlePaymentInit = () => {
    if (!currentPlanDetails) return;

    const billingInterval = isAnnualBilling ? "annual" : "monthly";
    const priceId = isAnnualBilling
      ? currentPlanDetails.annualPriceId
      : currentPlanDetails.monthlyPriceId;
    const lookupKey = isAnnualBilling
      ? currentPlanDetails.annualLookupKey
      : currentPlanDetails.monthlyLookupKey;

    initPayment({
      cuid: clientInfo.cuid,
      priceId,
      lookupKey,
      billingInterval,
    });
  };

  if (isLoadingPlans) {
    return (
      <div className="resource-form">
        <FormSection
          title="Subscription & Billing"
          description="Loading subscription plans..."
        >
          <Loading description="Loading subscription plans..." />
        </FormSection>
      </div>
    );
  }

  if (!isSuperAdmin || !subscription) {
    return (
      <div className="resource-form">
        <FormSection
          title="Subscription Overview"
          description="Your current subscription plan"
        >
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <Icon
              name="bx-lock-alt"
              size="3rem"
              color="var(--text-muted)"
              style={{ marginBottom: "1rem" }}
            />
            <h4 style={{ marginBottom: "0.5rem" }}>Access Restricted</h4>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              Only account owners can manage subscription and billing details.
            </p>
          </div>
        </FormSection>
      </div>
    );
  }

  if (!currentPlan || !currentPlanDetails) {
    return (
      <div className="resource-form">
        <FormSection
          title="Subscription & Billing"
          description="Unable to load subscription details"
        >
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <Icon
              name="bx-error"
              size="3rem"
              color="var(--danger-color)"
              style={{ marginBottom: "1rem" }}
            />
            <h4 style={{ marginBottom: "0.5rem" }}>Plan Not Found</h4>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              Unable to load subscription plan details. Please contact support.
            </p>
          </div>
        </FormSection>
      </div>
    );
  }

  const subscriptionData = {
    currentPlan:
      subscription.planName.charAt(0).toUpperCase() +
      subscription.planName.slice(1),
    status:
      subscription.status.charAt(0).toUpperCase() +
      subscription.status.slice(1),
    propertiesUsed: currentProperties,
    propertiesLimit: currentPlan?.limits.maxProperties || 0,
    teamMembersUsed: currentSeats,
    teamMembersLimit: currentPlan?.seatPricing.includedSeats || 0,
    nextPaymentAmount: subscription.amount
      ? `$${(subscription.amount / 100).toFixed(2)}`
      : "$0.00",
    nextPaymentDate: subscription.nextBillingDate
      ? new Date(subscription.nextBillingDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A",
    renewalDate: subscription.nextBillingDate
      ? new Date(subscription.nextBillingDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "N/A",
    paymentMethod: subscription.paymentMethod || {
      type: "Visa",
      last4: "••••",
      expiry: "N/A",
    },
  };

  const renderInvoice = (invoice: string) => <strong>{invoice}</strong>;

  const renderAmount = (amount: string) => <strong>{amount}</strong>;

  const renderStatus = (status: string) => {
    const badgeClass = `status-badge ${status.toLowerCase()}`;
    return (
      <span className={badgeClass}>
        <Icon name="bx-check-circle" size="1rem" />
        {status}
      </span>
    );
  };

  const renderAction = () => (
    <Button
      label="Download"
      className="btn-outline btn-sm"
      icon={<Icon name="bx-download" />}
    />
  );

  const handleCancleSubscription = () => {
    // Implement cancellation logic here
    console.log("Subscription cancellation process initiated.");
  };

  const billingHistoryColumns: TableColumn<BillingHistory>[] = [
    {
      title: "Invoice",
      dataIndex: "invoice",
      render: renderInvoice,
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: renderAmount,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: renderStatus,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const billingHistory = [
    {
      id: "1",
      invoice: "#INV-2025-001",
      date: "Jan 15, 2025",
      amount: "$79.00",
      status: "Paid",
    },
    {
      id: "2",
      invoice: "#INV-2024-012",
      date: "Dec 15, 2024",
      amount: "$79.00",
      status: "Paid",
    },
    {
      id: "3",
      invoice: "#INV-2024-011",
      date: "Nov 15, 2024",
      amount: "$79.00",
      status: "Paid",
    },
  ];

  return (
    <div className="resource-form">
      <FormSection
        title="Subscription & Billing"
        description="Manage your subscription plan and billing"
      >
        <div className="subscription-grid">
          <div className="subscription-section">
            <h5 className="section-label">PLAN FEATURES</h5>
            <div className="plan-card">
              <div className="plan-card__header">
                <div className="plan-icon">
                  <Icon name={currentPlanDetails.icon} />
                </div>
                <div className="plan-info">
                  <span className="plan-label">
                    {selectedPlan === currentPlanName
                      ? "Current Plan"
                      : "Selected Plan"}
                  </span>
                  <h4 className="plan-name">{currentPlanDetails.name}</h4>
                </div>
              </div>

              <div className="features-section">
                <ul className="features-list">
                  {currentPlanDetails.features.map(
                    (
                      feature: { included: boolean; text: string },
                      index: number
                    ) => (
                      <li
                        key={index}
                        className={`feature-item ${!feature.included ? "feature-item--excluded" : ""}`}
                      >
                        <Icon
                          name={feature.included ? "bx-check" : "bx-x"}
                          className="feature-icon"
                        />
                        <span>{feature.text}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="subscription-section">
            <h5 className="section-label">CHANGE PLAN</h5>
            <div className="plan-card">
              <div className="plan-selector">
                <label className="form-label">SELECT PLAN</label>
                <Select
                  id="plan-select"
                  name="plan"
                  options={planOptions}
                  value={selectedPlan}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedPlan(e.target.value)
                  }
                />
              </div>

              <div className="billing-info">
                <span className="billing-info__label">Plan Cost</span>
                <span className="billing-info__value">
                  {isAnnualBilling
                    ? currentPlanDetails.annualPrice
                    : currentPlanDetails.monthlyPrice}
                  /{isAnnualBilling ? "year" : "month"}
                </span>
              </div>

              <div className="billing-cycle-option">
                <Checkbox
                  id="annual-billing"
                  name="annualBilling"
                  checked={isAnnualBilling}
                  onChange={(e) => setIsAnnualBilling(e.target.checked)}
                  label={
                    <span className="checkbox-text">
                      <Icon name="bx-calendar-check" size="1rem" />
                      Annual Billing (Save 20%)
                    </span>
                  }
                />
                {isAnnualBilling && (
                  <p className="billing-savings-note">
                    Billed annually at a discounted rate
                  </p>
                )}
              </div>

              {selectedPlan === currentPlanName && (
                <div className="billing-info">
                  <span className="billing-info__label">Next Billing Date</span>
                  <span className="billing-info__value">
                    {subscriptionData.renewalDate}
                  </span>
                </div>
              )}

              <Button
                label={
                  subscription?.status === "pending_payment"
                    ? "Initialize Payment"
                    : selectedPlan === currentPlanName
                      ? "Update Billing"
                      : `Switch to ${currentPlanDetails.name}`
                }
                className="btn-primary btn-full"
                loading={isInitializingPayment}
                icon={
                  <Icon
                    name={
                      subscription?.status === "pending_payment"
                        ? "bx-wallet"
                        : selectedPlan === currentPlanName
                          ? "bx-credit-card"
                          : "bx-transfer-alt"
                    }
                  />
                }
                onClick={handlePaymentInit}
              />
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Payment Method"
        description="Manage your payment information"
      >
        <div className="payment-method-grid">
          <div className="payment-card-container">
            <div className="payment-card">
              <div className="payment-card__decoration payment-card__decoration--top" />
              <div className="payment-card__decoration payment-card__decoration--bottom" />

              <div className="payment-card__content">
                <div className="payment-card__header">
                  <Icon
                    name="bx-chip"
                    size="2rem"
                    color="rgba(255,255,255,0.8)"
                  />
                  <Icon name="bxl-visa" size="2.5rem" color="white" />
                </div>

                <div className="payment-card__number">
                  •••• •••• •••• {subscriptionData.paymentMethod.last4}
                </div>

                <div className="payment-card__footer">
                  <div>
                    <div className="payment-card__expiry-label">EXPIRES</div>
                    <div className="payment-card__expiry-value">
                      {subscriptionData.paymentMethod.expiry}
                    </div>
                  </div>
                  <div className="payment-card__badge">✓ DEFAULT</div>
                </div>
              </div>
            </div>

            <div className="payment-card-actions">
              <Button
                label="Update"
                className="btn-outline btn-sm"
                icon={<Icon name="bx-edit-alt" />}
                style={{ flex: 1 }}
              />
              <Button
                label="Remove"
                className="btn-outline btn-sm"
                icon={<Icon name="bx-trash" />}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className="invoices-container">
            <h5 className="invoices-header">RECENT INVOICES</h5>
            <Table<BillingHistory>
              columns={billingHistoryColumns}
              dataSource={billingHistory}
              pagination={{ pageSize: 10 }}
              rowKey="id"
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Danger Zone"
        description="Irreversible subscription actions"
      >
        <div className="flex-row gap-2">
          <span className="flex-row">
            <Icon name="bx-error" size="2rem" color="red" />
            <p>
              Your account will remain active until next billing cycle. After
              that, you&apos;ll lose access to all current plan features.
            </p>
          </span>
          <Button
            label="Cancel Plan"
            className="btn-danger btn-sm"
            icon={<Icon name="bx-trash" />}
            onClick={handleCancleSubscription}
            style={{ flexShrink: 0 }}
          />
        </div>
      </FormSection>
    </div>
  );
};
