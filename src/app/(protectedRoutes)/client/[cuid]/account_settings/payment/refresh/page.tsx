"use client";

import { use } from "react";
import Link from "next/link";
import { Icon } from "@components/Icon";
import { useRouter } from "next/navigation";
import { Button } from "@components/FormElements";
import { withClientAccess } from "@hooks/permissionHOCs";

function StripeOnboardingRefresh({
  params,
}: {
  params: Promise<{ cuid: string }>;
}) {
  const router = useRouter();
  const { cuid } = use(params);

  const handleReturnToSettings = () => {
    router.push(`/client/${cuid}/account_settings`);
  };

  return (
    <div
      className="page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          textAlign: "center",
          padding: "3rem",
          backgroundColor: "var(--color-bg-secondary)",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 2rem",
            backgroundColor: "var(--warning-color)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="bx-error" size="3rem" color="white" />
        </div>

        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "1rem",
            color: "var(--warning-color)",
          }}
        >
          Verification Incomplete
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            marginBottom: "2rem",
            lineHeight: "1.6",
            color: "var(--text-secondary)",
          }}
        >
          It looks like you didn&apos;t complete the Stripe verification process.
          You&apos;ll need to finish the verification steps before you can start
          accepting online payments.
        </p>

        <div
          style={{
            backgroundColor: "var(--color-warning-light)",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "start" }}>
            <Icon
              name="bx-info-circle"
              color="var(--warning-color)"
              size="1.25rem"
              style={{ flexShrink: 0, marginTop: "2px" }}
            />
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", marginBottom: "0.5rem" }}>
                Why is verification required?
              </strong>
              <p style={{ margin: 0, lineHeight: "1.6" }}>
                Stripe requires verification to comply with financial
                regulations and prevent fraud. This protects both you and your
                tenants by ensuring secure and legitimate transactions.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          <Button
            label="Return to Account Settings"
            className="btn-primary"
            onClick={handleReturnToSettings}
            icon={<Icon name="bx-cog" />}
          />

          <Link href="/dashboard">
            <Button
              label="Go to Dashboard"
              className="btn-outline"
              icon={<Icon name="bx-home" />}
            />
          </Link>
        </div>

        <div
          style={{
            backgroundColor: "var(--color-bg-primary)",
            padding: "1.5rem",
            borderRadius: "8px",
            textAlign: "left",
          }}
        >
          <h4 style={{ marginBottom: "1rem" }}>
            <Icon name="bx-help-circle" /> Need Help?
          </h4>
          <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
            If you&apos;re having trouble with the verification process:
          </p>
          <ul style={{ paddingLeft: "1.5rem", lineHeight: "2" }}>
            <li>Make sure you have all required documents ready</li>
            <li>Check that your business information is accurate</li>
            <li>Contact Stripe support if you encounter technical issues</li>
            <li>
              Reach out to our support team if you need additional assistance
            </li>
          </ul>
        </div>

        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
          }}
        >
          💡 You can restart the verification process anytime from Account
          Settings
        </p>
      </div>
    </div>
  );
}

export default withClientAccess(StripeOnboardingRefresh);
