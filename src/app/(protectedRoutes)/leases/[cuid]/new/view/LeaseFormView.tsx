"use client";

import { PageHeader } from "@components/PageElements";
import { Button, Modal } from "@components/FormElements";
import { AccordionContainer, AccordionItem } from "@components/Accordion";
import { DocumentPreview } from "@components/DocumentPreview/DocumentPreview";

interface LeaseFormViewProps {
  cuid: string;
  leaseForm: any;
  isSubmitting: boolean;
  html: string;
  isLoadingPreview: boolean;
  isFormValid: boolean;
  accordionItems: AccordionItem[];
  showCoTenantWarning: boolean;
  setShowCoTenantWarning: (show: boolean) => void;
  isDuplicating: boolean;
  duplicateSource: string | null;
  duplicateError: string | null;
  handleCreateLease: () => void;
  handleConfirmWithoutCoTenants: () => void;
  handlePreviewClick: () => void;
  handleCancel: () => void;
  clearPreview: () => void;
}

export function LeaseFormView({
  cuid,
  isSubmitting,
  html,
  isLoadingPreview,
  isFormValid,
  accordionItems,
  showCoTenantWarning,
  setShowCoTenantWarning,
  isDuplicating,
  duplicateSource,
  duplicateError,
  handleCreateLease,
  handleConfirmWithoutCoTenants,
  handlePreviewClick,
  handleCancel,
  clearPreview,
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
            showPreviewDrawer={isFormValid}
            previewTitle="Lease Review"
            renderPreview={() => {
              if (!html && !isLoadingPreview) {
                return (
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    <p
                      style={{
                        marginBottom: "1rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      Click &quot;Generate Preview&quot; to view the lease
                      template with your data
                    </p>
                    <Button
                      className="btn btn-primary"
                      label="Generate Preview"
                      icon={<i className="bx bx-file-blank"></i>}
                      onClick={handlePreviewClick}
                      disabled={!isFormValid}
                    />
                  </div>
                );
              }

              if (isLoadingPreview) {
                return (
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    <i
                      className="bx bx-loader-alt bx-spin"
                      style={{ fontSize: "2rem" }}
                    ></i>
                    <p style={{ marginTop: "1rem" }}>Loading preview...</p>
                  </div>
                );
              }

              if (html) {
                return (
                  <div>
                    <div style={{ marginBottom: "1rem", textAlign: "right" }}>
                      <Button
                        className="btn btn-outline btn-sm"
                        label="Refresh Preview"
                        icon={<i className="bx bx-refresh"></i>}
                        onClick={handlePreviewClick}
                      />
                    </div>
                    <DocumentPreview
                      type="html"
                      content={html}
                      height="600px"
                      renderMode="iframe"
                    />
                  </div>
                );
              }

              return null;
            }}
            previewActions={
              html ? (
                <Button
                  className="btn btn-primary btn-block"
                  label="Create Lease"
                  icon={<i className="bx bx-check"></i>}
                  onClick={handleCreateLease}
                  disabled={isSubmitting || !isFormValid}
                />
              ) : null
            }
            onPreviewToggle={(isOpen) => {
              if (!isOpen) {
                clearPreview();
              }
            }}
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
            <div
              style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
            >
              <i
                className="bx bx-info-circle"
                style={{ fontSize: "2rem", color: "var(--warning)" }}
              ></i>
              <div>
                <p style={{ marginBottom: "1rem" }}>
                  You haven&apos;t added any co-tenants to this lease.
                </p>
                <p style={{ marginBottom: "0" }}>
                  If you proceed without adding co-tenants, they will not appear
                  on the lease document and will not have signing rights.
                </p>
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
