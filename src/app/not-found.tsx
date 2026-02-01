import React from "react";
import Link from "next/link";
import {
  ModernAuthLayout,
  AuthBrandPanel,
  AuthFormPanel,
} from "@components/AuthLayout";

const Custom404 = () => {
  return (
    <ModernAuthLayout
      brandContent={
        <AuthBrandPanel>
          <i className="bx bx-map-alt auth-brand-panel__icon"></i>
          <h1 className="auth-brand-panel__title">Got Lost?</h1>
          <p className="auth-brand-panel__subtitle">
            We can&apos;t seem to find the page you&apos;re looking for. Let us help you
            get back on track.
          </p>
          <ul className="auth-brand-panel__features">
            <li className="auth-brand-panel__feature">
              <i className="bx bx-check-circle"></i>
              <span>Easy navigation back to safety</span>
            </li>
            <li className="auth-brand-panel__feature">
              <i className="bx bx-check-circle"></i>
              <span>All your data is still secure</span>
            </li>
            <li className="auth-brand-panel__feature">
              <i className="bx bx-check-circle"></i>
              <span>Quick access to your dashboard</span>
            </li>
          </ul>
        </AuthBrandPanel>
      }
    >
      <AuthFormPanel title="404 - Page Not Found">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            padding: "2rem 0",
          }}
        >
          <i
            className="bx bx-error-circle"
            style={{
              fontSize: "6rem",
            }}
          ></i>
          <p style={{ textAlign: "center" }}>
            The page you&apos;re looking for may have been moved, deleted, or doesn&apos;t
            exist. Make sure you&apos;ve entered the correct URL or try navigating
            back to the home page.
          </p>
          <Link href="/dashboard" className="btn btn-primary btn-full-width">
            <i className="bx bx-home-alt"></i>
            Back to Dashboard
          </Link>
        </div>
      </AuthFormPanel>
    </ModernAuthLayout>
  );
};

export default Custom404;
