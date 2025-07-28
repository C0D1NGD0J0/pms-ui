import React, { useState } from "react";
import { Loading } from "@components/Loading";
import {
  AuthContentHeader,
  AuthContentFooter,
  AuthContentBody,
} from "@components/AuthLayout";

import { mockInvitationData } from "../../mockData";
import { ErrorStates } from "../components/ErrorStates";
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
  token: string;
}

export function InvitationAcceptanceView({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cuid, // TODO: Use cuid for client-scoped API validation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  token, // TODO: Use token for API validation in real implementation
}: InvitationAcceptanceViewProps) {
  const [currentStep, setCurrentStep] = useState<InvitationStep>("loading");
  const [errorType, setErrorType] = useState<ErrorType>("expired");

  // Simulate initial validation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Mock validation logic - in real app this would call the API
      if (mockInvitationData.status === "expired") {
        setErrorType("expired");
        setCurrentStep("error");
      } else if (mockInvitationData.status === "invalid") {
        setErrorType("invalid");
        setCurrentStep("error");
      } else if (mockInvitationData.status === "accepted") {
        setErrorType("accepted");
        setCurrentStep("error");
      } else {
        setCurrentStep("invitation-details");
      }
    }, 2000); // Standard 2-second validation timeout

    return () => clearTimeout(timer);
  }, []);

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
      case "invitation-details":
        return (
          <InvitationDetails
            invitationData={mockInvitationData}
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
      case "error":
        return (
          <ErrorStates
            errorType={errorType}
            onContactSupport={handleContactSupport}
            onRedirectToLogin={handleRedirectToLogin}
          />
        );
      default:
        return null;
    }
  };

  const headerContent = getHeaderContent();

  if (currentStep === "loading") {
    return <Loading description="Validating Invitation" size="fullscreen" />;
  }

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
