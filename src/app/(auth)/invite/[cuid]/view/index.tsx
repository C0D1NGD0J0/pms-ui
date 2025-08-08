import { useRouter } from "next/navigation";
import { Skeleton } from "@components/Skeleton";
import React, { useEffect, useState } from "react";
import { SelectClientAccountModal } from "@components/SelectClientAccountModal";
import {
  AuthContentHeader,
  AuthContentFooter,
  AuthContentBody,
} from "@components/AuthLayout";
import {
  IInvitationAcceptResponse,
  IInvitationDocument,
} from "@src/interfaces/invitation.interface";

import { AccountSetup } from "../components/AccountSetup";
import { InvitationDetails } from "../components/InvitationDetails";

export type InvitationStep =
  | "loading"
  | "invitation-details"
  | "account-setup"
  | "error";

export type ErrorType = "expired" | "invalid" | "accepted";

interface InvitationAcceptanceViewProps {
  cuid: string;
  token: string;
  invitation: IInvitationDocument;
}

export function InvitationAcceptanceView({
  cuid,
  token,
  invitation,
}: InvitationAcceptanceViewProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<InvitationStep>("loading");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [userAccounts, setUserAccounts] = useState<
    Array<{ cuid: string; displayName: string }>
  >([]);

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

  const handleAccountSetupNext = (accountData: IInvitationAcceptResponse) => {
    if (accountData.accounts && accountData.accounts.length >= 1) {
      setUserAccounts(accountData.accounts);
      setCurrentStep("loading");
      setIsModalOpen(true);
    }
  };

  const handleSelectClient = (cuid: string) => {
    setSelectedClient(cuid);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = () => {
    const selectedAccount = userAccounts.find(
      (account) => account.cuid === selectedClient
    );
    if (selectedAccount) {
      const params = new URLSearchParams({
        fromInvite: "true",
        accountCuid: selectedAccount.cuid,
        accountName: selectedAccount.displayName,
      });

      router.push(`/dashboard?${params.toString()}`);
    }
    setIsModalOpen(false);
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
      case "error":
        return null; // Error state has its own title
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
            cuid={cuid}
            token={token}
            invitationData={invitation}
            onBack={handleBackToInvitation}
            onNext={handleAccountSetupNext}
          />
        );
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
      {isModalOpen && userAccounts.length > 0 && (
        <SelectClientAccountModal
          isOpen={isModalOpen}
          userAccounts={userAccounts}
          selectedClient={selectedClient}
          onSelect={handleSelectClient}
          onCancel={handleModalCancel}
          onConfirm={handleModalConfirm}
        />
      )}
    </>
  );
}
