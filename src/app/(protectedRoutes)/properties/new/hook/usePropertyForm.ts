import { useAuth } from "@store/index";
import { useMutation } from "@tanstack/react-query";
import { propertyService } from "@services/property";
import { PropertyFormValues } from "@interfaces/property.interface";

export function usePropertyForm() {
  const { client } = useAuth();
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
    handleSubmit,
    error: createPropertyMutation.error,
    hasError: createPropertyMutation.isError,
    isSuccess: createPropertyMutation.isSuccess,
    successResponse: createPropertyMutation.data,
    isSubmitting: createPropertyMutation.isPending,
  };
}
