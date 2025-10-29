"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@components/FormElements";
import { PageHeader } from "@components/PageElements";
import { AccordionContainer, AccordionItem } from "@components/Accordion";
import { DocumentPreview } from "@components/DocumentPreview/DocumentPreview";

import { useLeaseFormBase, useLeasePreview, useLeaseForm } from "../hooks";
import {
  PropertySelectionTab,
  FinancialDetailsTab,
  AdditionalTermsTab,
  LeaseTermsTab,
  TenantInfoTab,
  CoTenantsTab,
  DocumentsTab,
} from "./components";

export default function CreateLease() {
  const router = useRouter();
  const {
    leaseForm,
    // properties,
    handleOnChange,
    propertyOptions,
    unitOptions,
    selectedProperty,
    isLoadingProperties,
    handleCoTenantChange,
    addCoTenant,
    removeCoTenant,
    handleUtilityToggle,
  } = useLeaseFormBase();

  const { isSubmitting, handleSubmit } = useLeaseForm();
  const {
    html,
    isLoading: isLoadingPreview,
    fetchPreview,
    clearPreview,
  } = useLeasePreview();

  const handleCreateLease = () => {
    handleSubmit(leaseForm);
  };

  const handlePreviewClick = () => {
    fetchPreview(leaseForm);
  };

  const handleCancel = () => {
    router.push("/leases");
  };

  const isFormValid = leaseForm.isValid();

  const accordionItems: AccordionItem[] = [
    {
      id: "property",
      label: "Property & Unit",
      subtitle: "Select property and unit",
      icon: <i className="bx bx-building"></i>,
      content: (
        <PropertySelectionTab
          leaseForm={leaseForm}
          handleOnChange={handleOnChange}
          propertyOptions={propertyOptions}
          unitOptions={unitOptions}
          selectedProperty={selectedProperty}
          isLoading={isLoadingProperties}
        />
      ),
    },
    {
      id: "tenant",
      label: "Tenant Information",
      subtitle: "Select or invite tenant",
      icon: <i className="bx bx-user"></i>,
      content: (
        <TenantInfoTab leaseForm={leaseForm} handleOnChange={handleOnChange} />
      ),
    },
    {
      id: "lease-terms",
      label: "Lease Terms",
      subtitle: "Define lease duration and terms",
      icon: <i className="bx bx-file-blank"></i>,
      content: (
        <LeaseTermsTab leaseForm={leaseForm} handleOnChange={handleOnChange} />
      ),
    },
    {
      id: "financial",
      label: "Financial Details",
      subtitle: "Set rent, deposits, and fees",
      icon: <i className="bx bx-dollar-circle"></i>,
      content: (
        <FinancialDetailsTab
          leaseForm={leaseForm}
          handleOnChange={handleOnChange}
        />
      ),
    },
    {
      id: "additional",
      label: "Additional Terms",
      subtitle: "Utilities, pet policy, renewals",
      icon: <i className="bx bx-cog"></i>,
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
            onChange={(activeId) => {
              console.log("Active section changed to:", activeId);
            }}
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

          {/* Action buttons at bottom of form */}
          <div
            className="form-actions"
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
            }}
          >
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
      </div>
    </div>
  );
}
