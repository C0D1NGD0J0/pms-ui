"use client";
import { useState } from "react";

interface PlanSelectionProps {
  onSelectPlan: (plan: "personal" | "business" | "professional") => void;
}

export default function PlanSelection({ onSelectPlan }: PlanSelectionProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="plan-selection">
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
        {/* Personal Plan */}
        <div className="pricing-card" data-plan="personal">
          <div className="pricing-card__icon">
            <i className="bx bx-user"></i>
          </div>
          <h2 className="pricing-card__name">Personal</h2>
          <p className="pricing-card__description">
            Perfect for individual landlords
          </p>
          <div className="pricing-card__price">
            <span className="pricing-card__amount">
              <span className="currency">$</span>
              <span className="price-value">0</span>
            </span>
            <span className="pricing-card__period">/ month</span>
          </div>
          <ul className="pricing-card__features">
            <li>
              <i className="bx bx-check"></i> Up to 3 properties
            </li>
            <li>
              <i className="bx bx-check"></i> Basic tenant management
            </li>
            <li>
              <i className="bx bx-check"></i> Rent collection
            </li>
            <li>
              <i className="bx bx-check"></i> Maintenance requests
            </li>
            <li>
              <i className="bx bx-check"></i> Email support
            </li>
            <li className="disabled">
              <i className="bx bx-x"></i> Advanced reporting
            </li>
            <li className="disabled">
              <i className="bx bx-x"></i> Team members
            </li>
          </ul>
          <button
            onClick={() => onSelectPlan("personal")}
            className="pricing-card__cta secondary"
          >
            Get Started Free
          </button>
        </div>

        {/* Business Plan (Featured) */}
        <div className="pricing-card featured" data-plan="business">
          <span className="pricing-card__badge">Most Popular</span>
          <div className="pricing-card__icon">
            <i className="bx bx-briefcase"></i>
          </div>
          <h2 className="pricing-card__name">Business</h2>
          <p className="pricing-card__description">
            For growing property managers
          </p>
          <div className="pricing-card__price">
            <span className="pricing-card__amount">
              <span className="currency">$</span>
              <span className="price-value">{isAnnual ? "63" : "79"}</span>
            </span>
            <span className="pricing-card__period">/ month</span>
          </div>
          <ul className="pricing-card__features">
            <li>
              <i className="bx bx-check"></i> Up to 50 properties
            </li>
            <li>
              <i className="bx bx-check"></i> Advanced tenant screening
            </li>
            <li>
              <i className="bx bx-check"></i> Online payments & AutoPay
            </li>
            <li>
              <i className="bx bx-check"></i> Vendor management
            </li>
            <li>
              <i className="bx bx-check"></i> Financial reporting
            </li>
            <li>
              <i className="bx bx-check"></i> Up to 10 team members
            </li>
            <li>
              <i className="bx bx-check"></i> Priority support
            </li>
          </ul>
          <button
            onClick={() => onSelectPlan("business")}
            className="pricing-card__cta primary"
          >
            Start 14-Day Free Trial
          </button>
        </div>

        {/* Professional Plan */}
        <div className="pricing-card" data-plan="professional">
          <div className="pricing-card__icon">
            <i className="bx bx-buildings"></i>
          </div>
          <h2 className="pricing-card__name">Professional</h2>
          <p className="pricing-card__description">
            For established businesses
          </p>
          <div className="pricing-card__price">
            <span className="pricing-card__amount">
              <span className="currency">$</span>
              <span className="price-value">{isAnnual ? "159" : "199"}</span>
            </span>
            <span className="pricing-card__period">/ month</span>
          </div>
          <ul className="pricing-card__features">
            <li>
              <i className="bx bx-check"></i> Unlimited properties
            </li>
            <li>
              <i className="bx bx-check"></i> Everything in Business
            </li>
            <li>
              <i className="bx bx-check"></i> Custom branding
            </li>
            <li>
              <i className="bx bx-check"></i> API access
            </li>
            <li>
              <i className="bx bx-check"></i> Advanced analytics
            </li>
            <li>
              <i className="bx bx-check"></i> Unlimited team members
            </li>
            <li>
              <i className="bx bx-check"></i> Phone support
            </li>
          </ul>
          <button
            onClick={() => onSelectPlan("professional")}
            className="pricing-card__cta secondary"
          >
            Start 14-Day Free Trial
          </button>
        </div>
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
