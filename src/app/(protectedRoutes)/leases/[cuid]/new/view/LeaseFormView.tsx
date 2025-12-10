"use client";

import { UseFormReturnType } from "@mantine/form";
import { PageHeader } from "@components/PageElements";
import { Button, Modal } from "@components/FormElements";
import { LeaseFormValues } from "@interfaces/lease.interface";
import { AccordionContainer, AccordionItem } from "@components/Accordion";

interface LeaseFormViewProps {
  cuid: string;
  leaseForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >;
  isSubmitting: boolean;
  isFormValid: boolean;
  accordionItems: AccordionItem[];
  showCoTenantWarning: boolean;
  setShowCoTenantWarning: (show: boolean) => void;
  isDuplicating: boolean;
  duplicateSource: string | null;
  duplicateError: string | null;
  handleCreateLease: () => void;
  handleConfirmWithoutCoTenants: () => void;
  handleCancel: () => void;
}

export function LeaseFormView({
  cuid,
  isSubmitting,
  isFormValid,
  accordionItems,
  showCoTenantWarning,
  setShowCoTenantWarning,
  isDuplicating,
  duplicateSource,
  duplicateError,
  handleCreateLease,
  handleConfirmWithoutCoTenants,
  handleCancel,
}: LeaseFormViewProps) {
  return (
    <div className="page-container">
      <div className="page add-lease">
        <PageHeader
          title="Create New Lease"
          headerBtn={
            <Button
              label="Back"
              className="btn btn-outline"
              onClick={handleCancel}
              icon={<i className="bx bx-arrow-back"></i>}
            />
          }
        />

        {duplicateSource && !isDuplicating && (
          <div className="duplication-banner">
            <i className="bx bx-copy"></i>
            <div className="duplication-banner__content">
              <strong>Duplicating lease</strong>
              <span>Based on: {duplicateSource}</span>
            </div>
            <Button
              label="Start Fresh"
              className="btn btn-sm btn-primary"
              onClick={() => (window.location.href = `/leases/${cuid}/new`)}
            />
          </div>
        )}

        {isDuplicating && (
          <div className="loading-overlay">
            <i className="bx bx-loader-alt bx-spin"></i>
            <p>Loading lease data for duplication...</p>
          </div>
        )}

        {duplicateError && (
          <div className="error-banner">
            <i className="bx bx-error"></i>
            <span>Failed to load lease: {duplicateError}</span>
          </div>
        )}

        <div className="resource-form">
          <AccordionContainer
            items={accordionItems}
            showSidebar={true}
            defaultActiveId="property"
            ariaLabel="Create lease form sections"
            onChange={() => {}}
            showPreviewDrawer={false}
          />

          <div className="form-actions">
            <Button
              className="btn btn-outline"
              label="Cancel"
              icon={<i className="bx bx-x"></i>}
              onClick={handleCancel}
            />
            <Button
              className="btn btn-primary"
              label={isSubmitting ? "Creating..." : "Create Lease"}
              icon={
                <i
                  className={
                    isSubmitting ? "bx bx-loader-alt bx-spin" : "bx bx-check"
                  }
                ></i>
              }
              onClick={handleCreateLease}
              disabled={isSubmitting || !isFormValid}
            />
          </div>
        </div>

        <Modal
          isOpen={showCoTenantWarning}
          onClose={() => setShowCoTenantWarning(false)}
          size="medium"
        >
          <Modal.Header title="No Co-Tenants Added" />
          <Modal.Content>
            <div className="banner banner-warning">
              <div className="banner-content">
                <div className="banner-content__icon">
                  <i className="bx bx-info-circle"></i>
                </div>
                <div className="banner-content__info">
                  <p className="mb-2">
                    You haven&apos;t added any co-tenants to this lease.
                  </p>
                  <p className="mb-0">
                    If you proceed without adding co-tenants, they will not appear
                    on the lease document and will not have signing rights.
                  </p>
                </div>
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button
              className="btn btn-outline"
              label="Go Back"
              onClick={() => setShowCoTenantWarning(false)}
            />
            <Button
              className="btn btn-primary"
              label="Continue Without Co-Tenants"
              onClick={handleConfirmWithoutCoTenants}
              disabled={isSubmitting}
            />
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
