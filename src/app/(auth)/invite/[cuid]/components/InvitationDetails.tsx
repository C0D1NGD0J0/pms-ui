import React from "react";
import { Button } from "@components/FormElements";
import { IInvitationDocument } from "@src/interfaces";

interface InvitationDetailsProps {
  invitation: IInvitationDocument;
  onAccept: () => void;
  onDecline: () => void;
}

export const InvitationDetails: React.FC<InvitationDetailsProps> = ({
  invitation,
  onAccept,
  onDecline,
}) => {
  const formatStartDate = (dateString?: string | Date) => {
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
          <span className="detail-value">{invitation.invitedBy.fullname}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Role:</span>
          <span className="detail-value">
            <span className="role-badge">{invitation.role}</span>
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Organization:</span>
          <span className="detail-value">
            {invitation.role === "vendor" &&
            invitation.metadata?.vendorInfo?.companyName
              ? invitation.metadata.vendorInfo.companyName
              : invitation.clientId?.name || "Organization"}
          </span>
        </div>
        {invitation.metadata?.expectedStartDate && (
          <div className="detail-row">
            <span className="detail-label">Expected Start:</span>
            <span className="detail-value">
              {formatStartDate(invitation.metadata.expectedStartDate)}
            </span>
          </div>
        )}
      </div>

      {invitation.metadata?.inviteMessage && (
        <div className="personal-message">
          <div className="message-header">Personal Message:</div>
          <div className="message-text">
            {invitation.metadata.inviteMessage}
          </div>
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
