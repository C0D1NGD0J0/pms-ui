import { useAuth } from "@store/index";
import { useMutation } from "@tanstack/react-query";
import { propertyService } from "@services/property";
import { PropertyFormValues } from "@interfaces/property.interface";
import { usePropertyFormBase } from "@hooks/property/usePropertyFormBase";

export function usePropertyForm() {
  const { client } = useAuth();
  const baseHook = usePropertyFormBase();

  const {
    form,
    activeTab,
    setActiveTab,
    formConfig,
    isConfigLoading,
    handleOnChange,
    hasTabErrors,
    propertyTypeOptions,
    propertyStatusOptions,
    occupancyStatusOptions,
    documentTypeOptions,
  } = baseHook;

  const createPropertyMutation = useMutation({
    mutationFn: (data: PropertyFormValues) =>
      propertyService.createProperty(data.cid ?? "", data),
  });

  const handleSubmit = async (values: PropertyFormValues) => {
    try {
      values.cid = client?.csub ?? "";
      await createPropertyMutation.mutateAsync(values);
    } catch (error) {
      console.error("Error creating property:", error);
    }
  };

  return {
    form,
    activeTab,
    setActiveTab,
    formConfig,
    isConfigLoading,
    handleOnChange,
    hasTabErrors,
    hasError: createPropertyMutation.isError,
    error: createPropertyMutation.error,
    isSuccess: createPropertyMutation.isSuccess,
    successResponse: createPropertyMutation.data,
    isSubmitting: createPropertyMutation.isPending,
    handleSubmit: form.onSubmit(handleSubmit),
    propertyTypeOptions,
    propertyStatusOptions,
    occupancyStatusOptions,
    documentTypeOptions,
  };
}
