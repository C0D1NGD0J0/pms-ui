"use client";

import React, { useState } from "react";
import { Icon } from "@components/Icon";
import { Banner } from "@components/Banner";
import { Loading } from "@components/Loading";
import { Button } from "@components/FormElements";
import { paymentService } from "@services/payment";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { ExpandableCard } from "@components/ExpandableCard";
import { FormSection } from "@components/FormLayout/formSection";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";

interface PaymentTabProps {
  cuid: string;
}

export const PaymentTab: React.FC<PaymentTabProps> = ({ cuid }) => {
  const { user } = useCurrentUser();
  const { isSuperAdmin } = useUnifiedPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Permission check - only SUPER_ADMIN can access
  if (!isSuperAdmin) {
    return (
      <div className="resource-form">
        <FormSection
          title="Payment Processing"
          description="Setup online rent collection for your properties"
        >
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <Icon
              name="bx-lock-alt"
              size="3rem"
              style={{ marginBottom: "1rem" }}
            />
            <h4 style={{ marginBottom: "0.5rem" }}>Access Restricted</h4>
            <p style={{ margin: 0 }}>
              Only account owners can manage payment processing setup.
            </p>
          </div>
        </FormSection>
      </div>
    );
  }

  const paymentProcessor = user?.paymentProcessor;
  const hasPaymentProcessor = paymentProcessor?.isSetup || false;
  const chargesEnabled = paymentProcessor?.chargesEnabled || false;
  const needsOnboarding = paymentProcessor?.needsOnboarding || false;

  /**
   * Step 2: Create Payment Account
   */
  const handleEnablePayments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Create payment account
      console.log("Creating payment account...");
      const createResult = await paymentService.createConnectAccount(cuid, {
        email: user?.email || "",
        country: "US", // TODO: Get from user profile/preferences
        businessType: "company",
      });

      if (!createResult.success) {
        throw new Error("Failed to create payment account");
      }

      console.log("Payment account created:", createResult.data.accountId);

      // Step 2: Get onboarding link
      console.log("Getting onboarding link...");
      const linkResult = await paymentService.getOnboardingLink(cuid);

      if (!linkResult.success) {
        throw new Error("Failed to get onboarding link");
      }

      // Step 3: Redirect to onboarding
      console.log("Redirecting to payment onboarding...");
      window.location.href = linkResult.data.url;
    } catch (err: any) {
      console.error("Error setting up payment processing:", err);
      setError(
        err.message || "Failed to setup payment processing. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Step 3: Get Onboarding Link for existing account
   */
  const handleCompleteKYC = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const linkResult = await paymentService.getOnboardingLink(cuid);

      if (!linkResult.success) {
        throw new Error("Failed to get onboarding link");
      }

      console.log("Redirecting to payment onboarding...");
      window.location.href = linkResult.data.url;
    } catch (err: any) {
      console.error("Error getting onboarding link:", err);
      setError(
        err.message || "Failed to get onboarding link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * View Payment Dashboard
   */
  const handleViewDashboard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dashboardResult = await paymentService.getDashboardLink(cuid);

      if (!dashboardResult.success) {
        throw new Error("Failed to get dashboard link");
      }

      console.log("Opening payment dashboard...");
      window.open(dashboardResult.data.url, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      console.error("Error getting dashboard link:", err);
      setError(
        err.message || "Failed to get dashboard link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // State 1: No Payment Processor - Show "Enable Online Payments"
  if (!hasPaymentProcessor) {
    return (
      <div className="resource-form">
        <FormSection
          title="Payment Processing"
          description="Setup automated rent collection from your tenants"
        >
          {error && (
            <div style={{ marginBottom: "1.5rem" }}>
              <Banner
                type="error"
                title="Error"
                description={error}
                icon="bx-error-circle"
                className="subscription-banner"
              />
            </div>
          )}

          <div className="subscription-grid">
            <div className="subscription-section">
              <h5 className="section-label">PAYMENT SETUP</h5>
              <ExpandableCard collapsedHeight={180}>
                <div className="plan-card">
                  <div
                    style={{
                      textAlign: "center",
                      padding: "1.5rem 1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        margin: "0 auto 1.5rem",
                        backgroundColor: "var(--primary-color)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name="bx-credit-card" size="2.5rem" color="white" />
                    </div>

                    <h3
                      style={{ marginBottom: "0.75rem", fontSize: "1.25rem" }}
                    >
                      Enable Online Payments
                    </h3>

                    <p
                      style={{
                        marginBottom: "1.5rem",
                        color: "var(--text-muted)",
                        lineHeight: "1.6",
                      }}
                    >
                      Connect your payment account to start collecting rent automatically
                    </p>

                    <Button
                      label={
                        isLoading ? "Setting up..." : "Enable Online Payments"
                      }
                      className="btn-primary btn-full"
                      onClick={handleEnablePayments}
                      disabled={isLoading}
                      loading={isLoading}
                      icon={<Icon name="bx-rocket" />}
                    />

                    <p
                      style={{
                        marginTop: "1rem",
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      Takes 2-3 minutes to complete
                    </p>
                  </div>
                </div>
              </ExpandableCard>
            </div>

            <div className="subscription-section">
              <h5 className="section-label">BENEFITS</h5>
              <ExpandableCard collapsedHeight={180}>
                <div className="plan-card">
                  <ul className="features-list">
                    <li className="feature-item">
                      <Icon name="bx-check-circle" className="feature-icon" />
                      <span>Automatic rent collection on due dates</span>
                    </li>
                    <li className="feature-item">
                      <Icon name="bx-check-circle" className="feature-icon" />
                      <span>Secure payment processing</span>
                    </li>
                    <li className="feature-item">
                      <Icon name="bx-check-circle" className="feature-icon" />
                      <span>Direct deposits to your bank account</span>
                    </li>
                    <li className="feature-item">
                      <Icon name="bx-check-circle" className="feature-icon" />
                      <span>Payment history and reporting</span>
                    </li>
                    <li className="feature-item">
                      <Icon name="bx-check-circle" className="feature-icon" />
                      <span>Late fee automation</span>
                    </li>
                  </ul>
                </div>
              </ExpandableCard>
            </div>
          </div>
        </FormSection>
      </div>
    );
  }

  // State 2: Needs Onboarding - Show "Complete KYC Verification"
  if (needsOnboarding) {
    return (
      <div className="resource-form">
        <FormSection
          title="Payment Processing"
          description="Complete verification to start accepting payments"
        >
          {error && (
            <div style={{ marginBottom: "1.5rem" }}>
              <Banner
                type="error"
                title="Error"
                description={error}
                icon="bx-error-circle"
                className="subscription-banner"
              />
            </div>
          )}

          <div className="subscription-grid">
            <div className="subscription-section">
              <h5 className="section-label">VERIFICATION STATUS</h5>
              <ExpandableCard collapsedHeight={150}>
                <div className="plan-card">
                  <div style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
                    <Icon
                      name="bx-shield-quarter"
                      size="3rem"
                      color="var(--warning-color)"
                      style={{ marginBottom: "1rem" }}
                    />

                    <h4 style={{ marginBottom: "0.5rem" }}>
                      Verification Required
                    </h4>

                    <p
                      style={{
                        marginBottom: "1.5rem",
                        color: "var(--text-muted)",
                        lineHeight: "1.6",
                      }}
                    >
                      Complete account verification to activate payment
                      processing
                    </p>

                    <Button
                      label={isLoading ? "Loading..." : "Complete Verification"}
                      className="btn-primary btn-full"
                      onClick={handleCompleteKYC}
                      disabled={isLoading}
                      loading={isLoading}
                      icon={<Icon name="bx-check-shield" />}
                    />

                    <p
                      style={{
                        marginTop: "1rem",
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      Secure verification process
                    </p>
                  </div>
                </div>
              </ExpandableCard>
            </div>

            <div className="subscription-section">
              <h5 className="section-label">REQUIRED INFORMATION</h5>
              <ExpandableCard collapsedHeight={150}>
                <div className="plan-card">
                  <ul className="features-list">
                    <li className="feature-item">
                      <Icon name="bx-buildings" className="feature-icon" />
                      <span>Business information</span>
                    </li>
                    <li className="feature-item">
                      <Icon name="bx-id-card" className="feature-icon" />
                      <span>Tax ID (EIN or SSN)</span>
                    </li>
                    <li className="feature-item">
                      <Icon name="bx-money" className="feature-icon" />
                      <span>Bank account details</span>
                    </li>
                    <li className="feature-item">
                      <Icon name="bx-user-check" className="feature-icon" />
                      <span>Personal identification</span>
                    </li>
                  </ul>
                </div>
              </ExpandableCard>
            </div>
          </div>
        </FormSection>
      </div>
    );
  }

  // State 3: Active - Show "Payment Processing Active"
  if (chargesEnabled) {
    return (
      <div className="resource-form">
        <FormSection
          title="Payment Processing"
          description="Your payment account is active and ready"
        >
          {error && (
            <div style={{ marginBottom: "1.5rem" }}>
              <Banner
                type="error"
                title="Error"
                description={error}
                icon="bx-error-circle"
                className="subscription-banner"
              />
            </div>
          )}

          <div className="subscription-grid">
            <div className="subscription-section">
              <h5 className="section-label">ACCOUNT STATUS</h5>
              <ExpandableCard collapsedHeight={120}>
                <div className="plan-card">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.5rem 0",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: "var(--success-color)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name="bx-check" size="2rem" color="white" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.25rem",
                          color: "var(--success-color)",
                        }}
                      >
                        Payment Processing Active
                      </h3>
                      <p
                        style={{
                          margin: "0.25rem 0 0 0",
                          color: "var(--text-muted)",
                        }}
                      >
                        Ready to collect rent from tenants
                      </p>
                    </div>
                  </div>
                </div>
              </ExpandableCard>
            </div>

            <div className="subscription-section">
              <h5 className="section-label">CAPABILITIES</h5>
              <ExpandableCard collapsedHeight={120}>
                <div className="plan-card">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Icon
                        name="bx-check-shield"
                        size="2rem"
                        color="var(--success-color)"
                        style={{ marginBottom: "0.5rem" }}
                      />
                      <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                        KYC Verified
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <Icon
                        name="bx-credit-card"
                        size="2rem"
                        color="var(--success-color)"
                        style={{ marginBottom: "0.5rem" }}
                      />
                      <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                        Charges Enabled
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <Icon
                        name="bx-money"
                        size="2rem"
                        color="var(--success-color)"
                        style={{ marginBottom: "0.5rem" }}
                      />
                      <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                        Payouts Ready
                      </div>
                    </div>
                  </div>
                </div>
              </ExpandableCard>
            </div>
          </div>

          <FormSection
            title="Manage Account"
            description="Access your payment dashboard and settings"
          >
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Button
                label="View Payment Dashboard"
                className="btn-primary"
                onClick={handleViewDashboard}
                disabled={isLoading}
                loading={isLoading}
                icon={<Icon name="bx-line-chart" />}
              />

              <Button
                label="Update Account"
                className="btn-outline"
                onClick={handleCompleteKYC}
                disabled={isLoading}
                icon={<Icon name="bx-edit-alt" />}
              />
            </div>
          </FormSection>
        </FormSection>
      </div>
    );
  }

  // Fallback - should never reach here
  return (
    <div className="resource-form">
      <FormSection
        title="Payment Processing"
        description="Loading payment status..."
      >
        <Loading description="Loading payment information..." />
      </FormSection>
    </div>
  );
};
