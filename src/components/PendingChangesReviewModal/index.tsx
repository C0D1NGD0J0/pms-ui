"use client";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { IUnifiedPermissions } from "@src/interfaces";
import { Modal } from "@components/FormElements/Modal";
import { Button } from "@components/FormElements/Button";
import { TextArea } from "@components/FormElements/TextArea";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";

export type EntityType = "property" | "lease" | "unit";

interface PendingChangesReviewModalProps {
  visible: boolean;
  entityType: EntityType;
  entity: any;
  pendingChanges: any;
  requesterName: string;
  onSuccess: () => void;
  onCancel: () => void;
  onApprove: (notes?: string) => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  isLoading?: boolean;
  permission?: IUnifiedPermissions;
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

export const PendingChangesReviewModal: React.FC<
  PendingChangesReviewModalProps
> = ({
  visible,
  entityType,
  entity,
  pendingChanges,
  requesterName,
  onSuccess,
  onCancel,
  onApprove,
  onReject,
  isLoading = false,
}) => {
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const permission = useUnifiedPermissions();

  const handleApprove = async () => {
    try {
      await onApprove(notes.trim() || undefined);
      setNotes("");
      setShowRejectForm(false);
      onSuccess();
    } catch (error) {
      console.error("Error approving changes:", error);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;

    try {
      await onReject(rejectReason.trim());
      setRejectReason("");
      setShowRejectForm(false);
      onSuccess();
    } catch (error) {
      console.error("Error rejecting changes:", error);
    }
  };

  const handleCancel = () => {
    setNotes("");
    setRejectReason("");
    setShowRejectForm(false);
    onCancel();
  };

  if (!entity || !pendingChanges) {
    return null;
  }

  const changes = Object.entries(pendingChanges.changes || {}).filter(
    ([key]) => !["updatedBy", "updatedAt", "displayName"].includes(key)
  );

  const getEntityName = (): string => {
    switch (entityType) {
      case "property":
        return entity.name || "Property";
      case "lease":
        return `Lease #${entity.leaseNumber}` || "Lease";
      case "unit":
        return entity.unitNumber || "Unit";
      default:
        return "Entity";
    }
  };

  const getEntityTitle = (): string => {
    switch (entityType) {
      case "property":
        return "Property Changes Review";
      case "lease":
        return "Lease Changes Review";
      case "unit":
        return "Unit Changes Review";
      default:
        return "Changes Review";
    }
  };

  const formatFieldLabel = (key: string): string => {
    if (key.includes(".")) {
      const parts = key.split(".");
      const parent = parts[0];
      const field = parts[parts.length - 1];

      switch (parent) {
        case "specifications":
          return formatSpecificationField(field);
        case "fees":
        case "financialDetails":
          return formatFeeField(field);
        case "address":
          return formatAddressField(field);
        case "duration":
          return formatDurationField(field);
        case "tenant":
        case "coTenants":
          return formatTenantField(field);
        case "property":
          return formatPropertyField(field);
        case "amenities":
          return formatAmenityField(field);
        default:
          return formatGenericNestedField(field);
      }
    }

    return formatPrimitiveField(key);
  };

  const formatSpecificationField = (field: string): string => {
    const specLabels: Record<string, string> = {
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      totalArea: "Total Area",
      lotSize: "Lot Size",
      floors: "Number of Floors",
      garageSpaces: "Garage Spaces",
      maxOccupants: "Maximum Occupants",
      rooms: "Total Rooms",
    };
    return specLabels[field] || formatGenericField(field);
  };

  const formatFeeField = (field: string): string => {
    const feeLabels: Record<string, string> = {
      rentalAmount: "Rental Amount",
      monthlyRent: "Monthly Rent",
      taxAmount: "Tax Amount",
      managementFees: "Management Fees",
      securityDeposit: "Security Deposit",
      currency: "Currency",
      rentDueDay: "Rent Due Day",
    };
    return feeLabels[field] || formatGenericField(field);
  };

  const formatDurationField = (field: string): string => {
    const durationLabels: Record<string, string> = {
      startDate: "Lease Start Date",
      endDate: "Lease End Date",
      leaseTerm: "Lease Term",
      renewalOptions: "Renewal Options",
    };
    return durationLabels[field] || formatGenericField(field);
  };

  const formatTenantField = (field: string): string => {
    const tenantLabels: Record<string, string> = {
      fullname: "Tenant Name",
      email: "Tenant Email",
      phone: "Tenant Phone",
      emergencyContact: "Emergency Contact",
    };
    return tenantLabels[field] || formatGenericField(field);
  };

  const formatPropertyField = (field: string): string => {
    const propertyLabels: Record<string, string> = {
      name: "Property Name",
      address: "Property Address",
    };
    return propertyLabels[field] || formatGenericField(field);
  };

  const formatAddressField = (field: string): string => {
    const addressLabels: Record<string, string> = {
      fullAddress: "Full Address",
      street: "Street Address",
      city: "City",
      state: "State/Province",
      country: "Country",
      zipCode: "ZIP/Postal Code",
    };
    return addressLabels[field] || formatGenericField(field);
  };

  const formatAmenityField = (field: string): string => {
    const amenityLabels: Record<string, string> = {
      parking: "Parking Available",
      pool: "Swimming Pool",
      gym: "Fitness Center",
      laundry: "Laundry Facilities",
      elevator: "Elevator",
      balcony: "Balcony/Patio",
      storage: "Storage Unit",
      petFriendly: "Pet Friendly",
    };
    return amenityLabels[field] || formatGenericField(field);
  };

  const formatGenericNestedField = (field: string): string => {
    return formatGenericField(field);
  };

  const formatPrimitiveField = (key: string): string => {
    const primitiveLabels: Record<string, string> = {
      name: `${
        entityType === "property"
          ? "Property"
          : entityType === "lease"
            ? "Lease"
            : "Unit"
      } Name`,
      description: "Description",
      propertyType: "Property Type",
      status: "Status",
      occupancyStatus: "Occupancy Status",
      yearBuilt: "Year Built",
      leaseNumber: "Lease Number",
      unitNumber: "Unit Number",
    };
    return primitiveLabels[key] || formatGenericField(key);
  };

  const formatGenericField = (field: string): string => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  return (
    <Modal isOpen={visible} onClose={handleCancel} size="large">
      <Modal.Header title={getEntityTitle()} onClose={handleCancel} />

      <Modal.Content>
        <div className="entity-changes-modal">
          <div className="header-info">
            <h3>{getEntityName()}</h3>
            <p className="requester-info">
              Requested by <strong>{requesterName}</strong> •{" "}
              {formatDistanceToNow(new Date(entity.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          <div className="changes-summary">
            <p>{`${changes.length} field${
              changes.length !== 1 ? "s" : ""
            } changed`}</p>
          </div>

          <div className="changes-list">
            {changes.map(([key, proposedValue]) => (
              <FieldChange
                key={key}
                label={formatFieldLabel(key)}
                currentValue={getNestedValue(entity, key)}
                proposedValue={proposedValue}
              />
            ))}
          </div>

          {!showRejectForm ? (
            permission.isManagerOrAbove && (
              <div className="action-area">
                <div className="approval-notes">
                  <label>Approval Notes (Optional)</label>
                  <TextArea
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
            )
          ) : (
            <div className="reject-form">
              <label>
                <strong>Rejection Reason (Required)</strong>
              </label>
              <TextArea
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
            {permission.isManagerOrAbove && (
              <>
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
            )}
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
