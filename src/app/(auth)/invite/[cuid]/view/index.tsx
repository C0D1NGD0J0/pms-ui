import { Skeleton } from "@components/Skeleton";
import React, { useEffect, useState } from "react";
import { IInvitationDocument } from "@src/interfaces/invitation.interface";
import {
  AuthContentHeader,
  AuthContentFooter,
  AuthContentBody,
} from "@components/AuthLayout";

import { mockInvitationData } from "../../mockData";
import { AccountSetup } from "../components/AccountSetup";
import { SuccessState } from "../components/SuccessState";
import { RoleConfirmation } from "../components/RoleConfirmation";
import { InvitationDetails } from "../components/InvitationDetails";

export type InvitationStep =
  | "loading"
  | "invitation-details"
  | "account-setup"
  | "role-confirmation"
  | "success"
  | "error";

export type ErrorType = "expired" | "invalid" | "accepted";

interface InvitationAcceptanceViewProps {
  cuid: string;
  token?: string;
  invitation: IInvitationDocument;
}

export function InvitationAcceptanceView({
  cuid,
  token,
  invitation,
}: InvitationAcceptanceViewProps) {
  const [currentStep, setCurrentStep] = useState<InvitationStep>("loading");

  useEffect(() => {
    if (!invitation) {
      setCurrentStep("loading");
    }

    if (invitation) {
      setCurrentStep("invitation-details");
    }
  }, [invitation]);

  const handleAcceptInvitation = () => {
    setCurrentStep("account-setup");
  };

  const handleDeclineInvitation = () => {
    if (confirm("Are you sure you want to decline this invitation?")) {
      alert(
        "Invitation declined. You can contact support if you change your mind."
      );
    }
  };

  const handleBackToInvitation = () => {
    setCurrentStep("invitation-details");
  };

  const handleAccountSetupNext = () => {
    setCurrentStep("role-confirmation");
  };

  const handleRoleConfirmationComplete = () => {
    setCurrentStep("success");

    // Auto-redirect after 3 seconds
    setTimeout(() => {
      handleRedirectToDashboard();
    }, 3000);
  };

  const handleRedirectToDashboard = () => {
    // Mock redirect based on role
    const dashboardRoutes = {
      admin: "/dashboard",
      manager: "/dashboard",
      staff: "/dashboard",
      vendor: "/vendor-dashboard",
      tenant: "/tenant-dashboard",
    };

    const route =
      dashboardRoutes[
        mockInvitationData.role as keyof typeof dashboardRoutes
      ] || "/dashboard";
    console.log(`Redirecting to: ${route}`);
    // In real app: window.location.href = route;
  };

  const handleContactSupport = () => {
    // Mock support contact
    window.open(
      "mailto:support@propertymanagement.com?subject=Invitation%20Issue"
    );
  };

  const handleRedirectToLogin = () => {
    console.log("Redirecting to login page");
    // In real app: window.location.href = "/login";
  };

  const getHeaderContent = () => {
    switch (currentStep) {
      case "loading":
        return null; // No header during loading
      case "invitation-details":
        return {
          title: "You're Invited!",
          subtitle: "Join our property management platform",
        };
      case "account-setup":
        return {
          title: "Create Your Account",
          subtitle: "Set up your account to get started",
        };
      case "role-confirmation":
        return {
          title: "Welcome to the Team!",
          subtitle: "Your account has been created successfully",
        };
      case "success":
      case "error":
        return null; // These states have their own titles
      default:
        return {
          title: "Invitation",
          subtitle: "Process your invitation",
        };
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case "loading":
        return (
          <div className="invitation-loading">
            <Skeleton
              type="card"
              active
              paragraph={{ rows: 4 }}
              title={{ width: "60%" }}
            />
            <div className="mt-2">
              <Skeleton.Button
                active
                size="small"
                shape="square"
                style={{ width: 120 }}
              />
              <Skeleton.Button
                active
                size="small"
                shape="square"
                style={{ width: 120, marginLeft: 12 }}
              />
            </div>
          </div>
        );
      case "invitation-details":
        return (
          <InvitationDetails
            invitation={invitation}
            onAccept={handleAcceptInvitation}
            onDecline={handleDeclineInvitation}
          />
        );
      case "account-setup":
        return (
          <AccountSetup
            invitationData={mockInvitationData}
            onBack={handleBackToInvitation}
            onNext={handleAccountSetupNext}
          />
        );
      case "role-confirmation":
        return (
          <RoleConfirmation
            invitationData={mockInvitationData}
            onComplete={handleRoleConfirmationComplete}
          />
        );
      case "success":
        return <SuccessState onRedirect={handleRedirectToDashboard} />;
      default:
        return null;
    }
  };

  const headerContent = getHeaderContent();

  return (
    <>
      {headerContent && (
        <AuthContentHeader
          title={headerContent.title}
          subtitle={headerContent.subtitle}
        />
      )}
      <AuthContentBody>{renderContent()}</AuthContentBody>
      <AuthContentFooter />
    </>
  );
}
