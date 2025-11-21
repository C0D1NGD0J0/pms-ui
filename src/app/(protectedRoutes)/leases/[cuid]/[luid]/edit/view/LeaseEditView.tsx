"use client";

import { UseFormReturnType } from "@mantine/form";
import { PageHeader } from "@components/PageElements";
import { Button, Modal } from "@components/FormElements";
import { LeaseFormValues } from "@interfaces/lease.interface";
import { AccordionContainer, AccordionItem } from "@components/Accordion";
import { DocumentPreview } from "@components/DocumentPreview/DocumentPreview";

interface LeaseEditViewProps {
  cuid: string;
  luid: string;
  leaseForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >;
  isSubmitting: boolean;
  html: string;
  isLoadingPreview: boolean;
  isFormValid: boolean;
  accordionItems: AccordionItem[];
  showCoTenantWarning: boolean;
  setShowCoTenantWarning: (show: boolean) => void;
  showPropertyChangeWarning: boolean;
  setShowPropertyChangeWarning: (show: boolean) => void;
  isEditing: boolean;
  editLuid: string | null;
  isLoadingEdit: boolean;
  editError: string | null;
  handleUpdateLease: () => void;
  handleConfirmPropertyChange: () => void;
  handleConfirmWithoutCoTenants: () => void;
  handlePreviewClick: () => void;
  handleCancel: () => void;
  clearPreview: () => void;
}

export function LeaseEditView({
  isSubmitting,
  html,
  isLoadingPreview,
  isFormValid,
  accordionItems,
  showCoTenantWarning,
  setShowCoTenantWarning,
  showPropertyChangeWarning,
  setShowPropertyChangeWarning,
  isEditing,
  editLuid,
  isLoadingEdit,
  editError,
  handleUpdateLease,
  handleConfirmPropertyChange,
  handleConfirmWithoutCoTenants,
  handlePreviewClick,
  handleCancel,
  clearPreview,
}: LeaseEditViewProps) {
  return (
    <div className="page-container">
      <div className="page add-lease">
        <PageHeader
          title="Edit Lease"
          headerBtn={
            <Button
              label="Back"
              className="btn btn-outline"
              onClick={handleCancel}
              icon={<i className="bx bx-arrow-back"></i>}
            />
          }
        />

        {isEditing && editLuid && !isLoadingEdit && (
          <div className="duplication-banner">
            <i className="bx bx-edit"></i>
            <div className="duplication-banner__content">
              <strong>Editing lease</strong>
              <span>Lease ID: {editLuid}</span>
              <span style={{ marginTop: "4px", fontSize: "13px" }}>
                Note: Tenant fields cannot be changed after lease creation
              </span>
            </div>
          </div>
        )}

        {isLoadingEdit && (
          <div className="loading-overlay">
            <i className="bx bx-loader-alt bx-spin"></i>
            <p>Loading lease data for editing...</p>
          </div>
        )}

        {editError && (
          <div className="error-banner">
            <i className="bx bx-error"></i>
            <span>Failed to load lease: {editError}</span>
          </div>
        )}

        <div className="resource-form">
          <AccordionContainer
            items={accordionItems}
            showSidebar={true}
            defaultActiveId="property"
            ariaLabel="Edit lease form sections"
            onChange={() => {}}
            showPreviewDrawer={isFormValid}
            previewTitle="Lease Review"
            renderPreview={() => {
              if (!html && !isLoadingPreview) {
                return (
                  <div className="empty-state">
                    <p className="mb-2 muted">
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
                  <div className="loading-overlay">
                    <i className="bx bx-loader-alt bx-spin"></i>
                    <p>Loading preview...</p>
                  </div>
                );
              }

              if (html) {
                return (
                  <div>
                    <div className="preview-actions mb-2">
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
                  label="Update Lease"
                  icon={<i className="bx bx-check"></i>}
                  onClick={handleUpdateLease}
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
              label={isSubmitting ? "Updating..." : "Update Lease"}
              icon={
                <i
                  className={
                    isSubmitting ? "bx bx-loader-alt bx-spin" : "bx bx-check"
                  }
                ></i>
              }
              onClick={handleUpdateLease}
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
                    If you proceed without adding co-tenants, they will not
                    appear on the lease document and will not have signing
                    rights.
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

        <Modal
          isOpen={showPropertyChangeWarning}
          onClose={() => setShowPropertyChangeWarning(false)}
          size="medium"
        >
          <Modal.Header title="Property Changed" />
          <Modal.Content>
            <div className="banner banner-warning">
              <div className="banner-content">
                <div className="banner-content__icon">
                  <i className="bx bx-info-circle"></i>
                </div>
                <div className="banner-content__info">
                  <p className="mb-2">
                    <strong>You have changed the property for this lease.</strong>
                  </p>
                  <p className="mb-2">
                    Please ensure you have reviewed and updated the financial
                    details (rent amount, security deposit, etc.) to match the
                    new property.
                  </p>
                  <p className="mb-0">
                    Do you want to proceed with this property change?
                  </p>
                </div>
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button
              className="btn btn-outline"
              label="Cancel"
              onClick={() => setShowPropertyChangeWarning(false)}
            />
            <Button
              className="btn btn-primary"
              label="Confirm & Continue"
              onClick={handleConfirmPropertyChange}
              disabled={isSubmitting}
            />
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
