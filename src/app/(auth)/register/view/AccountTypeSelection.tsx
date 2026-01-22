"use client";
import Link from "next/link";

interface AccountTypeSelectionProps {
  onSelectAccountType: (type: "business" | "individual") => void;
}

export default function AccountTypeSelection({
  onSelectAccountType,
}: AccountTypeSelectionProps) {
  return (
    <div className="account-type-selection">
      <div className="account-type-selection__login">
        <span>Already have an account?</span>
        <Link href="/login" className="btn btn-outline btn-sm">
          Sign in
        </Link>
      </div>

      <div className="account-type-selection__hero">
        <h1 className="account-type-selection__title">
          Let&apos;s Get Started
        </h1>
        <p className="account-type-selection__subtitle">
          Tell us a bit about yourself to personalize your experience
        </p>
      </div>

      <div className="account-type-cards">
        <div
          className="account-type-card"
          onClick={() => onSelectAccountType("individual")}
        >
          <div className="account-type-card__icon">
            <i className="bx bx-user"></i>
          </div>
          <h2 className="account-type-card__name">Individual</h2>
          <p className="account-type-card__description">
            I&apos;m managing my own property or a few properties personally
          </p>
          <ul className="account-type-card__features">
            <li>
              <i className="bx bx-check"></i> Perfect for landlords
            </li>
            <li>
              <i className="bx bx-check"></i> Simplified setup
            </li>
            <li>
              <i className="bx bx-check"></i> Quick onboarding
            </li>
          </ul>
          <button className="account-type-card__cta">
            Continue as Individual
          </button>
        </div>

        <div
          className="account-type-card account-type-card--featured"
          onClick={() => onSelectAccountType("business")}
        >
          <span className="account-type-card__badge">
            Recommended for Teams
          </span>
          <div className="account-type-card__icon">
            <i className="bx bx-buildings"></i>
          </div>
          <h2 className="account-type-card__name">Business</h2>
          <p className="account-type-card__description">
            I&apos;m part of a property management company or business
          </p>
          <ul className="account-type-card__features">
            <li>
              <i className="bx bx-check"></i> Team collaboration
            </li>
            <li>
              <i className="bx bx-check"></i> Company branding
            </li>
            <li>
              <i className="bx bx-check"></i> Advanced features
            </li>
          </ul>
          <button className="account-type-card__cta account-type-card__cta--primary">
            Continue as Business
          </button>
        </div>
      </div>
    </div>
  );
}
