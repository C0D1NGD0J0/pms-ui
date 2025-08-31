import { useCallback } from "react";
import { useAuth } from "@store/index";
import { parseError } from "@utils/index";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { propertyUnitService } from "@services/propertyUnit";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { PropertyFormValues } from "@interfaces/property.interface";
import { UnitsFormValues, UnitFormValues } from "@interfaces/unit.interface";

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
    mutationFn: async (data: {
      units: UnitFormValues[];
      cuid: string;
      pid: string;
    }) => {
      if (!client?.cuid) throw new Error("Client not authenticated");
      return await propertyUnitService.createUnits(
        client.cuid,
        property.pid,
        data
      );
    },
    onSuccess: (_response, variables) => {
      if (!client?.cuid) return;

      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.getPropertyUnits(
          client.cuid,
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
          client.cuid
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

      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, errors]) => {
          unitForm.setFieldError(field, (errors as any)[0]);
        });
      }

      openNotification("error", "Failed to Create Units", message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UnitFormValues) => {
      if (!client?.cuid) throw new Error("Client not authenticated");
      if (!data.propertyId) {
        throw new Error("Property ID is required for updating units");
      }
      return await propertyUnitService.updateUnit(
        client.cuid,
        property.pid,
        data
      );
    },
    onSuccess: () => {
      if (!client?.cuid) return;

      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.getPropertyUnits(
          client.cuid,
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

      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, errors]) => {
          unitForm.setFieldError(field, (errors as any)[0]);
        });
      }

      openNotification("error", "Failed to Update Unit", message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (puid: string) => {
      if (!client?.cuid) throw new Error("Client not authenticated");
      return await propertyUnitService.deleteUnit(
        client.cuid,
        property.pid,
        puid
      );
    },
    onSuccess: (_, puid) => {
      if (!client?.cuid) return;

      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.getPropertyUnits(
          client.cuid,
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
          client.cuid
        ),
      });

      const updatedUnits = unitForm.values.units.filter(
        (unit) => unit.puid !== puid
      );
      unitForm.setFieldValue("units", updatedUnits);
      if (currentUnit?.puid === puid) {
        if (updatedUnits.length > 0) {
          baseForm.handleUnitSelect(updatedUnits[updatedUnits.length - 1]);
        } else {
          baseForm.setCurrentUnit(null);
        }
      }

      openNotification(
        "success",
        "Unit Deleted",
        "Unit has been permanently deleted."
      );
    },
    onError: (error: any) => {
      const { message } = parseError(error);
      console.error("Error deleting unit:", error);
      openNotification("error", "Failed to Delete Unit", message);
    },
  });

  const isEditMode = !!(currentUnit?.propertyId && currentUnit?.id);
  const isSubmitting = isEditMode
    ? updateMutation.isPending
    : createMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const handleDeleteUnit = useCallback(
    (unit: UnitFormValues) => {
      if (!unit.id || !unit.propertyId || !unit.puid) {
        openNotification(
          "error",
          "Cannot Delete Unit",
          "Only saved units can be deleted permanently."
        );
        return;
      }

      deleteMutation.mutate(unit.puid);
    },
    [deleteMutation, openNotification]
  );

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

    updateMutation.mutate(unit);
  };

  const handleSubmit = (values: UnitsFormValues) => {
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
      const newUnits = formData.units.filter((unit) => {
        if (!unit.propertyId && !unit.id) {
          return true;
        }
      });
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

      createMutation.mutate({
        units: newUnits,
        cuid: values.cuid,
        pid: values.pid,
      });
    }
  };

  return {
    ...baseForm,
    isEditMode,
    isSubmitting,
    isDeleting,
    handleDeleteUnit,
    handleAddAnotherUnit,
    handleSubmit: isEditMode ? handleSubmit : unitForm.onSubmit(handleSubmit),
  };
}
