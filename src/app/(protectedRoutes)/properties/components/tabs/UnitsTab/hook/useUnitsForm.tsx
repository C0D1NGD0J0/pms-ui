import { useAuth } from "@store/index";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { useNotification } from "@hooks/useNotification";
import { propertyUnitService } from "@services/propertyUnit";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { PropertyFormValues } from "@interfaces/property.interface";
import { UnitsFormValues, UnitFormValues } from "@interfaces/unit.interface";

import { useBaseUnitForm } from "./useBaseUnitForm";

export function useUnitsForm({ property }: { property: PropertyFormValues }) {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const { openNotification } = useNotification();

  const baseUnitForm = useBaseUnitForm({
    property,
    config: { mode: "create", maxUnits: 20 },
  });

  const {
    unitForm,
    validateUnit,
    FORM_MAX_UNITS,
    totalUnitsCreated,
    createDefaultUnit,
  } = baseUnitForm;

  const createUnitsMutation = useMutation({
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
    },
    onError: (error: any) => {
      console.error("Error creating units:", error);
      openNotification(
        "error",
        "Failed to Create Units",
        error?.response?.data?.message ||
          "An error occurred while creating units."
      );
    },
  });

  const handleAddAnotherUnit = () => {
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
    baseUnitForm.handleUnitSelect(newUnit);
    baseUnitForm.validateCurrentUnitAndSetErrors();
  };

  const handleSubmit = (values: UnitsFormValues) => {
    const formData = values;
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

    createUnitsMutation.mutate({ units: formData.units });
  };

  return {
    ...baseUnitForm,
    handleAddAnotherUnit,
    isSubmitting: createUnitsMutation.isPending,
    handleSubmit: unitForm.onSubmit(handleSubmit),
  };
}
