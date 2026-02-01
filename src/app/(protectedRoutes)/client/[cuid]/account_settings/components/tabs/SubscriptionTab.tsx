"use client";

import { Icon } from "@components/Icon";
import { Loading } from "@components/Loading";
import React, { useState, useMemo } from "react";
import { TableColumn, Table } from "@components/Table";
import { IClient } from "@interfaces/client.interface";
import { ExpandableCard } from "@components/ExpandableCard";
import { FormSection } from "@components/FormLayout/formSection";
import { useEntitlementsUsage } from "@hooks/useEntitlementsUsage";
import { useManageSeats } from "@subscription/hooks/useManageSeats";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { Checkbox, Button, Select, Modal } from "@components/FormElements";
import { useCancelSubscription } from "@subscription/hooks/useCancelSubscription";
import { useInitSubscriptionPayment } from "@subscription/hooks/useInitSubscriptionPayment";
import { useGetSubscriptionPlans } from "@app/(auth)/register/hook/queries/useGetSubscriptionPlans";

interface SubscriptionTabProps {
  clientInfo: IClient;
  inEditMode: boolean;
  currentProperties?: number;
  currentSeats?: number;
}

interface BillingHistory {
  invoiceId: string;
  number: string;
  amountPaid: number;
  currency: string;
  paidAt: string;
  period: {
    start: string;
    end: string;
  };
  pdfUrl?: string;
  hostedUrl?: string;
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
  const { cancelSubscription, isLoading: isCancelingSubscription } =
    useCancelSubscription();
  const { data: usageData } = useEntitlementsUsage(clientInfo.cuid);
  const { mutate: manageSeats, isPending: isManagingSeats } = useManageSeats();

  const subscription = clientInfo.subscription;
  const currentPlanName = subscription?.planName || "professional";
  const [selectedPlan, setSelectedPlan] = useState(currentPlanName);
  const [isAnnualBilling, setIsAnnualBilling] = useState(
    subscription?.billingInterval === "annual"
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [seatsToAdd, setSeatsToAdd] = useState(1);
  const [showManageSeatsModal, setShowManageSeatsModal] = useState(false);
  const [seatAction, setSeatAction] = useState<"purchase" | "remove">(
    "purchase"
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

  const seatInfo = (usageData as any)?.seatInfo;

  const seatDetails = useMemo(() => {
    if (!currentPlan || !subscription || !seatInfo) return null;

    const includedSeats = seatInfo.includedSeats;
    const additionalSeats = seatInfo.additionalSeats;
    const currentSeats = subscription.currentSeats;
    const totalAllowed = seatInfo.totalAllowed;
    const available = totalAllowed - currentSeats;
    const pricePerSeatCents = seatInfo.additionalSeatPriceCents;
    const maxAdditionalSeats = seatInfo.maxAdditionalSeats;
    const availableForPurchase = seatInfo.availableForPurchase;
    const canPurchaseMore =
      availableForPurchase > 0 && subscription.planName !== "essential";
    const canRemoveSeats = additionalSeats > 0;
    const maxCanRemove = Math.min(additionalSeats, totalAllowed - currentSeats);

    return {
      includedSeats,
      additionalSeats,
      currentSeats,
      totalAllowed,
      available,
      pricePerSeatCents,
      pricePerSeat: pricePerSeatCents / 100,
      maxAdditionalSeats,
      canPurchaseMore,
      availableForPurchase,
      canRemoveSeats,
      maxCanRemove,
      usagePercentage: (currentSeats / totalAllowed) * 100,
      currentMonthlyCost: (subscription.additionalSeatsCost || 0) / 100,
    };
  }, [currentPlan, subscription, seatInfo]);

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

  const handlePurchaseSeatsClick = () => {
    setSeatAction("purchase");
    setSeatsToAdd(1);
    setShowManageSeatsModal(true);
  };

  const handleRemoveSeatsClick = () => {
    setSeatAction("remove");
    setSeatsToAdd(1);
    setShowManageSeatsModal(true);
  };

  const handleConfirmManageSeats = () => {
    const seatDelta = seatAction === "purchase" ? seatsToAdd : -seatsToAdd;

    manageSeats(
      { cuid: clientInfo.cuid, seatDelta },
      {
        onSuccess: () => {
          setShowManageSeatsModal(false);
          setSeatsToAdd(1);
        },
      }
    );
  };

  const calculateNewCost = () => {
    if (!seatDetails) return { costChange: 0, newMonthly: 0, currentMonthly: 0 };

    const currentMonthly = (subscription?.totalMonthlyPrice || 0) / 100;
    const costChange = seatsToAdd * seatDetails.pricePerSeat;
    const newMonthly =
      seatAction === "purchase"
        ? currentMonthly + costChange
        : currentMonthly - costChange;

    return { costChange, newMonthly, currentMonthly };
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
              style={{ marginBottom: "1rem" }}
            />
            <h4 style={{ marginBottom: "0.5rem" }}>Access Restricted</h4>
            <p style={{ margin: 0 }}>
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
            <p style={{ margin: 0 }}>
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
    paymentMethod: subscription.paymentMethod
      ? {
          brand: subscription.paymentMethod.brand || "Card",
          last4: subscription.paymentMethod.last4 || "••••",
        }
      : null,
  };

  const renderInvoice = (_: any, record: BillingHistory) => (
    <strong>{record.number}</strong>
  );

  const renderDate = (_: any, record: BillingHistory) => {
    return new Date(record.paidAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderAmount = (_: any, record: BillingHistory) => (
    <strong>
      {record.currency} ${record.amountPaid.toFixed(2)}
    </strong>
  );

  const renderStatus = () => {
    return (
      <span className="status-badge paid">
        <Icon name="bx-check-circle" size="1rem" />
        Paid
      </span>
    );
  };

  const renderAction = (_: any, record: BillingHistory) => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {record.pdfUrl && (
        <a href={record.pdfUrl} target="_blank" rel="noopener noreferrer">
          <Button
            label="PDF"
            className="btn-outline btn-sm"
            icon={<Icon name="bx-download" />}
          />
        </a>
      )}
      {record.hostedUrl && (
        <a href={record.hostedUrl} target="_blank" rel="noopener noreferrer">
          <Button
            label="View"
            className="btn-outline btn-sm"
            icon={<Icon name="bx-show" />}
          />
        </a>
      )}
    </div>
  );

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    cancelSubscription(clientInfo.cuid);
    setShowCancelModal(false);
  };

  const billingHistoryColumns: TableColumn<BillingHistory>[] = [
    {
      title: "Invoice",
      dataIndex: "number",
      render: renderInvoice,
    },
    {
      title: "Date",
      dataIndex: "paidAt",
      render: renderDate,
    },
    {
      title: "Amount",
      dataIndex: "amountPaid",
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

  const billingHistory: BillingHistory[] =
    subscription?.billingHistory?.slice(0, 5) || [];

  return (
    <div className="resource-form">
      <FormSection
        title="Subscription & Billing"
        description="Manage your subscription plan and billing"
      >
        <div className="subscription-grid">
          <div className="subscription-section">
            <h5 className="section-label">PLAN FEATURES</h5>
            <ExpandableCard collapsedHeight={120}>
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
            </ExpandableCard>
          </div>

          <div className="subscription-section">
            <h5 className="section-label">CHANGE PLAN</h5>
            <ExpandableCard collapsedHeight={100}>
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
            </ExpandableCard>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Team Seat Management"
        description="Manage seats to control how many team members you can invite"
      >
        {!seatDetails ? (
          <Loading description="Loading seat information..." />
        ) : subscription.planName === "essential" ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <Icon
              name="bx-lock-alt"
              size="3rem"
              style={{ marginBottom: "1rem" }}
            />
            <h4 style={{ marginBottom: "0.5rem" }}>
              Additional Seats Not Available
            </h4>
            <p style={{ marginBottom: "1.5rem" }}>
              Upgrade to Growth or Portfolio plan to purchase additional team
              seats
            </p>
            <Button
              label="Upgrade Plan"
              className="btn-primary"
              icon={<Icon name="bx-rocket" />}
              onClick={() => {
                setSelectedPlan("growth");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        ) : (
          <div className="subscription-grid">
            <div className="subscription-section">
              <h5 className="section-label">CURRENT USAGE</h5>
              <ExpandableCard collapsedHeight={100}>
                <div className="plan-card">
                  <div className="seat-usage">
                    <div className="seat-usage__header">
                      <span className="seat-usage__count">
                        {seatDetails.currentSeats} / {seatDetails.totalAllowed}
                      </span>
                      <span className="seat-usage__label">seats used</span>
                    </div>

                    <div
                      className={`progress-bar-container ${
                        seatDetails.usagePercentage >= 90
                          ? "progress-bar-container--danger"
                          : seatDetails.usagePercentage >= 80
                            ? "progress-bar-container--warning"
                            : "progress-bar-container--success"
                      }`}
                    >
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min(seatDetails.usagePercentage, 100)}%`,
                          backgroundColor:
                            seatDetails.usagePercentage >= 90
                              ? "var(--danger-color)"
                              : seatDetails.usagePercentage >= 80
                                ? "var(--warning-color)"
                                : "var(--success-color)",
                        }}
                      />
                    </div>

                    <div className="seat-breakdown">
                      <div className="seat-breakdown__row">
                        <Icon name="bx-check-circle" />
                        <span>{seatDetails.includedSeats} included in plan</span>
                      </div>
                      {seatDetails.additionalSeats > 0 && (
                        <div className="seat-breakdown__row">
                          <Icon name="bx-plus-circle" />
                          <span>
                            {seatDetails.additionalSeats} additional purchased ($
                            {seatDetails.currentMonthlyCost.toFixed(2)}/mo)
                          </span>
                        </div>
                      )}
                      <div className="seat-breakdown__row seat-breakdown__row--highlight">
                        <Icon
                          name={
                            seatDetails.available > 0
                              ? "bx-user-check"
                              : "bx-error-circle"
                          }
                        />
                        <span>
                          {seatDetails.available} seat
                          {seatDetails.available !== 1 ? "s" : ""} available
                        </span>
                      </div>
                    </div>
                  </div>
              </div>
              </ExpandableCard>
            </div>

            <div className="subscription-section">
              <h5 className="section-label">MANAGE SEATS</h5>
              <ExpandableCard collapsedHeight={100}>
                <div className="plan-card">
                {!seatDetails.canPurchaseMore &&
                seatDetails.availableForPurchase === 0 ? (
                  <div style={{ padding: "1.5rem", textAlign: "center" }}>
                    <Icon
                      name="bx-info-circle"
                      size="2rem"
                      color="var(--warning-color)"
                      style={{ marginBottom: "1rem" }}
                    />
                    <p>
                      Maximum additional seats reached for your plan.
                      <br />
                      Contact sales for enterprise options.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="billing-info">
                      <span className="billing-info__label">
                        Price per seat
                      </span>
                      <span className="billing-info__value">
                        ${seatDetails.pricePerSeat.toFixed(2)}/month
                      </span>
                    </div>

                    <div className="billing-info">
                      <span className="billing-info__label">
                        Available to purchase
                      </span>
                      <span className="billing-info__value">
                        {seatDetails.availableForPurchase} more seat
                        {seatDetails.availableForPurchase !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {seatDetails.additionalSeats > 0 && (
                      <div className="billing-info">
                        <span className="billing-info__label">Can remove</span>
                        <span className="billing-info__value">
                          Up to {seatDetails.maxCanRemove} seat
                          {seatDetails.maxCanRemove !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "1rem",
                      }}
                    >
                      <Button
                        label="Purchase Seats"
                        className="btn-primary"
                        icon={<Icon name="bx-user-plus" />}
                        onClick={handlePurchaseSeatsClick}
                        disabled={!seatDetails.canPurchaseMore}
                        style={{ flex: 1 }}
                      />
                      {seatDetails.additionalSeats > 0 && (
                        <Button
                          label="Remove Seats"
                          className="btn-outline"
                          icon={<Icon name="bx-user-minus" />}
                          onClick={handleRemoveSeatsClick}
                          disabled={
                            !seatDetails.canRemoveSeats ||
                            seatDetails.maxCanRemove === 0
                          }
                          style={{ flex: 1 }}
                        />
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: "0.85rem",
                        marginTop: "1rem",
                        textAlign: "center",
                      }}
                    >
                      ✓ Changes apply immediately with proration
                    </p>
                  </>
                )}
              </div>
              </ExpandableCard>
            </div>
          </div>
        )}
      </FormSection>

      <FormSection
        title="Payment Method"
        description="Manage your payment information"
      >
        <div className="payment-method-grid">
          <div className="payment-card-container">
            {subscriptionData.paymentMethod ? (
              <>
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
                      <Icon
                        name={
                          subscriptionData.paymentMethod.brand?.toLowerCase() ===
                          "visa"
                            ? "bxl-visa"
                            : subscriptionData.paymentMethod.brand?.toLowerCase() ===
                                "mastercard"
                              ? "bxl-mastercard"
                              : "bx-credit-card"
                        }
                        size="2.5rem"
                        color="white"
                      />
                    </div>

                    <div className="payment-card__number">
                      •••• •••• •••• {subscriptionData.paymentMethod.last4}
                    </div>

                    <div className="payment-card__footer">
                      <div>
                        <div className="payment-card__expiry-label">
                          {subscriptionData.paymentMethod.brand?.toUpperCase() ||
                            "CARD"}
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
              </>
            ) : (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <Icon
                  name="bx-credit-card-alt"
                  size="3rem"
                  style={{ marginBottom: "1rem" }}
                />
                <h4 style={{ marginBottom: "0.5rem" }}>No Payment Method</h4>
                <p>Add a payment method to manage your subscription</p>
              </div>
            )}
          </div>

          <div className="invoices-container">
            <h5 className="invoices-header">RECENT INVOICES</h5>
            {billingHistory.length > 0 ? (
              <Table<BillingHistory>
                columns={billingHistoryColumns}
                dataSource={billingHistory}
                pagination={{ pageSize: 10 }}
                rowKey="invoiceId"
              />
            ) : (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <Icon
                  name="bx-receipt"
                  size="3rem"
                  style={{ marginBottom: "1rem" }}
                />
                <p>No billing history available</p>
              </div>
            )}
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
            onClick={handleCancelClick}
            disabled={subscription?.status === "inactive"}
            style={{ flexShrink: 0 }}
          />
        </div>
      </FormSection>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Subscription"
      >
        <div style={{ padding: "1rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Icon
              name="bx-error-circle"
              size="4rem"
              color="var(--danger-color)"
              style={{ marginBottom: "1rem" }}
            />
            <h3 style={{ marginBottom: "1rem", color: "var(--danger-color)" }}>
              Are you sure you want to cancel?
            </h3>
            <p style={{ lineHeight: "1.6" }}>
              Your account will remain active until the end of your current
              billing cycle on <strong>{subscriptionData.renewalDate}</strong>.
              After that, you&apos;ll lose access to all premium features.
            </p>
          </div>

          <div
            style={{
              backgroundColor: "var(--color-warning-light)",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "2rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "start" }}>
              <Icon
                name="bx-info-circle"
                color="var(--color-warning)"
                size="1.25rem"
              />
              <div style={{ flex: 1 }}>
                <strong>What happens next:</strong>
                <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.25rem" }}>
                  <li>Your subscription will be canceled immediately</li>
                  <li>You can continue using premium features until {subscriptionData.renewalDate}</li>
                  <li>No refunds will be issued for the current billing period</li>
                  <li>You can reactivate your subscription anytime</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="btn-group">
            <Button
              label="Keep Subscription"
              className="btn-outline"
              onClick={() => setShowCancelModal(false)}
              icon={<Icon name="bx-x" />}
            />
            <Button
              label="Yes, Cancel Subscription"
              className="btn-danger"
              onClick={handleConfirmCancel}
              loading={isCancelingSubscription}
              loadingText="Canceling..."
              icon={<Icon name="bx-trash" />}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showManageSeatsModal}
        onClose={() => setShowManageSeatsModal(false)}
        title={
          seatAction === "purchase"
            ? "Purchase Additional Seats"
            : "Remove Additional Seats"
        }
      >
        <div className="seat-modal-content">
          <div className="seat-modal-input-group">
            <label className="form-label">
              How many seats to {seatAction === "purchase" ? "add" : "remove"}?
            </label>
            <input
              type="number"
              min={1}
              max={
                seatAction === "purchase"
                  ? seatDetails?.availableForPurchase || 1
                  : seatDetails?.maxCanRemove || 1
              }
              value={seatsToAdd}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                const max =
                  seatAction === "purchase"
                    ? seatDetails?.availableForPurchase || 1
                    : seatDetails?.maxCanRemove || 1;
                setSeatsToAdd(Math.max(1, Math.min(max, value)));
              }}
              className="form-input"
            />
            <p className="seat-modal-hint">
              {seatAction === "purchase"
                ? `Maximum: ${seatDetails?.availableForPurchase} additional seats`
                : `Maximum: ${seatDetails?.maxCanRemove} seats (cannot remove seats in use)`}
            </p>
          </div>

          <div className="pricing-breakdown">
            <h5 className="pricing-breakdown__title">Pricing Breakdown</h5>
            <div className="pricing-breakdown__row">
              <span>Current monthly total</span>
              <span>${calculateNewCost().currentMonthly.toFixed(2)}</span>
            </div>
            <div className="pricing-breakdown__row">
              <span>
                {seatAction === "purchase" ? "+" : "-"} {seatsToAdd} seat
                {seatsToAdd !== 1 ? "s" : ""} × $
                {seatDetails?.pricePerSeat.toFixed(2)}
              </span>
              <span>
                {seatAction === "purchase" ? "+" : "-"}$
                {calculateNewCost().costChange.toFixed(2)}/mo
              </span>
            </div>
            <hr className="pricing-breakdown__divider" />
            <div className="pricing-breakdown__row pricing-breakdown__row--total">
              <span>New monthly total</span>
              <span>${calculateNewCost().newMonthly.toFixed(2)}</span>
            </div>
          </div>

          <div className="billing-info-box">
            <Icon
              name="bx-info-circle"
              color="var(--info-color)"
              size="1.25rem"
            />
            <div className="billing-info-box__content">
              <strong>Billing Information:</strong>
              <ul>
                <li>
                  Your card will be{" "}
                  {seatAction === "purchase" ? "charged" : "credited"}{" "}
                  immediately
                </li>
                <li>Prorated for the current billing period</li>
                <li>Full amount on future renewals</li>
                <li>
                  Seats {seatAction === "purchase" ? "available" : "removed"}{" "}
                  right away
                </li>
              </ul>
            </div>
          </div>

          <div className="btn-group">
            <Button
              label="Cancel"
              className="btn-outline"
              onClick={() => setShowManageSeatsModal(false)}
              disabled={isManagingSeats}
            />
            <Button
              label={`${seatAction === "purchase" ? "Purchase" : "Remove"} ${seatsToAdd} Seat${seatsToAdd !== 1 ? "s" : ""}`}
              className={
                seatAction === "purchase" ? "btn-primary" : "btn-danger"
              }
              onClick={handleConfirmManageSeats}
              loading={isManagingSeats}
              loadingText="Processing..."
              icon={<Icon name="bx-credit-card" />}
            />
          </div>
        </div>
      </Modal>

      <FormSection
        title="Account Actions"
        description="Manage your account status and data"
      >
        <div className="form-actions">
          <Button
            label="Delete Account"
            className="btn-danger"
            icon={<Icon name="bx-trash" />}
          />
          <Button
            label="Export Data"
            className="btn-outline"
            icon={<Icon name="bx-download" />}
          />
        </div>
      </FormSection>
    </div>
  );
};
