"use client";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@components/Badge/Badge";
import { Modal } from "@components/FormElements/Modal";
import { Button } from "@components/FormElements/Button";
import { Textarea } from "@components/FormElements/TextArea";
import { IPropertyDocument } from "@interfaces/property.interface";

interface PropertyChangesModalProps {
  visible: boolean;
  property: IPropertyDocument | null;
  pendingChanges: any;
  requesterName: string;
  onApprove: (notes?: string) => void;
  onReject: (reason: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FieldChangeProps {
  label: string;
  currentValue: any;
  proposedValue: any;
}

const FieldChange: React.FC<FieldChangeProps> = ({
  label,
  currentValue,
  proposedValue,
}) => {
  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "Not set";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <div className="field-change">
      <div className="field-label">
        <strong>{label}</strong>
      </div>
      <div className="field-comparison">
        <div className="current-value">
          <div className="value-label">Current</div>
          <div className="value-content current">
            {formatValue(currentValue)}
          </div>
        </div>
        <div className="arrow">→</div>
        <div className="proposed-value">
          <div className="value-label">Proposed</div>
          <div className="value-content proposed">
            {formatValue(proposedValue)}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PropertyChangesModal: React.FC<PropertyChangesModalProps> = ({
  visible,
  property,
  pendingChanges,
  requesterName,
  onApprove,
  onReject,
  onCancel,
  isLoading = false,
}) => {
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = () => {
    onApprove(notes.trim() || undefined);
    setNotes("");
    setShowRejectForm(false);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onReject(rejectReason.trim());
    setRejectReason("");
    setShowRejectForm(false);
  };

  const handleCancel = () => {
    setNotes("");
    setRejectReason("");
    setShowRejectForm(false);
    onCancel();
  };

  if (!property || !pendingChanges) {
    return null;
  }

  // Extract field changes
  const changes = Object.entries(pendingChanges.changes || {}).filter(
    ([key]) => !["updatedBy", "updatedAt"].includes(key)
  );

  const formatFieldLabel = (key: string): string => {
    const fieldLabels: Record<string, string> = {
      name: "Property Name",
      description: "Description",
      propertyType: "Property Type",
      status: "Status",
      occupancyStatus: "Occupancy Status",
      yearBuilt: "Year Built",
      "fees.rentalAmount": "Rental Amount",
      "fees.taxAmount": "Tax Amount",
      "fees.managementFees": "Management Fees",
      "fees.securityDeposit": "Security Deposit",
      "specifications.bedrooms": "Bedrooms",
      "specifications.bathrooms": "Bathrooms",
      "specifications.totalArea": "Total Area",
      "specifications.lotSize": "Lot Size",
      "address.fullAddress": "Address",
      "financialDetails.marketValue": "Market Value",
      "financialDetails.purchasePrice": "Purchase Price",
    };

    return (
      fieldLabels[key] ||
      key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
    );
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  console.log("Rendering PropertyChangesModal with changes:", property);
  return (
    <Modal isOpen={visible} onClose={handleCancel} size="large">
      <Modal.Header title="Property Changes Review" onClose={handleCancel} />

      <Modal.Content>
        <div className="property-changes-modal">
          {/* Header Info */}
          <div className="header-info">
            <h3>{property.name}</h3>
            <p className="requester-info">
              Requested by <strong>{requesterName}</strong> •{" "}
              {formatDistanceToNow(new Date(property.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          <div className="changes-summary">
            <Badge
              variant="warning"
              text={`${changes.length} field${
                changes.length !== 1 ? "s" : ""
              } changed`}
            />
          </div>

          {/* Changes List */}
          <div className="changes-list">
            {changes.map(([key, proposedValue]) => (
              <FieldChange
                key={key}
                label={formatFieldLabel(key)}
                currentValue={getNestedValue(property, key)}
                proposedValue={proposedValue}
              />
            ))}
          </div>

          {/* Action Area */}
          {!showRejectForm ? (
            <div className="action-area">
              {/* Optional Approval Notes */}
              <div className="approval-notes">
                <label>Approval Notes (Optional)</label>
                <Textarea
                  id="approval-notes"
                  name="approvalNotes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  rows={3}
                  maxLength={500}
                />
              </div>
            </div>
          ) : (
            <div className="reject-form">
              <label>
                <strong>Rejection Reason (Required)</strong>
              </label>
              <Textarea
                id="rejection-reason"
                name="rejectionReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejecting these changes..."
                rows={4}
                maxLength={500}
                required
              />
            </div>
          )}
        </div>
      </Modal.Content>

      <Modal.Footer>
        {!showRejectForm ? (
          <>
            <Button
              label="Cancel"
              onClick={handleCancel}
              disabled={isLoading}
              className="btn-default"
            />
            <Button
              label="Reject Changes"
              onClick={() => setShowRejectForm(true)}
              disabled={isLoading}
              className="btn-danger"
            />
            <Button
              label="Approve Changes"
              onClick={handleApprove}
              disabled={isLoading}
              className="btn-primary"
            />
          </>
        ) : (
          <>
            <Button
              label="Back"
              onClick={() => setShowRejectForm(false)}
              disabled={isLoading}
              className="btn-default"
            />
            <Button
              label="Confirm Rejection"
              onClick={handleReject}
              disabled={!rejectReason.trim() || isLoading}
              className="btn-danger"
            />
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};
