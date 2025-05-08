/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "@store/index";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { propertySchema } from "@validations/property.validations";
import { ChangeEvent, useCallback, useState, useMemo } from "react";
import { usePropertyFormMetaData } from "@hooks/property/usePropertyFormMetaData";
import {
  defaultPropertyValues,
  PropertyFormValues,
} from "@interfaces/property.interface";

export type PropertyFormBaseProps = {
  initialValues?: PropertyFormValues;
};

export function usePropertyFormBase({
  initialValues = defaultPropertyValues,
}: PropertyFormBaseProps = {}) {
  const { client } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    new Set(["basic"])
  );

  const { data: formConfig, isLoading: isConfigLoading } =
    usePropertyFormMetaData();

  const getPropertyTypeOptions = useCallback(() => {
    if (!formConfig?.propertyTypes) return [];
    return formConfig.propertyTypes.map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  }, [formConfig]);

  const getPropertyStatusOptions = useCallback(() => {
    if (!formConfig?.propertyStatuses) return [];
    return formConfig.propertyStatuses.map((status) => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
    }));
  }, [formConfig]);

  const getOccupancyStatusOptions = useCallback(() => {
    if (!formConfig?.occupancyStatuses) return [];
    return formConfig.occupancyStatuses.map((status) => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
    }));
  }, [formConfig]);

  const getDocumentTypeOptions = useCallback(() => {
    if (!formConfig?.documentTypes) return [];
    return formConfig.documentTypes.map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  }, [formConfig]);

  const documentTypeOptions = useMemo(
    () => getDocumentTypeOptions(),
    [getDocumentTypeOptions]
  );
  const propertyTypeOptions = useMemo(
    () => getPropertyTypeOptions(),
    [getPropertyTypeOptions]
  );
  const propertyStatusOptions = useMemo(
    () => getPropertyStatusOptions(),
    [getPropertyStatusOptions]
  );
  const occupancyStatusOptions = useMemo(
    () => getOccupancyStatusOptions(),
    [getOccupancyStatusOptions]
  );

  const form = useForm<PropertyFormValues>({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: zodResolver(propertySchema),
  });

  const tabFields = {
    basic: [
      "name",
      "propertyType",
      "status",
      "managedBy",
      "yearBuilt",
      "address.fullAddress",
      "address.unitNumber",
      "address.city",
      "address.state",
      "address.postCode",
      "address.country",
    ],
    financial: [
      "financialDetails.purchasePrice",
      "financialDetails.purchaseDate",
      "financialDetails.marketValue",
      "financialDetails.propertyTax",
      "financialDetails.lastAssessmentDate",
      "fees.currency",
      "fees.taxAmount",
      "fees.rentalAmount",
      "fees.managementFees",
      "fees.securityDeposit",
    ],
    property: [
      "specifications.totalArea",
      "specifications.lotSize",
      "specifications.bedrooms",
      "specifications.bathrooms",
      "specifications.floors",
      "specifications.garageSpaces",
      "specifications.maxOccupants",
      "utilities.water",
      "utilities.gas",
      "utilities.electricity",
      "utilities.internet",
      "utilities.trash",
      "utilities.cableTV",
      "occupancyStatus",
      "totalUnits",
      "description.text",
      "description.html",
    ],
  };

  const hasTabErrors = useCallback(() => {
    const tabErrorMap: Record<string, boolean> = {};
    Object.keys(tabFields).forEach((tabKey) => {
      if (!visitedTabs.has(tabKey)) {
        tabErrorMap[tabKey] = false;
        return;
      }

      const relevantFields = tabFields[tabKey as keyof typeof tabFields] || [];
      tabErrorMap[tabKey] = relevantFields.some((field) => {
        const result = form.validateField(field);
        return result.hasError;
      });
    });

    return tabErrorMap;
  }, [form.errors, visitedTabs]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setVisitedTabs((prev) => new Set([...prev, tab]));
  }, []);

  const validateAll = useCallback(() => {
    setVisitedTabs(new Set(Object.keys(tabFields)));

    const validator = zodResolver(propertySchema);
    const errors = validator(form.values);
    form.setErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form.values, tabFields]);

  const handleOnChange = useCallback(
    (
      e:
        | ChangeEvent<
            | HTMLInputElement
            | HTMLSelectElement
            | HTMLTextAreaElement
            | HTMLSelectElement
          >
        | string,
      field?: keyof PropertyFormValues | string
    ) => {
      if (typeof e === "string" && field) {
        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          const parentValue = form.values[parent as keyof PropertyFormValues];
          if (
            parentValue &&
            typeof parentValue === "object" &&
            !Array.isArray(parentValue)
          ) {
            form.setFieldValue(parent as any, {
              ...parentValue,
              [child]: e,
            });
          }
        } else {
          form.setFieldValue(field as any, e);
        }
        return;
      } else if (typeof e !== "string") {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name.includes(".")) {
          const [parent, child] = name.split(".");
          const parentValue = form.values[parent as keyof PropertyFormValues];
          if (
            parentValue &&
            typeof parentValue === "object" &&
            !Array.isArray(parentValue)
          ) {
            form.setFieldValue(parent as any, {
              ...parentValue,
              [child]: type === "checkbox" ? checked : value,
            });
          }
        } else {
          form.setFieldValue(
            name as string,
            type === "checkbox" ? checked : value
          );
        }
      }
    },
    [form]
  );

  const saveAddress = useCallback(
    (address: PropertyFormValues["address"]) => {
      form.setFieldValue("address.fullAddress", address.fullAddress);
      form.setFieldValue("address.city", address.city);
      form.setFieldValue("address.state", address.state);
      form.setFieldValue("address.street", address.street);
      form.setFieldValue("address.country", address.country);
      form.setFieldValue("address.postCode", address.postCode);
      form.setFieldValue("address.unitNumber", address.unitNumber);
      form.setFieldValue("address.coordinates", address.coordinates);
    },
    [form]
  );

  const tabErrorsMap = useMemo(() => hasTabErrors(), [hasTabErrors]);

  return {
    form,
    client,
    activeTab,
    formConfig,
    saveAddress,
    validateAll,
    handleOnChange,
    isConfigLoading,
    documentTypeOptions,
    propertyTypeOptions,
    propertyStatusOptions,
    occupancyStatusOptions,
    setActiveTab: handleTabChange,
    hasTabErrors: (tabId: string) => tabErrorsMap[tabId] || false,
  };
}
