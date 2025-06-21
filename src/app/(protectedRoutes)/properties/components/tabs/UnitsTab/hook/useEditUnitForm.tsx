import { useAuth } from "@store/index";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { useNotification } from "@hooks/useNotification";
import { UnitFormValues } from "@interfaces/unit.interface";
import { propertyUnitService } from "@services/propertyUnit";
import { PropertyFormValues } from "@interfaces/property.interface";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { useBaseUnitForm } from "./useBaseUnitForm";

export function useEditUnitForm({
  property,
}: {
  property: PropertyFormValues;
}) {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const { openNotification } = useNotification();
  const baseUnitForm = useBaseUnitForm({
    property,
    config: { mode: "edit", maxUnits: 1 }, // edit mode handles one unit at a time
  });

  const { currentUnit, validateUnit } = baseUnitForm;

  const updateUnitMutation = useMutation({
    mutationFn: async (data: UnitFormValues) => {
      if (!client?.csub) throw new Error("Client not authenticated");
      if (!data.propertyId) {
        throw new Error("Property ID is required for updating units");
      }
      return await propertyUnitService.updateUnit(
        client.csub,
        property.pid,
        data
      );
    },
    onSuccess: () => {
      if (!client?.csub) return;

      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.getPropertyUnits(
          client.csub,
          property.pid,
          {
            limit: 2,
            sortBy: "floor",
          }
        ),
      });

      openNotification(
        "success",
        "Unit Updated",
        `Successfully updated unit ${currentUnit?.unitNumber}, on floor ${currentUnit?.floor}.`
      );
    },
    onError: (error: any) => {
      console.error("Error updating unit:", error);
      openNotification(
        "error",
        "Failed to Update Unit",
        error?.response?.data?.message ||
          "An error occurred while updating the unit."
      );
    },
  });

  const handleUpdateUnit = (unit: UnitFormValues) => {
    if (!unit.propertyId) {
      openNotification(
        "error",
        "Property ID Missing",
        "Cannot update unit without a valid property ID."
      );
      return;
    }

    const validation = validateUnit(unit);
    if (!validation.isValid) {
      openNotification(
        "error",
        "Validation Error",
        `Please fix the following errors before updating:\n${validation.errors.join(
          "\n"
        )}`
      );
      return;
    }

    updateUnitMutation.mutate(unit);
  };

  const handleSubmit = () => {
    if (!currentUnit) {
      openNotification(
        "error",
        "No Unit Selected",
        "Please select a unit to update."
      );
      return;
    }

    handleUpdateUnit(currentUnit);
  };

  return {
    ...baseUnitForm,
    handleSubmit,
    handleUpdateUnit,
    isEditableItem: true,
    isSubmitting: updateUnitMutation.isPending,
  };
}
