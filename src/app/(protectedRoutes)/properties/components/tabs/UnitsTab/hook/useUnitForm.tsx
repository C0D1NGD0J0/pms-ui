import { useCallback } from "react";
import { useAuth } from "@store/index";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { propertyUnitService } from "@services/propertyUnit";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { PropertyFormValues } from "@interfaces/property.interface";
import { UnitsFormValues, UnitFormValues } from "@interfaces/unit.interface";
import { parseError } from "@utils/errorParser";

import { useBaseUnitForm } from "./useBaseUnitForm";

export function useUnitForm({ property }: { property: PropertyFormValues }) {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const baseForm = useBaseUnitForm({
    property,
    config: { mode: "hybrid", maxUnits: 20 },
  });

  const {
    currentUnit,
    validateUnit,
    openNotification,
    unitForm,
    createDefaultUnit,
    handleUnitSelect,
    totalUnitsCreated,
    FORM_MAX_UNITS,
  } = baseForm;

  const createMutation = useMutation({
    mutationFn: async (data: { units: UnitFormValues[] }) => {
      if (!client?.csub) throw new Error("Client not authenticated");
      return await propertyUnitService.createUnits(
        client.csub,
        property.pid,
        data
      );
    },
    onSuccess: (_response, variables) => {
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
      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.getPropertyByPid(
          property.pid,
          client.csub
        ),
      });

      openNotification(
        "success",
        "Units Created",
        `Successfully created ${variables.units.length} units.`
      );

      // Clear the form after successful creation
      unitForm.setFieldValue("units", []);
    },
    onError: (error: any) => {
      const { message, fieldErrors } = parseError(error);
      console.error("Error creating units:", error);

      // Apply field errors to form if they exist
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, errors]) => {
          unitForm.setFieldError(field, errors[0]); // Use first error message
        });
      }

      openNotification("error", "Failed to Create Units", message);
    },
  });

  const updateMutation = useMutation({
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
      const { message, fieldErrors } = parseError(error);
      console.error("Error updating unit:", error);

      // Apply field errors to form if they exist
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, errors]) => {
          unitForm.setFieldError(field, errors[0]); // Use first error message
        });
      }

      openNotification("error", "Failed to Update Unit", message);
    },
  });

  const isEditMode = !!(currentUnit?.propertyId && currentUnit?.id);
  const isSubmitting = isEditMode
    ? updateMutation.isPending
    : createMutation.isPending;

  const handleAddAnotherUnit = useCallback(() => {
    if (totalUnitsCreated >= FORM_MAX_UNITS) {
      openNotification(
        "error",
        "Form Unit Limit Exceeded",
        `Cannot add more units. Form is limited to ${FORM_MAX_UNITS} units. For larger batches, please use CSV upload.`
      );
      return;
    }

    const newUnit = createDefaultUnit();
    unitForm.setFieldValue("units", [...unitForm.values.units, newUnit]);
    handleUnitSelect(newUnit);
    baseForm.validateCurrentUnitAndSetErrors();
  }, [
    totalUnitsCreated,
    FORM_MAX_UNITS,
    openNotification,
    createDefaultUnit,
    unitForm,
    handleUnitSelect,
    baseForm,
  ]);

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
    console.log("Updating unit:", unit);
    updateMutation.mutate(unit);
  };

  const handleSubmit = (values?: UnitsFormValues) => {
    if (isEditMode) {
      if (!currentUnit) {
        openNotification(
          "error",
          "No Unit Selected",
          "Please select a unit to update."
        );
        return;
      }
      handleUpdateUnit(currentUnit);
    } else {
      const formData = values || unitForm.values;
      const allValidationErrors: string[] = [];

      formData.units.forEach((unit, index) => {
        const validation = validateUnit(unit);
        if (!validation.isValid) {
          allValidationErrors.push(
            `Unit ${index + 1}: ${validation.errors.join(", ")}`
          );
        }
      });

      if (allValidationErrors.length > 0) {
        const errorMessage = allValidationErrors.join("\n");
        openNotification(
          "error",
          "Validation Failed",
          `Please fix the following errors:\n${errorMessage}`
        );
        return;
      }

      createMutation.mutate({ units: formData.units });
    }
  };

  return {
    ...baseForm,
    isEditMode,
    isSubmitting,
    handleAddAnotherUnit,
    handleUpdateUnit: isEditMode ? handleUpdateUnit : undefined,
    handleSubmit: isEditMode ? handleSubmit : unitForm.onSubmit(handleSubmit),
  };
}
