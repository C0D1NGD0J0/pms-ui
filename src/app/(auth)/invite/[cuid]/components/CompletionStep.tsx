import React from "react";
import { Button } from "@components/FormElements";

import { MockInvitationData } from "../../mockData";

interface CompletionStepProps {
  invitationData: MockInvitationData;
  onFinish: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  invitationData,
  onFinish,
}) => {
  return (
    <div className="success-state">
      <div className="success-icon">
        <i className="bx bx-check-circle"></i>
      </div>

      <div className="success-title">
        Welcome to {invitationData.organizationName}!
      </div>

      <div className="success-message">
        Your account has been successfully created and activated. You now have
        access to the Property Management System with{" "}
        <strong>{invitationData.roleName}</strong> privileges.
      </div>

      <div className="permissions-section">
        <div className="permissions-header">What&apos;s Next?</div>
        <div className="permissions-list">
          <div className="permission-item">
            <i className="bx bx-check permission-icon"></i>
            <span className="permission-text">
              Complete your profile information
            </span>
          </div>
          <div className="permission-item">
            <i className="bx bx-check permission-icon"></i>
            <span className="permission-text">
              Explore the dashboard and available features
            </span>
          </div>
          <div className="permission-item">
            <i className="bx bx-check permission-icon"></i>
            <span className="permission-text">
              Set up your notification preferences
            </span>
          </div>
          {invitationData.role === "manager" && (
            <div className="permission-item">
              <i className="bx bx-check permission-icon"></i>
              <span className="permission-text">
                Review assigned properties and units
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="invitation-details-card">
        <div className="detail-row">
          <span className="detail-label">Organization:</span>
          <span className="detail-value">
            {invitationData.organizationName}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Your Role:</span>
          <span className="detail-value">
            <span className="role-badge">{invitationData.roleName}</span>
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{invitationData.inviteeEmail}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Invited By:</span>
          <span className="detail-value">{invitationData.inviterName}</span>
        </div>
      </div>

      <div className="action-fields">
        <Button
          label="Continue to Dashboard"
          className="btn btn-primary btn-lg"
          onClick={onFinish}
          icon={<i className="bx bx-arrow-right"></i>}
        />
      </div>
    </div>
  );
};
