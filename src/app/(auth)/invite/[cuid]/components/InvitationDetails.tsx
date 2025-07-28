import React from "react";
import { Button } from "@components/FormElements";

import { MockInvitationData } from "../../mockData";

interface InvitationDetailsProps {
  invitationData: MockInvitationData;
  onAccept: () => void;
  onDecline: () => void;
}

export const InvitationDetails: React.FC<InvitationDetailsProps> = ({
  invitationData,
  onAccept,
  onDecline,
}) => {
  const formatStartDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="invitation-details-card">
        <div className="detail-row">
          <span className="detail-label">Invited by:</span>
          <span className="detail-value">{invitationData.inviterName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Role:</span>
          <span className="detail-value">
            <span className="role-badge">{invitationData.roleName}</span>
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Organization:</span>
          <span className="detail-value">
            {invitationData.organizationName}
          </span>
        </div>
        {invitationData.startDate && (
          <div className="detail-row">
            <span className="detail-label">Expected Start:</span>
            <span className="detail-value">
              {formatStartDate(invitationData.startDate)}
            </span>
          </div>
        )}
      </div>

      {invitationData.personalMessage && (
        <div className="personal-message">
          <div className="message-header">Personal Message:</div>
          <div className="message-text">{invitationData.personalMessage}</div>
        </div>
      )}

      <div className="flex-row flex-end">
        <Button
          label="Decline"
          className="btn btn-outline"
          onClick={onDecline}
          icon={<i className="bx bx-x"></i>}
        />
        <Button
          label="Accept Invitation"
          className="btn btn-primary"
          onClick={onAccept}
          icon={<i className="bx bx-check"></i>}
        />
      </div>
    </>
  );
};
