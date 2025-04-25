import { useForm } from "@mantine/form";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { propertyService } from "@services/property";
import { zodResolver } from "mantine-form-zod-resolver";
import { propertySchema } from "@validations/property.validations";
import { usePropertyFormMetaData } from "@hooks/usePropertyFormMetaData";
import {
  defaultPropertyValues,
  PropertyFormValues,
} from "@interfaces/property.interface";

export function usePropertyForm() {
  const [activeTab, setActiveTab] = useState("basic");

  const { data: formConfig, isLoading: isConfigLoading } =
    usePropertyFormMetaData();

  const createPropertyMutation = useMutation({
    mutationFn: (data: PropertyFormValues) =>
      propertyService.createProperty(data.cid, data),
  });

  const form = useForm<PropertyFormValues>({
    initialValues: defaultPropertyValues,
    validate: zodResolver(propertySchema),
    validateInputOnBlur: true,
  });

  const handleSubmit = async (values: PropertyFormValues) => {
    try {
      await createPropertyMutation.mutateAsync(values);
    } catch (error) {
      console.error("Error creating property:", error);
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

  return {
    form,
    activeTab,
    setActiveTab,
    formConfig,
    isConfigLoading,
    handleOnChange,
    hasError: createPropertyMutation.isError,
    error: createPropertyMutation.error,
    isSuccess: createPropertyMutation.isSuccess,
    successResponse: createPropertyMutation.data,
    isSubmitting: createPropertyMutation.isPending,
    handleSubmit: form.onSubmit(handleSubmit),

    propertyTypeOptions: getPropertyTypeOptions(),
    propertyStatusOptions: getPropertyStatusOptions(),
    occupancyStatusOptions: getOccupancyStatusOptions(),
    documentTypeOptions: getDocumentTypeOptions(),
  };
}
