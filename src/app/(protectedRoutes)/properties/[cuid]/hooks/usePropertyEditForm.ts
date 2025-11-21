import { useAuth } from "@store/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { extractChanges } from "@utils/helpers";
import { UseFormReturnType } from "@mantine/form";
import { propertyService } from "@services/property";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { useNotification } from "@hooks/useNotification";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  EditPropertyFormValues,
  PropertyFormValues,
  IPropertyDocument,
} from "@interfaces/property.interface";

import { usePropertyData } from "./usePropertyData";

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

  const { data: propertyData, isLoading: isDataLoading } = usePropertyData(pid);

  useEffect(() => {
    if (propertyData) {
      // Normalize date fields to empty strings consistently for both form and original values
      const normalizedFinancialDetails = {
        ...propertyData.property.financialDetails,
        lastAssessmentDate:
          propertyData.property.financialDetails?.lastAssessmentDate || "",
        purchaseDate:
          propertyData.property.financialDetails?.purchaseDate || "",
      };

      propertyForm.setValues({
        ...propertyData.property,
        financialDetails: normalizedFinancialDetails,
        unitInfo: propertyData?.unitInfo,
      });

      setOriginalValues({
        ...propertyData.property,
        financialDetails: normalizedFinancialDetails,
        unitInfo: propertyData?.unitInfo,
      });
    }
  }, [propertyData]);

  const updatePropertyMutation = useMutation({
    mutationFn: (data: Partial<EditPropertyFormValues>) =>
      propertyService.updateClientProperty(client?.cuid || "", pid, data),
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
      values.cuid = client?.cuid ?? "";
      const changedValues: Partial<EditPropertyFormValues | null> =
        extractChanges(originalValues, values, {
          ignoreKeys: ["cuid"],
        });

      console.log(values, "Changed Values:", originalValues);
      if (changedValues) {
        await updatePropertyMutation.mutateAsync(changedValues);
      }
      openNotification(
        "success",
        "Property Updated",
        "Property has been successfully updated."
      );
      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.getPropertyByPid(client?.cuid || "", pid),
      });
      router.push("/properties");
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return {
    propertyData,
    error: updatePropertyMutation.error,
    isDataLoading,
    hasError: updatePropertyMutation.isError,
    isSuccess: updatePropertyMutation.isSuccess,
    successResponse: updatePropertyMutation.data,
    isSubmitting: updatePropertyMutation.isPending,
    handleUpdate: propertyForm.onSubmit(handleUpdateSubmit),
  };
}
