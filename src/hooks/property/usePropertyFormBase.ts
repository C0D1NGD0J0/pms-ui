/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "@store/index";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { defaultPropertyValues } from "@utils/constants";
import { PropertyTypeManager } from "@utils/propertyTypeManager";
import { propertySchema } from "@validations/property.validations";
import { ChangeEvent, useCallback, useEffect, useState, useMemo } from "react";
import { usePropertyFormMetaData } from "@hooks/property/usePropertyFormMetaData";
import {
  StaticPropertyFormConfig,
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

  const { data: formConfig, isLoading: isConfigLoading } =
    usePropertyFormMetaData<StaticPropertyFormConfig>("propertyForm");

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

  const form = useForm<PropertyFormValues>({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: zodResolver(propertySchema),
  });

  const currentPropertyType = form.values.propertyType || "house";
  const currentTotalUnits = form.values.totalUnits || 1;

  const getTabFields = useCallback(() => {
    const coreFields = PropertyTypeManager.getVisibleFieldsForCategory(
      currentPropertyType,
      "core",
      currentTotalUnits
    );
    const specFields = PropertyTypeManager.getVisibleFieldsForCategory(
      currentPropertyType,
      "specifications",
      currentTotalUnits
    );
    const financialFields = PropertyTypeManager.getVisibleFieldsForCategory(
      currentPropertyType,
      "financial",
      currentTotalUnits
    );
    const amenityFields = PropertyTypeManager.getVisibleFieldsForCategory(
      currentPropertyType,
      "amenities",
      currentTotalUnits
    );
    const documentFields = PropertyTypeManager.getVisibleFieldsForCategory(
      currentPropertyType,
      "documents",
      currentTotalUnits
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
        "totalUnits",
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
  }, [currentPropertyType, currentTotalUnits]);

  const tabFields = useMemo(() => getTabFields(), [getTabFields]);

  useEffect(() => {
    form.validate();
  }, [form.values]);

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
            currentTotalUnits
          );
        case "property":
          return PropertyTypeManager.isCategoryVisible(
            currentPropertyType,
            "specifications",
            currentTotalUnits
          );
        case "amenities":
          return PropertyTypeManager.isCategoryVisible(
            currentPropertyType,
            "amenities",
            currentTotalUnits
          );
        case "documents":
          return PropertyTypeManager.isCategoryVisible(
            currentPropertyType,
            "documents",
            currentTotalUnits
          );
        default:
          return true;
      }
    },
    [currentPropertyType, currentTotalUnits]
  );

  const hasTabErrors = useCallback(
    (tabId: string): boolean => {
      const relevantFields = tabFields[tabId as keyof typeof tabFields] || [];
      return relevantFields.some((field) => {
        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          const parentErrors = form.errors[parent as keyof typeof form.errors];
          return parentErrors && typeof parentErrors === "object"
            ? !!(parentErrors as Record<string, any>)[child]
            : false;
        }

        return !!form.errors[field as keyof typeof form.errors];
      });
    },
    [form.errors, tabFields]
  );

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const validateAll = useCallback(() => {
    const validator = zodResolver(propertySchema);
    const errors = validator(form.values);
    form.setErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form.values]);

  const getFieldHelpText = useCallback(
    (fieldName: string): string => {
      return PropertyTypeManager.getHelpText(
        currentPropertyType,
        fieldName,
        currentTotalUnits
      );
    },
    [currentPropertyType, currentTotalUnits]
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
        currentTotalUnits,
        category
      );
    },
    [currentPropertyType, currentTotalUnits]
  );

  // property type specific utilities
  const propertyTypeUtils = useMemo(
    () => ({
      supportsMultipleUnits:
        PropertyTypeManager.supportsMultipleUnits(currentPropertyType),
      shouldValidateBedBath: PropertyTypeManager.shouldValidateBedBath(
        currentPropertyType,
        currentTotalUnits
      ),
      getDefaultUnits: () =>
        PropertyTypeManager.getDefaultUnits(currentPropertyType),
      getMinUnits: () => PropertyTypeManager.getMinUnits(currentPropertyType),
      getRequiredFields: () =>
        PropertyTypeManager.getRequiredFields(currentPropertyType),
    }),
    [currentPropertyType, currentTotalUnits]
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

        // Auto-update totalUnits when propertyType changes
        if (field === "propertyType") {
          const defaultUnits = PropertyTypeManager.getDefaultUnits(e);
          form.setFieldValue("totalUnits", defaultUnits);
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

          // Auto-update totalUnits when propertyType changes
          if (name === "propertyType") {
            const defaultUnits = PropertyTypeManager.getDefaultUnits(value);
            form.setFieldValue("totalUnits", defaultUnits);
          }
        }
      }
    },
    [form]
  );

  const saveAddress = useCallback(
    (address: PropertyFormValues["address"]) => {
      const currentAddress = form.values.address || {};
      const mergedAddress = {
        ...currentAddress,
        ...address,
        postCode: (address.postCode || currentAddress.postCode).toString(),
      };
      console.log("Saving address:", mergedAddress);
      form.setFieldValue("address", mergedAddress);
    },
    [form]
  );

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
    hasTabErrors,
    // New property type aware features
    isTabVisible,
    isFieldVisible,
    isFieldRequired,
    getFieldHelpText,
    propertyTypeUtils,
    currentPropertyType,
    currentTotalUnits,
  };
}
