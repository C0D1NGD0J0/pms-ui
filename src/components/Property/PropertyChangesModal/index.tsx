"use client";
import React, { useState } from "react";
import { useAuth } from "@store/auth.store";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "@components/FormElements/Modal";
import { Button } from "@components/FormElements/Button";
import { Textarea } from "@components/FormElements/TextArea";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { IUnifiedPermissions, IPropertyDocument } from "@src/interfaces";
import { useApproveProperty, useRejectProperty } from "@properties/hooks";

interface PropertyChangesModalProps {
  visible: boolean;
  property: IPropertyDocument | null;
  pendingChanges: any;
  requesterName: string;
  onSuccess: () => void;
  onCancel: () => void;
  permission?: IUnifiedPermissions; // Optional, will get from hook if not provided
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
  onSuccess,
  onCancel,
}) => {
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const permission = useUnifiedPermissions();
  const queryClient = useQueryClient();

  const { client } = useAuth();
  const cuid = client?.cuid || "";

  const approvePropertyMutation = useApproveProperty(cuid);
  const rejectPropertyMutation = useRejectProperty(cuid);

  const isLoading =
    approvePropertyMutation.isPending || rejectPropertyMutation.isPending;

  const invalidatePropertyQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["/properties", cuid],
    });
    queryClient.invalidateQueries({
      queryKey: ["property", cuid, property?.pid],
    });
  };

  const handleApprove = () => {
    if (!property?.pid) return;

    approvePropertyMutation.mutate(
      { pid: property.pid, notes: notes.trim() || undefined },
      {
        onSuccess: () => {
          setNotes("");
          setShowRejectForm(false);
          invalidatePropertyQueries();
          onSuccess();
        },
      }
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim() || !property?.pid) return;

    rejectPropertyMutation.mutate(
      { pid: property.pid, reason: rejectReason.trim() },
      {
        onSuccess: () => {
          setRejectReason("");
          setShowRejectForm(false);
          invalidatePropertyQueries();
          onSuccess();
        },
      }
    );
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

  const changes = Object.entries(pendingChanges.changes || {}).filter(
    ([key]) => !["updatedBy", "updatedAt", "displayName"].includes(key)
  );

  const formatFieldLabel = (key: string): string => {
    if (key.includes(".")) {
      const parts = key.split(".");
      const parent = parts[0];
      const field = parts[parts.length - 1];

      switch (parent) {
        case "specifications":
          return formatSpecificationField(field);
        case "fees":
          return formatFeeField(field);
        case "address":
          return formatAddressField(field);
        case "financialDetails":
          return formatFinancialField(field);
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
      taxAmount: "Tax Amount",
      managementFees: "Management Fees",
      securityDeposit: "Security Deposit",
      currency: "Currency",
    };
    return feeLabels[field] || formatGenericField(field);
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

  const formatFinancialField = (field: string): string => {
    const financialLabels: Record<string, string> = {
      marketValue: "Market Value",
      purchasePrice: "Purchase Price",
      assessedValue: "Assessed Value",
      annualTax: "Annual Property Tax",
    };
    return financialLabels[field] || formatGenericField(field);
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
      name: "Property Name",
      description: "Description",
      propertyType: "Property Type",
      status: "Status",
      occupancyStatus: "Occupancy Status",
      yearBuilt: "Year Built",
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
      <Modal.Header title="Property Changes Review" onClose={handleCancel} />

      <Modal.Content>
        <div className="property-changes-modal">
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
            <p>{`${changes.length} field${
              changes.length !== 1 ? "s" : ""
            } changed`}</p>
          </div>

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

          {!showRejectForm ? (
            permission.isManagerOrAbove && (
              <div className="action-area">
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
            )
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
