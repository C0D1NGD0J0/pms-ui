import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { leaseTabFields, leaseSchema } from "@validations/lease.validations";
import { useCallback, ChangeEvent, useEffect, useState, useMemo } from "react";
import {
  defaultLeaseFormValues,
  LeaseableProperty,
  LeaseFormValues,
  UtilityEnum,
} from "@interfaces/lease.interface";

import { useAvailableTenants } from "./useAvailableTenants";
import { useLeaseableProperties } from "./useLeaseableProperties";
import { useLeaseDuplication } from "./useLeaseDuplication";

export type LeaseFormBaseProps = {
  initialValues?: LeaseFormValues;
  cuid: string;
};

export function useLeaseFormBase({
  initialValues = defaultLeaseFormValues,
  cuid,
}: LeaseFormBaseProps) {
  const [selectedProperty, setSelectedProperty] =
    useState<LeaseableProperty | null>(null);

  const [tenantSelectionType, setTenantSelectionType] = useState<
    "existing" | "invite"
  >("existing");

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
  } = useLeaseDuplication(cuid);

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

      if (
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
        leaseForm.setFieldValue(actualField as any, actualValue);
      }

      if (actualField === "property.id" && typeof actualValue === "string") {
        const property = properties.find((p) => p.id === actualValue);
        setSelectedProperty(property || null);

        if (property) {
          leaseForm.setFieldValue("property.address", property.address);
          leaseForm.setFieldValue(
            "property.propertyType",
            property.propertyType
          );

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
      { name: "", email: "", phone: "", occupation: "" },
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

  useEffect(() => {
    if (duplicateData && !isDuplicating) {
      leaseForm.setValues({
        ...defaultLeaseFormValues,
        ...duplicateData,
      });

      if (duplicateData.property?.id) {
        const property = properties.find((p) => p.id === duplicateData.property.id);
        setSelectedProperty(property || null);
      }
    }
  }, [duplicateData, isDuplicating, properties]);

  useEffect(() => {
    leaseForm.validate();
  }, [leaseForm.values]);

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
            values.fees.rentDueDay <= 31
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

  return {
    leaseForm,
    handleOnChange,
    properties,
    propertyOptions,
    unitOptions,
    selectedProperty,
    isLoadingProperties,
    filteredProperties,
    filteredCount,
    availableTenants,
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
  };
}
