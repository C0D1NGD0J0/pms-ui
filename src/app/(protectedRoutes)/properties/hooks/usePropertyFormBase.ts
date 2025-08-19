 
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { PropertyTypeManager } from "@utils/propertyTypeManager";
import { usePropertyFormStaticData, useAuth } from "@store/index";
import { propertySchema } from "@validations/property.validations";
import { useCallback, ChangeEvent, useEffect, useState, useMemo } from "react";
import {
  EditPropertyFormValues,
  defaultPropertyValues,
  PropertyFormValues,
} from "@interfaces/property.interface";

import { useGetClientPropertyManagers } from "./useGetClientPropertyManagers";

export type PropertyFormBaseProps = {
  initialValues?: PropertyFormValues;
};

export function usePropertyFormBase({
  initialValues = defaultPropertyValues,
}: PropertyFormBaseProps = {}) {
  const { client } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");

  const { data: formConfig, loading: formConfigLoading } =
    usePropertyFormStaticData();
  const { propertyManagers } = useGetClientPropertyManagers(
    client?.cuid || "",
    {
      role: "all",
    }
  );
  const propertyForm = useForm<EditPropertyFormValues>({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: zodResolver(propertySchema),
  });

  useEffect(() => {
    propertyForm.validate();
  }, [propertyForm.values]);

  const getPropertyTypeOptions = useCallback(() => {
    if (!formConfig?.propertyTypes) return [];
    return formConfig.propertyTypes.map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1).replace("-", " "),
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

  const currentPropertyType = propertyForm.values.propertyType || "house";
  const currentmaxAllowedUnits = propertyForm.values.maxAllowedUnits || 1;

  const getTabFields = useCallback(() => {
    const coreFields = PropertyTypeManager.getVisibleFieldsForCategory(
      currentPropertyType,
      "core",
      currentmaxAllowedUnits
    );
    const specFields = PropertyTypeManager.getVisibleFieldsForCategory(
      currentPropertyType,
      "specifications",
      currentmaxAllowedUnits
    );
    const financialFields = PropertyTypeManager.getVisibleFieldsForCategory(
      currentPropertyType,
      "financial",
      currentmaxAllowedUnits
    );
    const amenityFields = PropertyTypeManager.getVisibleFieldsForCategory(
      currentPropertyType,
      "amenities",
      currentmaxAllowedUnits
    );
    const documentFields = PropertyTypeManager.getVisibleFieldsForCategory(
      currentPropertyType,
      "documents",
      currentmaxAllowedUnits
    );

    return {
      basic: [
        ...coreFields.map((field) => {
          // Map core fields to their form paths
          if (field === "address") return "address.fullAddress";
          return field;
        }),
        "address.unitNumber",
        "address.city",
        "address.state",
        "address.postCode",
        "address.country",
      ],
      financial: [
        ...financialFields.map((field) => {
          // Map financial fields to their form paths
          if (field.startsWith("financial")) return field;
          if (field.includes("purchasePrice"))
            return "financialDetails.purchasePrice";
          if (field.includes("purchaseDate"))
            return "financialDetails.purchaseDate";
          if (field.includes("marketValue"))
            return "financialDetails.marketValue";
          if (field.includes("propertyTax"))
            return "financialDetails.propertyTax";
          if (field.includes("taxAmount")) return "fees.taxAmount";
          if (field.includes("rentalAmount")) return "fees.rentalAmount";
          if (field.includes("managementFees")) return "fees.managementFees";
          if (field.includes("securityDeposit")) return "fees.securityDeposit";
          return field;
        }),
        "fees.currency",
        "financialDetails.lastAssessmentDate",
      ],
      property: [
        ...specFields.map((field) => {
          // Map spec fields to their form paths
          if (field.includes("totalArea")) return "specifications.totalArea";
          if (field.includes("lotSize")) return "specifications.lotSize";
          if (field.includes("bedrooms")) return "specifications.bedrooms";
          if (field.includes("bathrooms")) return "specifications.bathrooms";
          if (field.includes("floors")) return "specifications.floors";
          if (field.includes("garageSpaces"))
            return "specifications.garageSpaces";
          if (field.includes("maxOccupants"))
            return "specifications.maxOccupants";
          return field;
        }),
        ...amenityFields
          .map((field) => {
            if (field === "utilities")
              return [
                "utilities.water",
                "utilities.gas",
                "utilities.electricity",
                "utilities.internet",
                "utilities.trash",
                "utilities.cableTV",
              ];
            return field;
          })
          .flat(),
        "occupancyStatus",
        "maxAllowedUnits",
        "description.text",
        "description.html",
      ],
      amenities: [
        ...amenityFields
          .map((field) => {
            if (field === "interiorAmenities")
              return [
                "interiorAmenities.airConditioning",
                "interiorAmenities.heating",
                "interiorAmenities.washerDryer",
                "interiorAmenities.dishwasher",
                "interiorAmenities.fridge",
                "interiorAmenities.furnished",
                "interiorAmenities.storageSpace",
              ];
            if (field === "communityAmenities")
              return [
                "communityAmenities.swimmingPool",
                "communityAmenities.fitnessCenter",
                "communityAmenities.elevator",
                "communityAmenities.parking",
                "communityAmenities.securitySystem",
                "communityAmenities.petFriendly",
                "communityAmenities.laundryFacility",
                "communityAmenities.doorman",
              ];
            return field;
          })
          .flat(),
      ],
      documents: documentFields,
    };
  }, [currentPropertyType, currentmaxAllowedUnits]);

  const tabFields = useMemo(() => getTabFields(), [getTabFields]);

  // if tab should be visible based on property type
  const isTabVisible = useCallback(
    (tabId: string): boolean => {
      switch (tabId) {
        case "basic":
          return true; // Always visible
        case "financial":
          return PropertyTypeManager.isCategoryVisible(
            currentPropertyType,
            "financial",
            currentmaxAllowedUnits
          );
        case "property":
          return PropertyTypeManager.isCategoryVisible(
            currentPropertyType,
            "specifications",
            currentmaxAllowedUnits
          );
        case "amenities":
          return PropertyTypeManager.isCategoryVisible(
            currentPropertyType,
            "amenities",
            currentmaxAllowedUnits
          );
        case "documents":
          return PropertyTypeManager.isCategoryVisible(
            currentPropertyType,
            "documents",
            currentmaxAllowedUnits
          );
        case "units":
          return PropertyTypeManager.supportsMultipleUnits(currentPropertyType);
        default:
          return true;
      }
    },
    [currentPropertyType, currentmaxAllowedUnits]
  );

  const hasTabErrors = useCallback(
    (tabId: string): boolean => {
      const relevantFields = tabFields[tabId as keyof typeof tabFields] || [];
      const result = relevantFields.some((field) => {
        if (propertyForm.errors[field as keyof typeof propertyForm.errors]) {
          return true;
        }

        // if field contains a dot, check nested structure just-in-case
        if (field.includes(".")) {
          const [parent, child] = field.split(".");

          // Type-safe property access
          if (parent in propertyForm.errors) {
            const parentErrors =
              propertyForm.errors[parent as keyof typeof propertyForm.errors];
            return parentErrors &&
              typeof parentErrors === "object" &&
              !Array.isArray(parentErrors)
              ? !!(parentErrors as Record<string, any>)[child]
              : false;
          }
        }

        return false;
      });
      return result;
    },
    [propertyForm.errors, tabFields]
  );

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const validateAll = useCallback(() => {
    const validator = zodResolver(propertySchema);
    const errors = validator(propertyForm.values);
    propertyForm.setErrors(errors);
    return Object.keys(errors).length === 0;
  }, [propertyForm.values]);

  const getFieldHelpText = useCallback(
    (fieldName: string): string => {
      return PropertyTypeManager.getHelpText(
        currentPropertyType,
        fieldName,
        currentmaxAllowedUnits
      );
    },
    [currentPropertyType, currentmaxAllowedUnits]
  );

  // check if field is required based on property type
  const isFieldRequired = useCallback(
    (fieldName: string): boolean => {
      return PropertyTypeManager.isFieldRequired(
        currentPropertyType,
        fieldName
      );
    },
    [currentPropertyType]
  );

  // check if field should be visible
  const isFieldVisible = useCallback(
    (fieldName: string, category?: string): boolean => {
      return PropertyTypeManager.isFieldVisible(
        currentPropertyType,
        fieldName,
        currentmaxAllowedUnits,
        category
      );
    },
    [currentPropertyType, currentmaxAllowedUnits]
  );

  // property type specific utilities
  const propertyTypeUtils = useMemo(
    () => ({
      supportsMultipleUnits:
        PropertyTypeManager.supportsMultipleUnits(currentPropertyType),
      shouldValidateBedBath: PropertyTypeManager.shouldValidateBedBath(
        currentPropertyType,
        currentmaxAllowedUnits
      ),
      getDefaultUnits: () =>
        PropertyTypeManager.getDefaultUnits(currentPropertyType),
      getMinUnits: () => PropertyTypeManager.getMinUnits(currentPropertyType),
      getRequiredFields: () =>
        PropertyTypeManager.getRequiredFields(currentPropertyType),
    }),
    [currentPropertyType, currentmaxAllowedUnits]
  );

  const saveAddress = useCallback(
    (address: PropertyFormValues["address"]) => {
      const currentAddress = propertyForm.values.address || {};
      const mergedAddress = {
        ...currentAddress,
        ...address,
        postCode: (address.postCode || currentAddress.postCode).toString(),
      };
      console.log("Saving address:", mergedAddress);
      propertyForm.setFieldValue("address", mergedAddress);
    },
    [propertyForm]
  );

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
      field?: keyof PropertyFormBaseProps | string
    ) => {
      if (typeof e === "string" && field) {
        if (typeof field === "string" && field.includes(".")) {
          const [parent, child] = field.split(".");
          const parentValue =
            propertyForm.values[parent as keyof PropertyFormValues];
          if (
            parentValue &&
            typeof parentValue === "object" &&
            !Array.isArray(parentValue)
          ) {
            propertyForm.setFieldValue(parent as any, {
              ...parentValue,
              [child]: e,
            });
          }
        } else {
          propertyForm.setFieldValue(field as any, e);
        }

        // Auto-update maxAllowedUnits when propertyType changes
        if (field === "propertyType") {
          const defaultUnits = PropertyTypeManager.getDefaultUnits(e);
          propertyForm.setFieldValue("maxAllowedUnits", defaultUnits);
        }
        return;
      } else if (typeof e !== "string") {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name.includes(".")) {
          const [parent, child] = name.split(".");
          const parentValue =
            propertyForm.values[parent as keyof PropertyFormValues];
          if (
            parentValue &&
            typeof parentValue === "object" &&
            !Array.isArray(parentValue)
          ) {
            propertyForm.setFieldValue(parent, {
              ...parentValue,
              [child]: type === "checkbox" ? checked : value,
            });
          }
        } else {
          propertyForm.setFieldValue(
            name as string,
            type === "checkbox" ? checked : value
          );

          // Auto-update maxAllowedUnits when propertyType changes
          if (name === "propertyType") {
            const defaultUnits = PropertyTypeManager.getDefaultUnits(value);
            propertyForm.setFieldValue("maxAllowedUnits", defaultUnits);
          }
        }
      }
    },
    [propertyForm]
  );

  return {
    client,
    activeTab,
    formConfig,
    saveAddress,
    validateAll,
    propertyForm,
    hasTabErrors,
    isTabVisible,
    isFieldVisible,
    isFieldRequired,
    handleOnChange,
    propertyManagers,
    getFieldHelpText,
    propertyTypeUtils,
    formConfigLoading,
    currentmaxAllowedUnits,
    documentTypeOptions,
    currentPropertyType,
    propertyTypeOptions,
    propertyStatusOptions,
    occupancyStatusOptions,
    setActiveTab: handleTabChange,
  };
}
