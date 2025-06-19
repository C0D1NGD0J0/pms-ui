import { useAuth } from "@store/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { extractChanges } from "@utils/helpers";
import { PropertyModel } from "@models/property";
import { UseFormReturnType } from "@mantine/form";
import { propertyService } from "@services/property";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { useNotification } from "@hooks/useNotification";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  EditPropertyFormValues,
  PropertyFormValues,
  IPropertyDocument,
  IPropertyModel,
} from "@interfaces/property.interface";

export function usePropertyEditForm({
  propertyForm,
  pid,
}: {
  propertyForm: UseFormReturnType<PropertyFormValues>;
  pid: string;
}) {
  const router = useRouter();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const { openNotification } = useNotification();
  const [originalValues, setOriginalValues] =
    useState<IPropertyDocument | null>(null);

  const propertyData = useQuery<IPropertyDocument>({
    enabled: !!pid && !!client?.csub,
    queryKey: PROPERTY_QUERY_KEYS.getPropertyByPid(client!.csub, pid),
    queryFn: () => propertyService.getClientProperty(client!.csub, pid),
  });

  useEffect(() => {
    if (propertyData.data) {
      propertyForm.setValues(propertyData.data);
      setOriginalValues(propertyData.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyData.data]);

  const updatePropertyMutation = useMutation({
    mutationFn: (data: Partial<EditPropertyFormValues>) =>
      propertyService.updateClientProperty(client?.csub || "", pid, data),
    onError: (error: any) => {
      openNotification(
        "error",
        "Update Failed",
        error.message || "Failed to update property. Please try again."
      );
    },
  });

  const handleUpdateSubmit = async (values: EditPropertyFormValues) => {
    if (!originalValues) {
      console.warn("Original values not available for comparison");
      return;
    }
    try {
      values.cid = client?.csub ?? "";
      const changedValues: Partial<EditPropertyFormValues | null> =
        extractChanges(originalValues, values, {
          ignoreKeys: ["cid"],
        });
      if (changedValues) {
        await updatePropertyMutation.mutateAsync(changedValues);
      }
      openNotification(
        "success",
        "Property Updated",
        "Property has been successfully updated."
      );
      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.getPropertyByPid(client?.csub || "", pid),
      });
      router.push("/properties");
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return {
    propertyData: propertyData.data,
    error: updatePropertyMutation.error,
    isDataLoading: propertyData.isLoading,
    hasError: updatePropertyMutation.isError,
    isSuccess: updatePropertyMutation.isSuccess,
    successResponse: updatePropertyMutation.data,
    isSubmitting: updatePropertyMutation.isPending,
    handleUpdate: propertyForm.onSubmit(handleUpdateSubmit),
  };
}
