"use client";

import Link from "next/link";
import { useEffect, use } from "react";
import { Icon } from "@components/Icon";
import { Button } from "@components/FormElements";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { withClientAccess } from "@hooks/permissionHOCs";

function StripeOnboardingSuccess({
  params,
}: {
  params: Promise<{ cuid: string }>;
}) {
  const { cuid } = use(params);
  const { refreshUser } = useCurrentUser();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

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
            backgroundColor: "var(--success-color)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="bx-check" size="3rem" color="white" />
        </div>

        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "1rem",
            color: "var(--success-color)",
          }}
        >
          Verification Complete!
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            marginBottom: "2rem",
            lineHeight: "1.6",
            color: "var(--text-secondary)",
          }}
        >
          Your Stripe account has been successfully verified. You can now start
          accepting online rent payments from your tenants.
        </p>

        <div
          style={{
            backgroundColor: "var(--color-bg-primary)",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <h4
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Icon name="bx-info-circle" color="var(--info-color)" />
            What&apos;s Next?
          </h4>
          <ul style={{ paddingLeft: "1.5rem", lineHeight: "2" }}>
            <li>Your payment processing is now active</li>
            <li>Configure automatic rent collection in lease settings</li>
            <li>Tenants will receive payment instructions via email</li>
            <li>
              View transactions and manage payouts in your Stripe dashboard
            </li>
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href={`/client/${cuid}/account_settings`}>
            <Button
              label="Go to Account Settings"
              className="btn-primary"
              icon={<Icon name="bx-cog" />}
            />
          </Link>

          <Link href="/dashboard">
            <Button
              label="Go to Dashboard"
              className="btn-outline"
              icon={<Icon name="bx-home" />}
            />
          </Link>
        </div>

        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
          }}
        >
          🎉 You&apos;re all set to start collecting rent online!
        </p>
      </div>
    </div>
  );
}

export default withClientAccess(StripeOnboardingSuccess);
