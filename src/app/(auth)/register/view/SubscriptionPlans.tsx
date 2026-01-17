"use client";
import Link from "next/link";
import { useState } from "react";
import { Loading } from "@components/Loading";
import { EmptyState } from "@components/EmptyState";
import { IServerSubscriptionPlan } from "@interfaces/subscription.interface";

interface PlanSelectionProps {
  onSelectPlan: (
    plan: "personal" | "starter" | "professional",
    pricingId: string | null,
    lookUpKey: string | null,
    billingInterval: "monthly" | "annual"
  ) => void;
  plansData?: IServerSubscriptionPlan[];
  isLoadingPlans?: boolean;
  isPlansError?: boolean;
}

// Icon mapping based on plan name
const PLAN_ICONS: Record<string, string> = {
  personal: "bx-user",
  starter: "bx-briefcase",
  professional: "bx-buildings",
};

export default function SubscriptionPlans({
  onSelectPlan,
  plansData,
  isLoadingPlans,
  isPlansError,
}: PlanSelectionProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  if (isLoadingPlans) {
    return (
      <Loading description="Loading subscription plans..." textColor="light" />
    );
  }

  if (isPlansError) {
    return (
      <EmptyState
        type="error"
        title="Error Loading Plans"
        description="We couldn't load the subscription plans. Please try again later."
      />
    );
  }

  const sortedPlans =
    plansData && plansData.length > 0
      ? [...plansData].sort((a, b) => a.displayOrder - b.displayOrder)
      : [
          {
            planName: "personal",
            name: "Personal",
            description: "Perfect for individual landlords",
            displayOrder: 1,
            isFeatured: false,
            ctaText: "Get Started Free",
            featureList: [],
            trialDays: 0,
            priceInCents: 0,
            transactionFeePercent: 0,
            isCustomPricing: false,
            seatPricing: {
              includedSeats: 1,
              additionalSeatPriceCents: 0,
              maxAdditionalSeats: 0,
            },
            limits: {
              maxProperties: 1,
              maxUnits: 1,
              maxVendors: 5,
            },
            features: {},
            pricing: {
              monthly: {
                priceId: null,
                priceInCents: 0,
                displayPrice: "$0",
                lookUpKey: null,
              },
              annual: {
                priceId: null,
                priceInCents: 0,
                displayPrice: "$0",
                savingsPercent: 0,
                savingsDisplay: "Save 0%",
                lookUpKey: null,
              },
            },
          } as IServerSubscriptionPlan,
          {
            planName: "starter",
            name: "Starter",
            description: "For growing property managers",
            displayOrder: 2,
            isFeatured: true,
            featuredBadge: "Most Popular",
            ctaText: "Start Free Trial",
            featureList: [],
            trialDays: 14,
            priceInCents: 4900,
            transactionFeePercent: 0,
            isCustomPricing: false,
            seatPricing: {
              includedSeats: 3,
              additionalSeatPriceCents: 1000,
              maxAdditionalSeats: 10,
            },
            limits: {
              maxProperties: 25,
              maxUnits: 100,
              maxVendors: 50,
            },
            features: {},
            pricing: {
              monthly: {
                priceId: null,
                priceInCents: 4900,
                displayPrice: "$49",
                lookUpKey: null,
              },
              annual: {
                priceId: null,
                priceInCents: 47040, // $49 * 12 * 0.8 = $470.40/year
                displayPrice: "$39", // Monthly equivalent when billed annually
                savingsPercent: 20,
                savingsDisplay: "Save 20%",
                lookUpKey: null,
              },
            },
          } as IServerSubscriptionPlan,
          {
            planName: "professional",
            name: "Professional",
            description: "For established businesses",
            displayOrder: 3,
            isFeatured: false,
            ctaText: "Start Free Trial",
            featureList: [],
            trialDays: 14,
            priceInCents: 7900,
            transactionFeePercent: 0,
            isCustomPricing: false,
            seatPricing: {
              includedSeats: 10,
              additionalSeatPriceCents: 800,
              maxAdditionalSeats: 50,
            },
            limits: {
              maxProperties: 999999,
              maxUnits: 999999,
              maxVendors: 999999,
            },
            features: {},
            pricing: {
              monthly: {
                priceId: null,
                priceInCents: 7900,
                displayPrice: "$79",
                lookUpKey: null,
              },
              annual: {
                priceId: null,
                priceInCents: 75840, // $79 * 12 * 0.8 = $758.40/year
                displayPrice: "$63.20", // Monthly equivalent when billed annually ($758.40 / 12)
                savingsPercent: 20,
                savingsDisplay: "Save 20%",
                lookUpKey: null,
              },
            },
          } as IServerSubscriptionPlan,
        ];

  const renderPlanCard = (plan: IServerSubscriptionPlan) => {
    const icon = PLAN_ICONS[plan.planName] || "bx-briefcase";

    // Calculate price based on billing period
    let priceValue: string;

    if (isAnnual && plan.pricing.annual.savingsPercent > 0) {
      // Calculate discounted monthly price using server's savings percentage
      const monthlyPrice = plan.pricing.monthly.priceInCents;
      const discountMultiplier = 1 - plan.pricing.annual.savingsPercent / 100;
      const discountedPrice = Math.round(monthlyPrice * discountMultiplier);
      priceValue = (discountedPrice / 100).toFixed(0);
    } else {
      // Use regular monthly price
      const price = plan.pricing.monthly.displayPrice;
      priceValue = price.replace(/[^0-9]/g, "");
    }

    return (
      <div
        key={plan.planName}
        className={`pricing-card ${plan.isFeatured ? "featured" : ""}`}
        data-plan={plan.planName}
      >
        {plan.featuredBadge && (
          <span className="pricing-card__badge">{plan.featuredBadge}</span>
        )}
        <div className="pricing-card__icon">
          <i className={`bx ${icon}`}></i>
        </div>
        <h2 className="pricing-card__name">{plan.name}</h2>
        <p className="pricing-card__description">{plan.description}</p>
        <div className="pricing-card__price">
          <span className="pricing-card__amount">
            <span className="currency">$</span>
            <span className="price-value">{priceValue}</span>
          </span>
          <span className="pricing-card__period">/ month</span>
        </div>
        <ul className="pricing-card__features">
          {plan.featureList.map((feature, idx) => (
            <li key={idx}>
              <i className="bx bx-check"></i> {feature}
            </li>
          ))}
          {plan.disabledFeatures?.map((feature, idx) => (
            <li key={`disabled-${idx}`} className="disabled">
              <i className="bx bx-x"></i> {feature}
            </li>
          ))}
          <li>
            <i className="bx bx-check"></i> {plan.transactionFeePercent}%
            transaction fee
          </li>
        </ul>
        <button
          onClick={() => {
            const selectedPricing = isAnnual
              ? plan.pricing.annual
              : plan.pricing.monthly;
            const billingInterval = isAnnual ? "annual" : "monthly";
            onSelectPlan(
              plan.planName as "personal" | "starter" | "professional",
              selectedPricing.priceId,
              selectedPricing.lookUpKey,
              billingInterval
            );
          }}
          className={`pricing-card__cta ${plan.isFeatured ? "primary" : "secondary"}`}
        >
          {plan.ctaText}
        </button>
      </div>
    );
  };

  return (
    <div className="plan-selection">
      <div className="plan-selection__login">
        <span>Already have an account?</span>
        <Link href="/login" className="btn btn-outline btn-sm">
          Sign in
        </Link>
      </div>

      {/* Hero Section */}
      <div className="plan-selection__hero">
        <h1 className="plan-selection__title">Choose Your Perfect Plan</h1>
        <p className="plan-selection__subtitle">
          Whether you&apos;re managing a single property or an entire portfolio,
          we have the right solution for you. Start free and upgrade anytime.
        </p>

        {/* Billing Toggle */}
        <div className="billing-toggle">
          <span
            className={`billing-toggle__label ${!isAnnual ? "active" : ""}`}
          >
            Monthly
          </span>
          <div
            className={`billing-toggle__switch ${isAnnual ? "annual" : ""}`}
            onClick={() => setIsAnnual(!isAnnual)}
          ></div>
          <span className={`billing-toggle__label ${isAnnual ? "active" : ""}`}>
            Annual
          </span>
          <span className="billing-toggle__badge">Save 20%</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-cards">
        {sortedPlans.map((plan) => renderPlanCard(plan))}
      </div>

      {/* Enterprise CTA */}
      <div className="enterprise-cta">
        <div className="enterprise-cta__content">
          <h2 className="enterprise-cta__title">
            Need an Enterprise Solution?
          </h2>
          <p className="enterprise-cta__description">
            For large organizations with complex requirements, we offer
            customized solutions with dedicated support.
          </p>
          <div className="enterprise-cta__features">
            <span className="enterprise-cta__feature">
              <i className="bx bx-check-shield"></i> Custom integrations
            </span>
            <span className="enterprise-cta__feature">
              <i className="bx bx-check-shield"></i> Dedicated account manager
            </span>
            <span className="enterprise-cta__feature">
              <i className="bx bx-check-shield"></i> SLA guarantees
            </span>
            <span className="enterprise-cta__feature">
              <i className="bx bx-check-shield"></i> On-premise deployment
            </span>
            <span className="enterprise-cta__feature">
              <i className="bx bx-check-shield"></i> Custom training
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
