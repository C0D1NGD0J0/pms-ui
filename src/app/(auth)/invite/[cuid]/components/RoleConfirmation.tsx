import React from "react";
import { Button } from "@components/FormElements";

import { mockRolePermissions, MockInvitationData } from "../../mockData";

interface RoleConfirmationProps {
  invitationData: MockInvitationData;
  onComplete: () => void;
}

export const RoleConfirmation: React.FC<RoleConfirmationProps> = ({
  invitationData,
  onComplete,
}) => {
  const permissions = mockRolePermissions[invitationData.role] || [];

  return (
    <>
      <div className="invitation-details-card">
        <div className="detail-row">
          <span className="detail-label">Your Role:</span>
          <span className="detail-value">
            <span className="role-badge">{invitationData.roleName}</span>
          </span>
        </div>
      </div>

      <div className="permissions-section">
        <div className="permissions-header">Your Permissions:</div>
        <div className="permissions-list">
          {permissions.map((permission, index) => (
            <div key={index} className="permission-item">
              <i className="bx bx-check permission-icon"></i>
              <span className="permission-text">{permission}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="action-fields">
        <Button
          label="Get Started"
          className="btn btn-primary"
          onClick={onComplete}
          icon={<i className="bx bx-check-circle"></i>}
        />
      </div>
    </>
  );
};
