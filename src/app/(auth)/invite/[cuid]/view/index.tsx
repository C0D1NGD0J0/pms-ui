import { useRouter } from "next/navigation";
import { Skeleton } from "@components/Skeleton";
import React, { useEffect, useState } from "react";
import { SelectClientAccountModal } from "@components/SelectClientAccountModal";
import {
  ModernAuthLayout,
  AuthBrandPanel,
  AuthFormPanel,
} from "@components/AuthLayout";
import {
  IInvitationAcceptResponse,
  IInvitationDocument,
} from "@src/interfaces/invitation.interface";

import { AccountSetup } from "../components/AccountSetup";
import { useAccountSetupForm } from "../hooks/useAccountSetupForm";
import { InvitationDetails } from "../components/InvitationDetails";
import { DeclineInvitationModal } from "../components/DeclineInvitationModal";

export type InvitationStep =
  | "loading"
  | "invitation-details"
  | "account-setup"
  | "error";

export type ErrorType = "expired" | "invalid" | "accepted";

interface InvitationAcceptanceViewProps {
  cuid: string;
  token: string;
  invitation: IInvitationDocument | null;
}

export function InvitationAcceptanceView({
  cuid,
  token,
  invitation,
}: InvitationAcceptanceViewProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<InvitationStep>("loading");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [userAccounts, setUserAccounts] = useState<
    Array<{ cuid: string; clientDisplayName: string }>
  >([]);

  const handleAccountSetupNext = (accountData: IInvitationAcceptResponse) => {
    if (accountData.accounts && accountData.accounts.length >= 1) {
      setUserAccounts(accountData.accounts);
      setCurrentStep("loading");
      setIsModalOpen(true);
    }
  };

  const {
    handleSubmit,
    handleFieldChange,
    handleDropdownChange,
    isSubmitting,
    isValid,
    values,
    errors,
    touched,
    declineInvitation,
    isDeclineSubmitting,
  } = useAccountSetupForm({
    cuid,
    token,
    inviteeEmail: invitation?.inviteeEmail || "",
    onSuccess: handleAccountSetupNext,
    onError: (error) => {
      console.error("Account setup failed:", error);
    },
  });

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

  const handleBackToInvitation = () => {
    setCurrentStep("invitation-details");
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
        accountName: selectedAccount.clientDisplayName,
      });

      router.push(`/dashboard?${params.toString()}`);
    }
    setIsModalOpen(false);
  };

  const handleDeclineClick = () => {
    setIsDeclineModalOpen(true);
  };

  const handleDeclineModalClose = () => {
    setIsDeclineModalOpen(false);
  };

  const handleDeclineConfirm = async (token: string, reason: string) => {
    await declineInvitation({ token, reason });
    setIsDeclineModalOpen(false);
  };

  const getBrandContent = () => {
    return (
      <AuthBrandPanel>
        <i className="bx bx-user-plus auth-brand-panel__icon"></i>
        <h1 className="auth-brand-panel__title">Join PropertyFlow</h1>
        <p className="auth-brand-panel__subtitle">
          Accept your invitation to start managing properties
        </p>
        <ul className="auth-brand-panel__features">
          <li>
            <i className="bx bx-check-circle"></i>
            <span>Collaborate with your team</span>
          </li>
          <li>
            <i className="bx bx-check-circle"></i>
            <span>Access property management tools</span>
          </li>
          <li>
            <i className="bx bx-check-circle"></i>
            <span>Get started in minutes</span>
          </li>
        </ul>
      </AuthBrandPanel>
    );
  };

  const getFormHeader = () => {
    switch (currentStep) {
      case "invitation-details":
        return {
          title: "You're Invited!",
          subtitle: "Review your invitation details below",
        };
      case "account-setup":
        return {
          title: "Set Up Your Account",
          subtitle: "Complete your profile to get started",
        };
      default:
        return {
          title: "Invitation",
          subtitle: "Loading your invitation...",
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
        return invitation ? (
          <InvitationDetails
            invitation={invitation}
            onAccept={handleAcceptInvitation}
            onDecline={handleDeclineClick}
          />
        ) : null;
      case "account-setup":
        return invitation ? (
          <AccountSetup
            invitationData={invitation}
            onBack={handleBackToInvitation}
            handleSubmit={handleSubmit}
            handleFieldChange={handleFieldChange}
            handleDropdownChange={handleDropdownChange}
            isSubmitting={isSubmitting}
            isValid={isValid}
            values={values}
            errors={errors}
            touched={touched}
          />
        ) : null;
      default:
        return null;
    }
  };

  const formHeader = getFormHeader();

  return (
    <>
      <ModernAuthLayout brandContent={getBrandContent()}>
        <AuthFormPanel>
          {currentStep !== "loading" && (
            <div className="auth-form-panel__header">
              <h2 className="auth-form-panel__title">{formHeader.title}</h2>
              <p className="auth-form-panel__subtitle">{formHeader.subtitle}</p>
            </div>
          )}
          {renderContent()}
        </AuthFormPanel>
      </ModernAuthLayout>
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
      <DeclineInvitationModal
        isOpen={isDeclineModalOpen}
        invitation={invitation}
        onClose={handleDeclineModalClose}
        onConfirm={handleDeclineConfirm}
        isSubmitting={isDeclineSubmitting}
      />
    </>
  );
}
