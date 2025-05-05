/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "@store/index";
import { useForm } from "@mantine/form";
import { propertyService } from "@services/property";
import { zodResolver } from "mantine-form-zod-resolver";
import { ChangeEvent, useEffect, useState } from "react";
import { useNotification } from "@hooks/useNotification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { extractChangesBetweenObjects } from "@utils/helpers";
import { propertySchema } from "@validations/property.validations";
import { usePropertyFormMetaData } from "@hooks/usePropertyFormMetaData";
import {
  EditPropertyFormValues,
  defaultPropertyValues,
  PropertyFormValues,
} from "@interfaces/property.interface";

export function usePropertyEditForm(pid: string) {
  const { client } = useAuth();
  const { openNotification } = useNotification();
  const [activeTab, setActiveTab] = useState("basic");
  const [originalValues, setOriginalValues] =
    useState<EditPropertyFormValues | null>(null);

  const { data: formConfig, isLoading: isConfigLoading } =
    usePropertyFormMetaData();

  const { data: propertyData, isLoading: isPropertyLoading } = useQuery({
    queryKey: ["/property", pid],
    enabled: !!pid && !!client?.csub,
    queryFn: () => propertyService.getClientProperty(client?.csub || "", pid),
  });

  const updatePropertyMutation = useMutation({
    mutationFn: (data: Partial<EditPropertyFormValues>) =>
      propertyService.updateClientProperty(client?.csub || "", pid, data),
    onSuccess: () => {
      openNotification(
        "success",
        "Property Updated",
        "Property has been successfully updated."
      );
    },
    onError: (error: any) => {
      openNotification(
        "error",
        "Update Failed",
        error.message || "Failed to update property. Please try again."
      );
    },
  });

  const form = useForm<EditPropertyFormValues>({
    initialValues: defaultPropertyValues,
    validate: zodResolver(propertySchema),
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });
  console.log("Form values", propertyData);

  useEffect(() => {
    if (propertyData) {
      form.setValues({
        ...propertyData,
      });
      setOriginalValues(propertyData);
    }
  }, [propertyData]);

  const handleSubmit = async (values: EditPropertyFormValues) => {
    if (!originalValues) {
      console.warn("Original values not available for comparison");
      return;
    }
    try {
      values.cid = client?.csub ?? "";
      const changedValues = extractChangesBetweenObjects(
        originalValues,
        values
      );
      const dataToSubmit: Partial<EditPropertyFormValues> = {
        cid: client?.csub ?? "",
        ...(changedValues || {}),
      };
      await updatePropertyMutation.mutateAsync(dataToSubmit);
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  const handleOnChange = (
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
  };

  const getPropertyTypeOptions = () => {
    if (!formConfig?.propertyTypes) return [];
    return formConfig.propertyTypes.map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  };

  const getPropertyStatusOptions = () => {
    if (!formConfig?.propertyStatuses) return [];
    return formConfig.propertyStatuses.map((status) => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
    }));
  };

  const getOccupancyStatusOptions = () => {
    if (!formConfig?.occupancyStatuses) return [];
    return formConfig.occupancyStatuses.map((status) => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
    }));
  };

  const getDocumentTypeOptions = () => {
    if (!formConfig?.documentTypes) return [];
    return formConfig.documentTypes.map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  };

  const hasTabErrors = (errors: any, tabKey: string) => {
    const tabFields = {
      basic: [
        "name",
        "propertyType",
        "status",
        "managedBy",
        "yearBuilt",
        "address.fullAddress",
        "address.unitApartment",
        "address.city",
        "address.state",
        "address.postCode",
        "address.country",
        "financialDetails.purchasePrice",
        "financialDetails.purchaseDate",
        "financialDetails.marketValue",
        "financialDetails.propertyTax",
        "financialDetails.lastAssessmentDate",
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

    return (
      tabFields[tabKey as keyof typeof tabFields]?.some((field) => {
        // nested fields
        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          return !!errors[parent as keyof typeof errors]?.[child];
        }
        return !!errors[field as keyof typeof errors];
      }) || false
    );
  };

  return {
    form,
    activeTab,
    formConfig,
    setActiveTab,
    hasTabErrors,
    propertyData,
    handleOnChange,
    isConfigLoading,
    isPropertyLoading,
    error: updatePropertyMutation.error,
    hasError: updatePropertyMutation.isError,
    handleSubmit: form.onSubmit(handleSubmit),
    isSuccess: updatePropertyMutation.isSuccess,
    successResponse: updatePropertyMutation.data,
    isSubmitting: updatePropertyMutation.isPending,
    documentTypeOptions: getDocumentTypeOptions(),
    propertyTypeOptions: getPropertyTypeOptions(),
    isLoading: isConfigLoading || isPropertyLoading,
    propertyStatusOptions: getPropertyStatusOptions(),
    occupancyStatusOptions: getOccupancyStatusOptions(),
  };
}
