"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@components/PageElements";
import { Button, Modal } from "@components/FormElements";
import { AccordionContainer, AccordionItem } from "@components/Accordion";
import { DocumentPreview } from "@components/DocumentPreview/DocumentPreview";

import { useLeaseFormBase, useLeasePreview, useLeaseForm } from "../hooks";
import {
  PropertySelectionTab,
  FinancialDetailsTab,
  AdditionalTermsTab,
  LeaseTermsTab,
  TenantInfoTab,
  SignatureTab,
  CoTenantsTab,
  DocumentsTab,
} from "./components";

interface CreateLeaseProps {
  params: Promise<{
    cuid: string;
  }>;
}
export default function CreateLease({ params }: CreateLeaseProps) {
  const { cuid } = React.use(params);
  const router = useRouter();
  const {
    leaseForm,
    handleOnChange,
    propertyOptions,
    unitOptions,
    selectedProperty,
    isLoadingProperties,
    filteredProperties,
    filteredCount,
    tenantOptions,
    tenantSelectionType,
    isLoadingTenants,
    handleTenantSelectionTypeChange,
    handleCoTenantChange,
    addCoTenant,
    removeCoTenant,
    handleUtilityToggle,
    hasTabErrors,
    isTabCompleted,
  } = useLeaseFormBase({ cuid });

  const { isSubmitting, handleSubmit } = useLeaseForm();
  const {
    html,
    isLoading: isLoadingPreview,
    fetchPreview,
    clearPreview,
  } = useLeasePreview();

  const [showCoTenantWarning, setShowCoTenantWarning] = useState(false);

  const handleCreateLease = () => {
    const hasCoTenants =
      leaseForm.values.coTenants && leaseForm.values.coTenants.length > 0;

    if (!hasCoTenants) {
      setShowCoTenantWarning(true);
      return;
    }

    handleSubmit(leaseForm);
  };

  const handleConfirmWithoutCoTenants = () => {
    setShowCoTenantWarning(false);
    handleSubmit(leaseForm);
  };

  const handlePreviewClick = () => {
    fetchPreview(leaseForm);
  };

  const handleCancel = () => {
    router.back();
  };

  const isFormValid = leaseForm.isValid();

  const accordionItems: AccordionItem[] = [
    {
      id: "property",
      label: "Property & Unit",
      subtitle: "Select property and unit",
      icon: <i className="bx bx-building"></i>,
      hasError: hasTabErrors("property"),
      isCompleted: isTabCompleted("property"),
      content: (
        <PropertySelectionTab
          cuid={cuid}
          leaseForm={leaseForm}
          handleOnChange={handleOnChange}
          propertyOptions={propertyOptions}
          unitOptions={unitOptions}
          selectedProperty={selectedProperty}
          isLoading={isLoadingProperties}
          filteredProperties={filteredProperties}
          filteredCount={filteredCount}
        />
      ),
    },
    {
      id: "tenant",
      label: "Tenant Information",
      subtitle: "Select or invite tenant",
      icon: <i className="bx bx-user"></i>,
      hasError: hasTabErrors("tenant"),
      isCompleted: isTabCompleted("tenant"),
      content: (
        <TenantInfoTab
          leaseForm={leaseForm}
          handleOnChange={handleOnChange}
          tenantOptions={tenantOptions}
          tenantSelectionType={tenantSelectionType}
          isLoadingTenants={isLoadingTenants}
          onTenantSelectionTypeChange={handleTenantSelectionTypeChange}
        />
      ),
    },
    {
      id: "lease-terms",
      label: "Lease Terms",
      subtitle: "Define lease duration and terms",
      icon: <i className="bx bx-file-blank"></i>,
      hasError: hasTabErrors("leaseTerms"),
      isCompleted: isTabCompleted("leaseTerms"),
      content: (
        <LeaseTermsTab leaseForm={leaseForm} handleOnChange={handleOnChange} />
      ),
    },
    {
      id: "financial",
      label: "Financial Details",
      subtitle: "Set rent, deposits, and fees",
      icon: <i className="bx bx-dollar-circle"></i>,
      hasError: hasTabErrors("financial"),
      isCompleted: isTabCompleted("financial"),
      content: (
        <FinancialDetailsTab
          leaseForm={leaseForm}
          handleOnChange={handleOnChange}
        />
      ),
    },
    {
      id: "signature",
      label: "Signature Settings",
      subtitle: "Configure signing method",
      icon: <i className="bx bx-pen"></i>,
      hasError: hasTabErrors("signature"),
      isCompleted: isTabCompleted("signature"),
      content: (
        <SignatureTab leaseForm={leaseForm} handleOnChange={handleOnChange} />
      ),
    },
    {
      id: "additional",
      label: "Additional Terms",
      subtitle: "Utilities, pet policy, renewals",
      icon: <i className="bx bx-cog"></i>,
      hasError: hasTabErrors("additional"),
      isCompleted: isTabCompleted("additional"),
      content: (
        <AdditionalTermsTab
          leaseForm={leaseForm}
          handleOnChange={handleOnChange}
          handleUtilityToggle={handleUtilityToggle}
        />
      ),
    },
    {
      id: "cotenants",
      label: "Co-Tenants",
      subtitle: "Add additional tenants (optional)",
      icon: <i className="bx bx-group"></i>,
      hasError: hasTabErrors("cotenants"),
      isCompleted: isTabCompleted("cotenants"),
      content: (
        <CoTenantsTab
          leaseForm={leaseForm}
          handleCoTenantChange={handleCoTenantChange}
          addCoTenant={addCoTenant}
          removeCoTenant={removeCoTenant}
        />
      ),
    },
    {
      id: "documents",
      label: "Documents",
      subtitle: "Upload lease documents",
      icon: <i className="bx bx-file"></i>,
      hasError: hasTabErrors("documents"),
      isCompleted: isTabCompleted("documents"),
      content: (
        <DocumentsTab leaseForm={leaseForm} handleOnChange={handleOnChange} />
      ),
    },
  ];

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

        {/* Co-Tenant Warning Modal */}
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
