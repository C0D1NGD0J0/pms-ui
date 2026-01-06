import React, { useState } from "react";
import {
  FormField,
  FormInput,
  FormLabel,
  Checkbox,
  TextArea,
  Button,
  Modal,
} from "@components/FormElements";

interface TerminateLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    terminationDate: string;
    reason: string;
    refundAmount?: number;
    notes?: string;
  }) => void;
  leaseStartDate: string;
  leaseEndDate: string;
  securityDeposit: number;
  isLoading?: boolean;
}

export const TerminateLeaseModal: React.FC<TerminateLeaseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  leaseStartDate,
  leaseEndDate,
  securityDeposit,
  isLoading = false,
}) => {
  const [terminationDate, setTerminationDate] = useState("");
  const [reason, setReason] = useState("");
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [showRefundSection, setShowRefundSection] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!terminationDate) {
      newErrors.terminationDate = "Termination date is required";
    } else {
      const termDate = new Date(terminationDate);
      const startDate = new Date(leaseStartDate);
      const endDate = new Date(leaseEndDate);

      if (termDate < startDate || termDate > endDate) {
        newErrors.terminationDate =
          "Termination date must be between lease start and end dates";
      }
    }

    if (!reason.trim()) {
      newErrors.reason = "Termination reason is required";
    }

    if (refundAmount && parseFloat(refundAmount) < 0) {
      newErrors.refundAmount = "Refund amount cannot be negative";
    }

    if (refundAmount && parseFloat(refundAmount) > securityDeposit) {
      newErrors.refundAmount = "Refund amount cannot exceed security deposit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onConfirm({
        terminationDate,
        reason,
        refundAmount: refundAmount ? parseFloat(refundAmount) : undefined,
        notes: notes || undefined,
      });
    }
  };

  const handleClose = () => {
    setTerminationDate("");
    setReason("");
    setRefundAmount("");
    setNotes("");
    setShowRefundSection(false);
    setErrors({});
    setTouched({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="medium">
      <Modal.Header title="Terminate Lease" onClose={handleClose} />
      <Modal.Content>
        <div className="modal-notice">
          <i className="bx bx-error-circle"></i>
          <p>
            Terminating a lease will change its status to &apos;terminated&apos;
            and trigger security deposit processing. This action cannot be
            undone.
          </p>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg: errors.terminationDate || "",
              touched: touched.terminationDate || false,
            }}
          >
            <FormLabel
              htmlFor="terminationDate"
              label="Termination Date"
              required
            />
            <FormInput
              type="date"
              name="terminationDate"
              id="terminationDate"
              value={terminationDate}
              onChange={(e) => {
                setTerminationDate(e.target.value);
                setTouched({ ...touched, terminationDate: true });
              }}
              min={leaseStartDate}
              max={leaseEndDate}
              disabled={isLoading}
              hasError={!!errors.terminationDate && touched.terminationDate}
            />
            <small className="field-hint">
              Must be between {new Date(leaseStartDate).toLocaleDateString()}{" "}
              and {new Date(leaseEndDate).toLocaleDateString()}
            </small>
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg: errors.reason || "",
              touched: touched.reason || false,
            }}
          >
            <FormLabel
              htmlFor="reason"
              label="Reason for Termination"
              required
            />
            <TextArea
              id="reason"
              name="reason"
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setTouched({ ...touched, reason: true });
              }}
              placeholder="Enter the reason for terminating this lease..."
              disabled={isLoading}
            />
          </FormField>
        </div>

        <Checkbox
          id="showRefund"
          name="showRefund"
          checked={showRefundSection}
          onChange={(e) => setShowRefundSection(e.target.checked)}
          label="Process Security Deposit Refund"
          disabled={isLoading}
        />

        {showRefundSection && (
          <div className="form-fields">
            <FormField
              error={{
                msg: errors.refundAmount || "",
                touched: touched.refundAmount || false,
              }}
            >
              <FormLabel
                htmlFor="refundAmount"
                label="Security Deposit Refund Amount"
              />
              <FormInput
                type="number"
                id="refundAmount"
                name="refundAmount"
                value={refundAmount}
                onChange={(e) => {
                  setRefundAmount(e.target.value);
                  setTouched({ ...touched, refundAmount: true });
                }}
                min="0"
                max={securityDeposit.toString()}
                step="0.01"
                placeholder="0.00"
                disabled={isLoading}
                hasError={!!errors.refundAmount && touched.refundAmount}
              />
              <small className="field-hint">
                Maximum refund: ${(securityDeposit / 100).toFixed(2)}
              </small>
            </FormField>
          </div>
        )}

        <div className="form-fields">
          <FormField error={{ msg: "", touched: false }}>
            <FormLabel htmlFor="notes" label="Additional Notes (Optional)" />
            <TextArea
              id="notes"
              name="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this termination..."
              disabled={isLoading}
            />
          </FormField>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Button
          type="button"
          label="Cancel"
          className="btn-default"
          onClick={handleClose}
          icon={<i className="bx bx-x"></i>}
          disabled={isLoading}
        />
        <Button
          type="button"
          className="btn-danger"
          label={isLoading ? "Terminating..." : "Terminate Lease"}
          icon={
            <i
              className={
                isLoading
                  ? "bx bx-loader-alt bx-spin"
                  : "bx bx-error-circle ghost"
              }
            ></i>
          }
          onClick={handleSubmit}
          disabled={isLoading}
        />
      </Modal.Footer>
    </Modal>
  );
};
