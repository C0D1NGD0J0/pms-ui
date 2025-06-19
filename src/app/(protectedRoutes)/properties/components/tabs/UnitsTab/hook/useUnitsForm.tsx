/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@store/index";
import { useForm } from "@mantine/form";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { ChangeEvent, useCallback, useState } from "react";
import { propertyUnitService } from "@services/propertyUnit";
import { PropertyTypeManager } from "@utils/propertyTypeManager";
import { createUnitSchema } from "@validations/unit.validations";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useConditionalRender, useNotification } from "@hooks/index";
import { usePropertyFormMetaData } from "@app/(protectedRoutes)/properties/hooks";
import {
  StaticUnitFormConfig,
  PropertyFormValues,
} from "@interfaces/property.interface";
import {
  UnitsFormValues,
  UnitFormValues,
  UnitStatusEnum,
  UnitTypeEnum,
} from "@interfaces/unit.interface";

import { useUnitNumbering } from "./useUnitNumbering";

export function useUnitsForm({ property }: { property: PropertyFormValues }) {
  const FORM_MAX_UNITS = 20;
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const { openNotification } = useNotification();
  const [currentUnit, setCurrentUnit] = useState<UnitFormValues | null>(null);
  const { data: formConfig, isLoading: formConfigLoading } =
    usePropertyFormMetaData<StaticUnitFormConfig>("unitForm");
  const { isVisible } = useConditionalRender({
    unitType: currentUnit?.unitType,
  });
  const unitForm = useForm<UnitsFormValues>({
    initialValues: {
      units: [],
    },
  });
  const totalUnitsCreated = unitForm.values.units.length;

  const {
    customPrefix,
    setCustomPrefix,
    unitNumberingScheme,
    setUnitNumberingScheme,
    detectNumberingPattern,
    parseCustomUnit,
    validateUnitNumberFloorCorrelation,
    generateNextUnitNumber,
  } = useUnitNumbering({
    currentUnit,
    existingUnits: unitForm.values.units,
    suggestedNumber: property.unitInfo?.suggestedNextUnitNumber,
  });

  const findUnitByPuid = (puid: string): UnitFormValues | undefined => {
    return unitForm.values.units.find((unit) => (unit as any).puid === puid);
  };

  const findUnitIndexByPuid = (puid: string): number => {
    return unitForm.values.units.findIndex(
      (unit) => (unit as any).puid === puid
    );
  };

  const allowedUnitTypes = PropertyTypeManager.getAllowedUnitTypes(
    property.propertyType
  );

  const unitTypeOptions = formConfig?.unitTypes
    ? PropertyTypeManager.getFilteredUnitTypes(
        property.propertyType,
        formConfig.unitTypes
      )
    : [];

  const validateUnitWithTypeManager = (
    unit: UnitFormValues | null
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!unit) {
      errors.push("Unit is required");
      return { isValid: false, errors };
    }

    const zodValidation = createUnitSchema(unit.unitType).safeParse(unit);
    if (!zodValidation.success) {
      zodValidation.error.errors.forEach((err) => {
        errors.push(`${err.path.join(".")}: ${err.message}`);
      });
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateCurrentUnitAndSetErrors = useCallback(() => {
    if (!currentUnit) return;

    const validation = validateUnitWithTypeManager(currentUnit);
    if (!validation.isValid) {
      setFormErrors(currentUnit, validation.errors);
    } else {
      unitForm.clearErrors();
    }
  }, [currentUnit, unitForm]);

  const setFormErrors = (unit: UnitFormValues, errors: string[]) => {
    const unitIndex = findUnitIndexByPuid(unit.puid);
    if (unitIndex === -1) return;

    const formErrors: Record<string, string> = {};

    errors.forEach((error) => {
      // parse errors like "specifications.rooms: Number of room is required"
      const [fieldPath, message] = error.split(": ");
      if (fieldPath && message) {
        // Store errors in the format components expect (without units.X prefix)
        formErrors[fieldPath] = message;
      }
    });
    console.log(unit, "Unit validation result:", formErrors);
    unitForm.setErrors(formErrors);
  };

  const handleCopyUnit = () => {
    const validation = validateUnitWithTypeManager(currentUnit);
    if (!validation.isValid) {
      openNotification(
        "error",
        "Validation Error",
        `Please fix the following errors before copying:\n${validation.errors.join(
          "\n"
        )}`
      );
      return;
    }

    if (!currentUnit) return;

    // Validate unit number and floor correlation
    const floorValidation = validateUnitNumberFloorCorrelation(
      currentUnit.unitNumber,
      currentUnit.floor
    );

    if (!floorValidation.isValid) {
      openNotification(
        "error",
        "Unit Number and Floor Mismatch",
        `${floorValidation.message}\n\nPlease correct the floor number or unit number before copying.`
      );
      return;
    }

    if (totalUnitsCreated >= FORM_MAX_UNITS) {
      openNotification(
        "error",
        "Form Unit Limit Exceeded",
        `Cannot add more units. Form is limited to ${FORM_MAX_UNITS} units. For larger batches, please use CSV upload.`
      );
      return;
    }

    const newUnit: UnitFormValues = {
      ...currentUnit,
      puid: uuidv4(),
      unitNumber: generateNextUnitNumber(),
    };
    unitForm.setFieldValue("units", [...unitForm.values.units, newUnit]);
    setCurrentUnit(newUnit);

    openNotification(
      "success",
      "Unit Duplicated",
      `Unit duplicated successfully. ${totalUnitsCreated + 1} units created.`
    );
  };

  const handleRemoveUnit = (puid: string) => {
    const unitToRemove = findUnitByPuid(puid);
    if (!unitToRemove) return;

    const newUnits = unitForm.values.units.filter((unit) => unit.puid !== puid);
    unitForm.setFieldValue("units", newUnits);

    if (currentUnit?.puid === puid) {
      if (newUnits.length > 0) {
        setCurrentUnit(newUnits[0]);
      } else {
        setCurrentUnit(null);
      }
    }

    openNotification(
      "success",
      "Unit Removed",
      `Unit removed successfully. ${newUnits.length} units remaining.`
    );
  };

  const createUnitsMutation = useMutation({
    mutationFn: (data: { units: UnitFormValues[] }) => {
      if (!client?.csub) throw new Error("Client not authenticated");
      return propertyUnitService.createUnits(client.csub, property.pid, data);
    },
    onSuccess: (response, variables) => {
      if (!client?.csub) return;

      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.getPropertyUnits(
          property.pid,
          client.csub
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

  const handleSubmit = (values: UnitsFormValues) => {
    const formData = values;
    const allValidationErrors: string[] = [];
    const floorValidationErrors: string[] = [];

    formData.units.forEach((unit, index) => {
      const validation = validateUnitWithTypeManager(unit);
      if (!validation.isValid) {
        allValidationErrors.push(
          `Unit ${index + 1}: ${validation.errors.join(", ")}`
        );
      }

      // Check floor-unit number correlation
      const floorValidation = validateUnitNumberFloorCorrelation(
        unit.unitNumber,
        unit.floor
      );
      if (!floorValidation.isValid) {
        floorValidationErrors.push(
          `Unit ${index + 1}: ${floorValidation.message}`
        );
      }
    });

    if (allValidationErrors.length > 0 || floorValidationErrors.length > 0) {
      const errorMessage = [
        ...allValidationErrors,
        ...floorValidationErrors,
      ].join("\n");

      openNotification(
        "error",
        "Validation Failed",
        `Please fix the following errors:\n${errorMessage}`
      );
      return;
    }

    // Submit if validation passes
    createUnitsMutation.mutate({ units: formData.units });
  };

  const handleAddAnotherUnit = () => {
    if (totalUnitsCreated >= FORM_MAX_UNITS) {
      openNotification(
        "error",
        "Form Unit Limit Exceeded",
        `Cannot add more units. Form is limited to ${FORM_MAX_UNITS} units. For larger batches, please use CSV upload.`
      );
      return;
    }

    const defaultUnitType =
      allowedUnitTypes.length > 0
        ? allowedUnitTypes[0]
        : UnitTypeEnum.RESIDENTIAL;

    const newUnit: UnitFormValues = {
      unitNumber: generateNextUnitNumber(),
      unitType: defaultUnitType as any,
      status: UnitStatusEnum.AVAILABLE,
      floor: 1,
      isActive: true,
      specifications: {
        totalArea: 450,
        rooms: 3,
        bathrooms: 2,
        maxOccupants: 5,
      },
      amenities: {
        airConditioning: false,
        heating: true,
        washerDryer: true,
        dishwasher: true,
        parking: false,
        storage: false,
        cableTV: false,
        internet: false,
      },
      utilities: {
        gas: false,
        trash: false,
        water: true,
        heating: true,
        centralAC: false,
      },
      fees: {
        rentAmount: 1800,
        securityDeposit: 0,
        currency: "USD" as const,
      },
      description: "",
      puid: uuidv4(),
    };

    unitForm.setFieldValue("units", [...unitForm.values.units, newUnit]);
    handleUnitSelect(newUnit);
    validateCurrentUnitAndSetErrors();
  };

  const handleUnitSelect = (unit: UnitFormValues) => {
    setCurrentUnit(unit);
  };

  const handleUnitChange = (updatedUnit: UnitFormValues) => {
    const index = findUnitIndexByPuid(updatedUnit.puid);
    if (index !== -1) {
      unitForm.setFieldValue(`units.${index}`, updatedUnit);
      setCurrentUnit(updatedUnit);
      validateCurrentUnitAndSetErrors();

      // Auto-detect numbering pattern when unit number is manually changed
      if (updatedUnit.unitNumber !== currentUnit?.unitNumber) {
        const detectedPattern = detectNumberingPattern(updatedUnit.unitNumber);
        if (detectedPattern !== unitNumberingScheme) {
          setUnitNumberingScheme(detectedPattern);

          // Extract and set custom prefix if detected as custom pattern
          if (detectedPattern === "custom") {
            const parsed = parseCustomUnit(updatedUnit.unitNumber);
            if (parsed) {
              setCustomPrefix(parsed.prefix);
            }
          }
        }

        // Check for floor-unit number correlation and show warning
        const floorValidation = validateUnitNumberFloorCorrelation(
          updatedUnit.unitNumber,
          updatedUnit.floor
        );

        if (!floorValidation.isValid && floorValidation.suggestedFloor) {
          openNotification(
            "warning",
            "Floor and Unit Number Mismatch",
            `${floorValidation.message}\n\nConsider updating the floor to ${floorValidation.suggestedFloor} to match the unit number pattern.`
          );
        }
      }

      // Check for floor changes
      if (currentUnit && updatedUnit.floor !== currentUnit.floor) {
        const floorValidation = validateUnitNumberFloorCorrelation(
          updatedUnit.unitNumber,
          updatedUnit.floor
        );

        if (!floorValidation.isValid) {
          openNotification(
            "warning",
            "Floor and Unit Number Mismatch",
            `${floorValidation.message}\n\nThe unit number may need to be updated to match the new floor.`
          );
        }
      }
    }
  };

  const handleOnChange = useCallback(
    (
      e:
        | ChangeEvent<
            | HTMLInputElement
            | HTMLSelectElement
            | HTMLTextAreaElement
            | HTMLSelectElement
          >
        | string,
      field?: keyof UnitFormValues | string
    ) => {
      if (!currentUnit) return;

      if (typeof e === "string" && field) {
        if (typeof field === "string" && field.includes(".")) {
          const [parent, child] = field.split(".");
          const parentValue = currentUnit[parent as keyof UnitFormValues];
          if (
            parentValue &&
            typeof parentValue === "object" &&
            !Array.isArray(parentValue)
          ) {
            const updatedUnit = {
              ...currentUnit,
              [parent]: {
                ...parentValue,
                [child]: e,
              },
            };
            handleUnitChange(updatedUnit);
          }
        } else {
          const updatedUnit = {
            ...currentUnit,
            [field]: e,
          };
          handleUnitChange(updatedUnit);
        }
        return;
      } else if (typeof e !== "string") {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name.includes(".")) {
          const [parent, child] = name.split(".");
          const parentValue = currentUnit[parent as keyof UnitFormValues];
          if (
            parentValue &&
            typeof parentValue === "object" &&
            !Array.isArray(parentValue)
          ) {
            const updatedUnit = {
              ...currentUnit,
              [parent]: {
                ...parentValue,
                [child]: type === "checkbox" ? checked : value,
              },
            };
            handleUnitChange(updatedUnit);
          }
        } else {
          const updatedUnit = {
            ...currentUnit,
            [name]: type === "checkbox" ? checked : value,
          };
          handleUnitChange(updatedUnit);
        }
      }
    },
    [currentUnit, handleUnitChange]
  );

  const canAddUnit = totalUnitsCreated <= FORM_MAX_UNITS;
  const canRemoveUnit = totalUnitsCreated > 0;

  return {
    unitForm,
    isVisible,
    formConfig,
    canAddUnit,
    currentUnit,
    customPrefix,
    canRemoveUnit,
    setCurrentUnit,
    handleCopyUnit,
    handleOnChange,
    unitTypeOptions,
    setCustomPrefix,
    handleRemoveUnit,
    handleUnitSelect,
    handleUnitChange,
    formConfigLoading,
    handleAddAnotherUnit,
    validateUnit: validateUnitWithTypeManager,
    isSubmitting: createUnitsMutation.isPending,
    handleSubmit: unitForm.onSubmit(handleSubmit),
  };
}
