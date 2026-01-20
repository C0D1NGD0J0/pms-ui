"use client";

import { Icon } from "@components/Icon";
import { Table } from "@components/Table";
import { Loading } from "@components/Loading";
import React, { useState, useMemo } from "react";
import { IClient } from "@interfaces/client.interface";
import { Button, Select } from "@components/FormElements";
import { FormSection } from "@components/FormLayout/formSection";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { useGetSubscriptionPlans } from "@app/(auth)/register/hook/queries/useGetSubscriptionPlans";

interface SubscriptionTabProps {
  clientInfo: IClient;
  inEditmode: boolean;
}

export const SubscriptionTab: React.FC<SubscriptionTabProps> = ({
  clientInfo,
}) => {
  const { isSuperAdmin } = useUnifiedPermissions();
  const { data: plansData, isLoading: isLoadingPlans } =
    useGetSubscriptionPlans();

  const subscription = clientInfo.subscription;
  const currentPlanName = subscription?.planName || "professional";
  const [selectedPlan, setSelectedPlan] = useState(currentPlanName);
  const [isAnnualBilling, setIsAnnualBilling] = useState(
    subscription?.billingCycle === "annual"
  );

  const PLAN_ICONS: Record<string, string> = {
    personal: "bx-user",
    starter: "bx-rocket",
    professional: "bx-crown",
    enterprise: "bx-buildings",
  };

  const availablePlans = useMemo(() => {
    if (!plansData || plansData.length === 0) return {};

    return plansData.reduce(
      (acc, plan) => {
        const planKey = plan.planName.toLowerCase();
        acc[planKey] = {
          name: plan.name,
          value: plan.planName,
          description: plan.description,
          monthlyPrice: plan.pricing.monthly.displayPrice,
          annualPrice: plan.pricing.annual.displayPrice,
          period: "month",
          icon: PLAN_ICONS[planKey] || "bx-briefcase",
          features: plan.featureList
            .map((feature) => ({
              icon: "bx-check",
              text: feature,
              included: true,
            }))
            .concat(
              (plan.disabledFeatures || []).map((feature) => ({
                icon: "bx-x",
                text: feature,
                included: false,
              }))
            ),
        };
        return acc;
      },
      {} as Record<string, any>
    );
  }, [plansData, PLAN_ICONS]);

  const planOptions = useMemo(() => {
    if (!plansData || plansData.length === 0) return [];

    return plansData
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((plan) => ({
        value: plan.planName,
        label: `${plan.name} - ${plan.pricing.monthly.displayPrice}/month`,
      }));
  }, [plansData]);

  // Helper function to get plan limits from API data
  const getPlanLimit = useMemo(() => {
    return (planName: string, type: "properties" | "seats"): number => {
      const plan = plansData?.find((p) => p.planName.toLowerCase() === planName.toLowerCase());
      if (!plan) return 0;

      if (type === "properties") {
        return plan.limits.maxProperties;
      } else {
        return plan.seatPricing.includedSeats;
      }
    };
  }, [plansData]);

  // NOW we can do early returns after all hooks are called
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

  const subscriptionData = {
    currentPlan:
      subscription.planName.charAt(0).toUpperCase() +
      subscription.planName.slice(1),
    status:
      subscription.status.charAt(0).toUpperCase() +
      subscription.status.slice(1),
    propertiesUsed: subscription.currentProperties,
    propertiesLimit: getPlanLimit(subscription.planName, "properties"),
    teamMembersUsed: subscription.currentSeats,
    teamMembersLimit: getPlanLimit(subscription.planName, "seats"),
    nextPaymentAmount: subscription.amount
      ? `$${subscription.amount}`
      : "$79.00",
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

  // Normalize plan name and fallback to first available plan if not found
  const normalizedPlan = selectedPlan.toLowerCase();
  const currentPlanDetails = availablePlans[normalizedPlan] ||
    Object.values(availablePlans)[0] || {
      name: "Professional",
      value: "professional",
      description: "Most popular choice",
      monthlyPrice: "$79",
      annualPrice: "$790",
      period: "month",
      icon: "bx-crown",
      features: [],
    };

  const billingHistoryColumns = [
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
      render: (invoice: string) => (
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: 600,
            color: "var(--text-color)",
          }}
        >
          {invoice}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => (
        <span
          style={{
            fontWeight: 600,
            fontSize: "1rem",
            color: "var(--text-color)",
          }}
        >
          {amount}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.375rem 0.75rem",
            borderRadius: "1rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            background:
              "linear-gradient(135deg, hsla(var(--success-hsl), 0.15) 0%, hsla(var(--success-hsl), 0.1) 100%)",
            color: "var(--success-color)",
            border: "1px solid hsla(var(--success-hsl), 0.2)",
          }}
        >
          <Icon
            name="bx-check-circle"
            size="1rem"
            color="var(--success-color)"
          />
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: () => (
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            border: "1px solid var(--primary-color)",
            borderRadius: "0.5rem",
            background:
              "linear-gradient(135deg, hsla(var(--primary-hsl), 0.1) 0%, hsla(var(--primary-hsl), 0.05) 100%)",
            color: "var(--primary-color)",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--primary-color)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, hsla(var(--primary-hsl), 0.1) 0%, hsla(var(--primary-hsl), 0.05) 100%)";
            e.currentTarget.style.color = "var(--primary-color)";
          }}
        >
          <Icon name="bx-download" size="1rem" />
          Download
        </button>
      ),
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
                  /{currentPlanDetails.period}
                </span>
              </div>

              <div className="billing-cycle-option">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isAnnualBilling}
                    onChange={(e) => setIsAnnualBilling(e.target.checked)}
                    className="billing-checkbox"
                  />
                  <span className="checkbox-text">
                    <Icon name="bx-calendar-check" size="1rem" />
                    Annual Billing (Save 20%)
                  </span>
                </label>
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
                  selectedPlan === currentPlanName
                    ? "Update Billing"
                    : `Switch to ${currentPlanDetails.name}`
                }
                className="btn-primary btn-full"
                icon={
                  <Icon
                    name={
                      selectedPlan === currentPlanName
                        ? "bx-credit-card"
                        : "bx-transfer-alt"
                    }
                  />
                }
                onClick={() => {
                  // TODO: Implement API call to update subscription
                  // Should send: selectedPlan, isAnnualBilling
                  console.log("Update subscription:", {
                    plan: selectedPlan,
                    billingCycle: isAnnualBilling ? "annual" : "monthly",
                  });
                }}
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
            <Table
              columns={billingHistoryColumns}
              dataSource={billingHistory}
              pagination={false}
              rowKey="id"
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Danger Zone"
        description="Irreversible subscription actions"
      >
        <div
          style={{
            padding: "1.5rem",
            borderRadius: "0.5rem",
            background:
              "linear-gradient(135deg, hsla(var(--danger-hsl), 0.08) 0%, hsla(var(--danger-hsl), 0.03) 100%)",
            borderLeft: "4px solid var(--danger-color)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "start",
                gap: "1.25rem",
                flex: 1,
              }}
            >
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  background: "var(--danger-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="bx-error" size="1.25rem" color="white" />
              </div>
              <div>
                <h4
                  style={{
                    margin: "0 0 0.5rem",
                    color: "var(--danger-color)",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                  }}
                >
                  Cancel Subscription
                </h4>
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                  }}
                >
                  Your account will remain active until{" "}
                  {subscriptionData.renewalDate}. After that, you&apos;ll lose
                  access to all premium features.
                </p>
              </div>
            </div>
            <Button
              label="Cancel Plan"
              className="btn-danger btn-sm"
              icon={<Icon name="bx-trash" />}
              style={{ flexShrink: 0 }}
            />
          </div>
        </div>
      </FormSection>
    </div>
  );
};
