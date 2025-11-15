"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AccordionItem } from "@components/Accordion";

import { useLeaseFormBase, useLeasePreview, useLeaseForm } from "../../hooks";
import {
  PropertySelectionTab,
  FinancialDetailsTab,
  AdditionalTermsTab,
  LeaseTermsTab,
  TenantInfoTab,
  SignatureTab,
  CoTenantsTab,
  DocumentsTab,
} from "../components";

interface UseLeaseFormLogicProps {
  params: Promise<{
    cuid: string;
  }>;
}

export function useLeaseFormLogic({ params }: UseLeaseFormLogicProps) {
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
    isDuplicating,
    duplicateSource,
    duplicateError,
  } = useLeaseFormBase({ cuid });

  const { isSubmitting, handleSubmit } = useLeaseForm();
  const {
    html,
    isLoading: isLoadingPreview,
    fetchPreview,
    clearPreview,
  } = useLeasePreview();

  const [showCoTenantWarning, setShowCoTenantWarning] = useState(false);

  const handleCreateLease = useCallback(() => {
    const hasCoTenants =
      leaseForm.values.coTenants && leaseForm.values.coTenants.length > 0;

    if (!hasCoTenants) {
      setShowCoTenantWarning(true);
      return;
    }

    handleSubmit(leaseForm);
  }, [leaseForm, handleSubmit]);

  const handleConfirmWithoutCoTenants = useCallback(() => {
    setShowCoTenantWarning(false);
    handleSubmit(leaseForm);
  }, [leaseForm, handleSubmit]);

  const handlePreviewClick = useCallback(() => {
    fetchPreview(leaseForm);
  }, [leaseForm, fetchPreview]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

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

  return {
    cuid,
    leaseForm,
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
  };
}
