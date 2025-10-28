"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@components/FormElements";
import { PageHeader } from "@components/PageElements";
import { AccordionContainer, AccordionItem } from "@components/Accordion";

import {
  PropertySelectionTab,
  FinancialDetailsTab,
  LeasePreviewContent,
  AdditionalTermsTab,
  LeaseTermsTab,
  TenantInfoTab,
  CoTenantsTab,
  DocumentsTab,
} from "./components";

export default function CreateLease() {
  const router = useRouter();

  // Mock data for preview - will be replaced with actual form data later
  const mockLeaseData = {
    property: {
      address: "123 Main Street, Downtown",
      unit: "Apt 4B",
    },
    tenant: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
    duration: {
      startDate: "2024-01-15",
      endDate: "2024-12-15",
    },
    fees: {
      monthlyRent: 2500,
      securityDeposit: 2500,
    },
  };

  const handleCreateLease = () => {
    console.log("Create lease submitted", mockLeaseData);
    // Here you would typically submit to backend
  };

  const handleCancel = () => {
    router.push("/leases");
  };

  const accordionItems: AccordionItem[] = [
    {
      id: "property",
      label: "Property & Unit",
      subtitle: "Select property and unit",
      icon: <i className="bx bx-building"></i>,
      content: <PropertySelectionTab />,
      // hasError: false, // Will be connected to form validation later
      // isCompleted: false, // Will be connected to form completion status later
    },
    {
      id: "tenant",
      label: "Tenant Information",
      subtitle: "Select or invite tenant",
      icon: <i className="bx bx-user"></i>,
      content: <TenantInfoTab />,
    },
    {
      id: "lease-terms",
      label: "Lease Terms",
      subtitle: "Define lease duration and terms",
      icon: <i className="bx bx-file-blank"></i>,
      content: <LeaseTermsTab />,
    },
    {
      id: "financial",
      label: "Financial Details",
      subtitle: "Set rent, deposits, and fees",
      icon: <i className="bx bx-dollar-circle"></i>,
      content: <FinancialDetailsTab />,
    },
    {
      id: "additional",
      label: "Additional Terms",
      subtitle: "Utilities, pet policy, renewals",
      icon: <i className="bx bx-cog"></i>,
      content: <AdditionalTermsTab />,
    },
    {
      id: "cotenants",
      label: "Co-Tenants",
      subtitle: "Add additional tenants (optional)",
      icon: <i className="bx bx-group"></i>,
      content: <CoTenantsTab />,
    },
    {
      id: "documents",
      label: "Documents",
      subtitle: "Upload lease documents",
      icon: <i className="bx bx-file"></i>,
      content: <DocumentsTab />,
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
            showPreviewDrawer={true}
            previewTitle="Lease Review"
            previewData={mockLeaseData}
            renderPreview={(activeItem, activeId) => (
              <LeasePreviewContent
                data={mockLeaseData}
                activeSection={activeId || "property"}
              />
            )}
            previewActions={
              <Button
                className="btn btn-primary btn-block"
                label="Create Lease"
                icon={<i className="bx bx-check"></i>}
                onClick={handleCreateLease}
              />
            }
            onPreviewToggle={(data) => {
              console.log("Preview toggled with data:", data);
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
              label="Save as Draft"
              icon={<i className="bx bx-save"></i>}
              onClick={() => console.log("Save as draft")}
            />
            <Button
              className="btn btn-primary"
              label="Create Lease"
              icon={<i className="bx bx-check"></i>}
              onClick={handleCreateLease}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
