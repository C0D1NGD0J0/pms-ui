"use client";
import React from "react";
import { Button, Modal } from "@components/FormElements";

export type UserType = "employee" | "tenant" | "vendor";

interface DeactivateUserModalProps {
  isOpen: boolean;
  userName: string;
  userType: UserType;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  /** Optional: Show error message (e.g., for active lease blocking) */
  errorMessage?: string;
  /** Optional: Action button for error state (e.g., "View Leases") */
  errorAction?: {
    label: string;
    onClick: () => void;
  };
  /** Optional: Additional warnings (e.g., for primary vendors) */
  warnings?: string[];
}

const getUserTypeLabel = (type: UserType) => {
  switch (type) {
    case "employee":
      return "Employee";
    case "tenant":
      return "Tenant";
    case "vendor":
      return "Vendor";
    default:
      return "User";
  }
};

const getActionsList = (type: UserType, warnings?: string[]) => {
  const baseActions = [
    "Disconnect them from this client",
    "Mark their account as inactive (isConnected: false)",
    "Preserve all their data for compliance and audit purposes",
    "They will NOT be able to login to this account",
  ];

  const typeSpecificActions: Record<UserType, string[]> = {
    employee: ["Free up 1 seat in your subscription"],
    tenant: ["Validate no active leases exist"],
    vendor: [],
  };

  const actions = [...typeSpecificActions[type], ...baseActions];

  if (warnings && warnings.length > 0) {
    return [...warnings, ...actions];
  }

  return actions;
};

export const DeactivateUserModal: React.FC<DeactivateUserModalProps> = ({
  isOpen,
  userName,
  userType,
  onClose,
  onConfirm,
  isSubmitting = false,
  errorMessage,
  errorAction,
  warnings,
}) => {
  const userLabel = getUserTypeLabel(userType);
  const hasWarnings = warnings && warnings.length > 0;
  const hasError = !!errorMessage;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <Modal.Header
        title={hasError ? `Cannot Remove ${userLabel}` : `Remove ${userLabel}`}
        onClose={onClose}
      />
      <Modal.Content>
        <div className="modal-body">
          {hasError ? (
            <>
              <div
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "var(--color-danger-light, #fee)",
                  borderLeft: "4px solid var(--danger-color, #f44)",
                  borderRadius: "4px",
                }}
              >
                <p style={{ margin: 0, color: "var(--danger-color, #f44)" }}>
                  {errorMessage}
                </p>
              </div>
            </>
          ) : (
            <>
              <p style={{ marginBottom: "1rem" }}>
                Are you sure you want to remove <strong>{userName}</strong>?
              </p>

              {hasWarnings && (
                <div
                  style={{
                    padding: "1rem",
                    marginBottom: "1rem",
                    backgroundColor: "var(--color-warning-light, #fff3cd)",
                    borderLeft: "4px solid var(--warning-color, #ffc107)",
                    borderRadius: "4px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 0.5rem 0",
                      fontWeight: "bold",
                      color: "var(--warning-color, #ffc107)",
                    }}
                  >
                    ⚠️ Warning:
                  </p>
                  {warnings.map((warning, index) => (
                    <p key={index} style={{ margin: "0.25rem 0" }}>
                      {warning}
                    </p>
                  ))}
                </div>
              )}

              <p style={{ fontSize: "0.9rem" }}>This action will:</p>
              <ul
                style={{
                  marginTop: "0.5rem",
                  paddingLeft: "1.5rem",
                  fontSize: "0.9rem",
                }}
              >
                {getActionsList(userType, hasWarnings ? warnings : undefined).map(
                  (action, index) => (
                    <li key={index}>{action}</li>
                  )
                )}
              </ul>
              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "0.85rem",
                  fontStyle: "italic",
                  color: "var(--text-secondary)",
                }}
              >
                Note: You can reconnect this {userType} later if needed.
              </p>
            </>
          )}
        </div>
      </Modal.Content>
      <Modal.Footer>
        {hasError ? (
          <>
            {errorAction && (
              <Button
                label={errorAction.label}
                className="btn-primary"
                onClick={errorAction.onClick}
              />
            )}
            <Button label="Close" className="btn-outline" onClick={onClose} />
          </>
        ) : (
          <>
            <Button
              label="Cancel"
              className="btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            />
            <Button
              label={isSubmitting ? "Removing..." : `Remove ${userLabel}`}
              className={hasWarnings ? "btn-warning" : "btn-danger"}
              onClick={onConfirm}
              disabled={isSubmitting}
              icon={<i className="bx bx-user-x"></i>}
            />
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};
