"use client";

import React from "react";
import { useForm } from "@mantine/form";
import { AccordionItem } from "@components/Accordion";
import { zodResolver } from "mantine-form-zod-resolver";
import { transformLeaseForEdit } from "@utils/leaseHelpers";
import { leaseTabFields, leaseSchema } from "@validations/lease.validations";
import { useCallback, ChangeEvent, useEffect, useState, useMemo } from "react";
import {
  defaultLeaseFormValues,
  LeaseableProperty,
  LeaseFormValues,
  UtilityEnum,
} from "@interfaces/lease.interface";

import { useGetLeasePreview } from "./useLeasePreview";
import { useGetLeaseByLuid } from "./useGetLeaseByLuid";
import { useAvailableTenants } from "./useAvailableTenants";
import { useLeaseDuplication } from "./useLeaseDuplication";
import { useLeaseableProperties } from "./useLeaseableProperties";
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

export type LeaseFormMode = "create" | "edit";

export type LeaseFormManagementProps = {
  cuid: string;
  mode: LeaseFormMode;
  luid?: string;
  initialValues?: LeaseFormValues;
};

export function useLeaseFormManagement({
  cuid,
  mode,
  luid,
  initialValues = defaultLeaseFormValues,
}: LeaseFormManagementProps) {
  const [selectedProperty, setSelectedProperty] =
    useState<LeaseableProperty | null>(null);

  const [tenantSelectionType, setTenantSelectionType] = useState<
    "existing" | "invite"
  >("existing");

  const [showPreview, setShowPreview] = useState(false);
  const [originalValues, setOriginalValues] = useState<LeaseFormValues | null>(
    null
  );

  const leaseForm = useForm<LeaseFormValues>({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: zodResolver(leaseSchema),
  });

  const {
    isDuplicating,
    duplicateSource,
    duplicateData,
    error: duplicateError,
  } = useLeaseDuplication(mode === "create" ? cuid : "");

  const {
    data: leaseDataResponse,
    isLoading: isLoadingEdit,
    isError: isEditError,
  } = useGetLeaseByLuid(
    mode === "edit" && luid ? cuid : "",
    mode === "edit" && luid ? luid : "",
    false
  );

  const { previewHtml, isLoadingPreview, fetchPreview } = useGetLeasePreview(
    mode === "edit" && luid ? cuid : "",
    mode === "edit" && luid ? luid : ""
  );

  const { data: propertiesResult, isLoading: isLoadingProperties } =
    useLeaseableProperties(true);

  const { data: availableTenants = [], isLoading: isLoadingTenants } =
    useAvailableTenants({ cuid });

  const properties = propertiesResult?.properties || [];
  const propertiesMetadata = propertiesResult?.metadata || null;
  const filteredProperties = propertiesMetadata?.filteredProperties || [];
  const filteredCount = propertiesMetadata?.filteredCount || 0;

  const propertyOptions = useMemo(() => {
    return properties.map((property) => ({
      value: property.id,
      label: `${property.name} - ${property.address}`,
      property,
    }));
  }, [properties]);

  const unitOptions = useMemo(() => {
    if (!selectedProperty || !selectedProperty.units) return [];

    return selectedProperty.units.map((unit) => ({
      value: unit.id,
      label: unit.unitNumber,
      unit,
    }));
  }, [selectedProperty]);

  const tenantOptions = useMemo(() => {
    return [
      { value: "", label: "Select a tenant" },
      ...availableTenants.map((tenant) => ({
        value: tenant.id,
        label: `${tenant.fullName} - ${tenant.email}`,
      })),
    ];
  }, [availableTenants]);

  const handleTenantSelectionTypeChange = useCallback(
    (type: "existing" | "invite") => {
      setTenantSelectionType(type);

      if (type === "existing") {
        leaseForm.setFieldValue("tenantInfo", {
          id: "",
          email: undefined,
          firstName: undefined,
          lastName: undefined,
        });
      } else {
        leaseForm.setFieldValue("tenantInfo", {
          id: undefined,
          email: "",
          firstName: "",
          lastName: "",
        });
      }
    },
    [leaseForm]
  );

  const handleOnChange = useCallback(
    (
      e:
        | ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        | string
        | boolean,
      field?: string
    ) => {
      let actualValue: string | boolean;
      let actualField: string | undefined = field;
      if (typeof e === "string" || typeof e === "boolean") {
        actualValue = e;
      } else {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        actualValue = type === "checkbox" ? checked : value;
        actualField = field || name;
      }

      if (actualField === "property.id" && typeof actualValue === "string") {
        const property = properties.find((p) => p.id === actualValue);
        setSelectedProperty(property || null);
        if (property) {
          // reset entire property object with new property data
          const hasUnits = property.units && property.units.length > 0;
          leaseForm.setFieldValue("property", {
            id: property.id,
            address: property.address,
            propertyType: property.propertyType,
            unitId: "",
            hasUnits,
          });

          const propertyType = property.propertyType?.toLowerCase();
          let templateType = "residential-single-family";

          if (propertyType === "house" || propertyType === "townhouse") {
            templateType = "residential-single-family";
          } else if (
            propertyType === "apartment" ||
            propertyType === "condominium"
          ) {
            templateType = "residential-apartment";
          } else if (propertyType === "commercial") {
            templateType = "commercial-office";
          } else if (propertyType === "industrial") {
            templateType = "commercial-office";
          }

          leaseForm.setFieldValue("templateType", templateType);

          if (property.financialInfo) {
            if (property.financialInfo.monthlyRent) {
              leaseForm.setFieldValue(
                "fees.monthlyRent",
                property.financialInfo.monthlyRent
              );
            }
            if (property.financialInfo.securityDeposit) {
              leaseForm.setFieldValue(
                "fees.securityDeposit",
                property.financialInfo.securityDeposit
              );
            }
            if (property.financialInfo.currency) {
              leaseForm.setFieldValue(
                "fees.currency",
                property.financialInfo.currency
              );
            }
          }
        }
      } else if (
        actualField &&
        typeof actualField === "string" &&
        actualField.includes(".")
      ) {
        const [parent, child] = actualField.split(".");
        const parentValue = leaseForm.values[parent as keyof LeaseFormValues];
        if (
          parentValue &&
          typeof parentValue === "object" &&
          !Array.isArray(parentValue)
        ) {
          leaseForm.setFieldValue(parent as any, {
            ...parentValue,
            [child]: actualValue,
          });
        }
      } else if (actualField) {
        // Handle non-nested fields
        leaseForm.setFieldValue(actualField as any, actualValue);
      }

      if (
        actualField === "property.unitId" &&
        typeof actualValue === "string"
      ) {
        const unit = selectedProperty?.units?.find((u) => u.id === actualValue);
        if (unit?.financialInfo) {
          if (unit.financialInfo.monthlyRent) {
            leaseForm.setFieldValue(
              "fees.monthlyRent",
              unit.financialInfo.monthlyRent
            );
          }
          if (unit.financialInfo.securityDeposit) {
            leaseForm.setFieldValue(
              "fees.securityDeposit",
              unit.financialInfo.securityDeposit
            );
          }
          if (unit.financialInfo.currency) {
            leaseForm.setFieldValue(
              "fees.currency",
              unit.financialInfo.currency
            );
          }
        }
      }
    },
    [leaseForm, properties, selectedProperty]
  );

  const handleCoTenantChange = useCallback(
    (index: number, field: string, value: string) => {
      const coTenants = [...(leaseForm.values.coTenants || [])];
      if (coTenants[index]) {
        coTenants[index] = {
          ...coTenants[index],
          [field]: value,
        };
        leaseForm.setFieldValue("coTenants", coTenants);
      }
    },
    [leaseForm]
  );

  const addCoTenant = useCallback(() => {
    const coTenants = leaseForm.values.coTenants || [];
    leaseForm.setFieldValue("coTenants", [
      ...coTenants,
      { name: "", email: "", phone: "", occupation: "", relationship: "" },
    ]);
  }, [leaseForm]);

  const removeCoTenant = useCallback(
    (index: number) => {
      const coTenants = leaseForm.values.coTenants || [];
      leaseForm.setFieldValue(
        "coTenants",
        coTenants.filter((_, i) => i !== index)
      );
    },
    [leaseForm]
  );

  const handleUtilityToggle = useCallback(
    (utility: UtilityEnum, checked: boolean) => {
      const utilities = leaseForm.values.utilitiesIncluded || [];
      if (checked) {
        leaseForm.setFieldValue("utilitiesIncluded", [...utilities, utility]);
      } else {
        leaseForm.setFieldValue(
          "utilitiesIncluded",
          utilities.filter((u) => u !== utility)
        );
      }
    },
    [leaseForm]
  );

  const handlePreviewClick = useCallback(() => {
    if (mode === "edit") {
      fetchPreview();
      setShowPreview(true);
    }
  }, [mode, fetchPreview]);

  const clearPreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  const hasTabErrors = useCallback(
    (tabId: string): boolean => {
      const relevantFields =
        leaseTabFields[tabId as keyof typeof leaseTabFields] || [];

      return relevantFields.some((field) => {
        if (leaseForm.errors[field as keyof typeof leaseForm.errors]) {
          return true;
        }

        if (field.includes(".")) {
          const parent = field.split(".")[0];
          if (leaseForm.errors[parent as keyof typeof leaseForm.errors]) {
            return true;
          }
        }

        return false;
      });
    },
    [leaseForm.errors]
  );

  const isTabCompleted = useCallback(
    (tabId: string): boolean => {
      const values = leaseForm.values;

      switch (tabId) {
        case "property":
          if (!values.property.id) return false;
          if (values.property.propertyType) {
            const requiresUnit =
              selectedProperty?.units && selectedProperty.units.length > 0;
            if (requiresUnit && !values.property.unitId) return false;
          }
          return true;

        case "tenant":
          const hasId =
            values.tenantInfo.id && values.tenantInfo.id.trim() !== "";
          const hasEmail =
            values.tenantInfo.email && values.tenantInfo.email.trim() !== "";
          const hasFirstName =
            values.tenantInfo.firstName &&
            values.tenantInfo.firstName.trim() !== "";
          const hasLastName =
            values.tenantInfo.lastName &&
            values.tenantInfo.lastName.trim() !== "";
          return !!hasId || !!(hasEmail && hasFirstName && hasLastName);

        case "leaseTerms":
          return !!(
            values.type &&
            values.templateType &&
            values.duration.startDate &&
            values.duration.endDate
          );

        case "financial":
          return !!(
            values.fees.monthlyRent > 0 &&
            values.fees.securityDeposit >= 0 &&
            values.fees.rentDueDay >= 1 &&
            values.fees.rentDueDay <= 31 &&
            values.fees.acceptedPaymentMethod
          );

        case "signature":
          return !!values.signingMethod;

        case "additional":
        case "cotenants":
        case "documents":
          return true;

        default:
          return false;
      }
    },
    [leaseForm.values, selectedProperty]
  );

  useEffect(() => {
    if (mode === "create" && duplicateData && !isDuplicating) {
      leaseForm.setValues({
        ...defaultLeaseFormValues,
        ...duplicateData,
      });

      if (duplicateData.property?.id) {
        const property = properties.find(
          (p) => p.id === duplicateData.property?.id
        );
        setSelectedProperty(property || null);
      }
    }
  }, [mode, duplicateData, isDuplicating, properties]);

  useEffect(() => {
    if (
      mode === "edit" &&
      leaseDataResponse?.lease &&
      !isLoadingEdit &&
      properties.length > 0
    ) {
      const transformedData = transformLeaseForEdit(leaseDataResponse.lease);

      // Find the property to check if it has units
      let propertyHasUnits = false;
      if (transformedData.property?.id) {
        const property = properties.find(
          (p) => p.id === transformedData.property?.id
        );
        setSelectedProperty(property || null);
        propertyHasUnits = Boolean(
          property?.units && property.units.length > 0
        );
      }

      const formValues: Partial<LeaseFormValues> = {
        ...defaultLeaseFormValues,
        ...transformedData,
        property: {
          id: transformedData.property?.id || "",
          address: transformedData.property?.address,
          unitId: transformedData.property?.unitId,
          propertyType: transformedData.property?.propertyType,
          hasUnits: propertyHasUnits,
        },
      };

      leaseForm.setValues(formValues);
      setOriginalValues(formValues as LeaseFormValues);

      leaseForm.resetDirty();
    }
  }, [mode, leaseDataResponse, isLoadingEdit, properties]);

  useEffect(() => {
    leaseForm.validate();

    if (mode === "edit" && leaseForm.isDirty()) {
      setShowPreview(false);
    }
  }, [mode, leaseForm.values]);

  const accordionItems: AccordionItem[] = useMemo(
    () => [
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
            disableFields={mode === "edit"}
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
          <LeaseTermsTab
            leaseForm={leaseForm}
            handleOnChange={handleOnChange}
          />
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
    ],
    [
      cuid,
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
    ]
  );

  const isFormValid = leaseForm.isValid();

  return {
    leaseForm,
    isFormValid,
    accordionItems,
    isLoadingProperties,
    isLoadingTenants,
    isDuplicating: mode === "create" ? isDuplicating : false,
    duplicateSource: mode === "create" ? duplicateSource : null,
    duplicateError: mode === "create" ? duplicateError : null,
    isEditing: mode === "edit",
    editLuid: mode === "edit" ? luid : null,
    isLoadingEdit: mode === "edit" ? isLoadingEdit : false,
    editError:
      mode === "edit" && isEditError ? "Failed to load lease data" : null,
    hasUnsavedChanges: mode === "edit" ? leaseForm.isDirty() : false,
    originalValues: mode === "edit" ? originalValues : null,
    leaseStatus: mode === "edit" ? leaseDataResponse?.lease?.status : null,
    html: mode === "edit" && showPreview ? previewHtml : "",
    isLoadingPreview: mode === "edit" ? isLoadingPreview : false,
    handlePreviewClick,
    clearPreview,
    properties,
    propertyOptions,
    unitOptions,
    selectedProperty,
    filteredProperties,
    filteredCount,
    availableTenants,
    tenantOptions,
    tenantSelectionType,
    handleOnChange,
    handleTenantSelectionTypeChange,
    handleCoTenantChange,
    addCoTenant,
    removeCoTenant,
    handleUtilityToggle,
    hasTabErrors,
    isTabCompleted,
  };
}
