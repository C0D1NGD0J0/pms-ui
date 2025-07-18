"use client";
import React from "react";

interface InvitationPreviewProps {
  data: Array<{
    inviteeEmail: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    inviteMessage?: string;
    expectedStartDate?: string;
    csub?: string;
  }>;
}

export function InvitationPreview({ data }: InvitationPreviewProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Not specified";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "role-badge admin";
      case "EMPLOYEE":
        return "role-badge employee";
      case "VENDOR":
        return "role-badge vendor";
      case "TENANT":
        return "role-badge tenant";
      case "LANDLORD":
        return "role-badge landlord";
      default:
        return "role-badge";
    }
  };

  return (
    <div className="invitation-preview">
      <div className="preview-header">
        <h4>Preview: {data.length} Invitation(s) Ready to Send</h4>
        <p>Review the parsed data below before confirming.</p>
      </div>

      <div className="preview-table-container">
        <table className="preview-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Start Date</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {data.map((invitation, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <div className="user-name">
                    <strong>
                      {invitation.firstName} {invitation.lastName}
                    </strong>
                  </div>
                </td>
                <td>
                  <div className="user-email">{invitation.inviteeEmail}</div>
                </td>
                <td>
                  <span className={getRoleBadgeClass(invitation.role)}>
                    {invitation.role}
                  </span>
                </td>
                <td>
                  <div className="user-phone">
                    {invitation.phoneNumber || "—"}
                  </div>
                </td>
                <td>
                  <div className="start-date">
                    {formatDate(invitation.expectedStartDate)}
                  </div>
                </td>
                <td>
                  <div className="invite-message">
                    {invitation.inviteMessage ? (
                      <span title={invitation.inviteMessage}>
                        {invitation.inviteMessage.length > 30
                          ? `${invitation.inviteMessage.substring(0, 30)}...`
                          : invitation.inviteMessage}
                      </span>
                    ) : (
                      "—"
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="preview-summary">
        <div className="summary-stats">
          <div className="stat-group">
            <div className="stat-item">
              <span className="stat-label">Total Invitations:</span>
              <span className="stat-value">{data.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Roles:</span>
              <span className="stat-value">
                {[...new Set(data.map((d) => d.role))].join(", ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .invitation-preview {
          margin-top: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          background: #f9f9f9;
        }

        .preview-header h4 {
          margin: 0 0 8px 0;
          color: #333;
          font-weight: 600;
        }

        .preview-header p {
          margin: 0 0 16px 0;
          color: #666;
          font-size: 14px;
        }

        .preview-table-container {
          overflow-x: auto;
          margin-bottom: 16px;
        }

        .preview-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .preview-table th {
          background: #f5f5f5;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          color: #555;
          border-bottom: 1px solid #e0e0e0;
        }

        .preview-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 13px;
        }

        .preview-table tr:last-child td {
          border-bottom: none;
        }

        .user-name strong {
          color: #333;
        }

        .user-email {
          color: #0066cc;
          font-family: monospace;
          font-size: 12px;
        }

        .role-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .role-badge.admin {
          background: #ff6b6b;
          color: white;
        }

        .role-badge.employee {
          background: #4ecdc4;
          color: white;
        }

        .role-badge.vendor {
          background: #45b7d1;
          color: white;
        }

        .role-badge.tenant {
          background: #96ceb4;
          color: white;
        }

        .role-badge.landlord {
          background: #feca57;
          color: #333;
        }

        .user-phone,
        .start-date,
        .invite-message {
          color: #666;
          font-size: 12px;
        }

        .preview-summary {
          padding-top: 16px;
          border-top: 1px solid #e0e0e0;
        }

        .summary-stats {
          display: flex;
          gap: 20px;
        }

        .stat-item {
          display: flex;
          gap: 8px;
        }

        .stat-label {
          color: #666;
          font-weight: 500;
        }

        .stat-value {
          color: #333;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
