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
import {
  StaticUnitFormConfig,
  PropertyFormValues,
} from "@interfaces/property.interface";
import {
  usePropertyFormMetaData,
  useGetPropertyUnits,
} from "@app/(protectedRoutes)/properties/hooks";
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
  const {
    data: savedUnitsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPropertyUnits(client?.csub || "", property.pid, {
    limit: 2,
    sortBy: "floor",
  });

  // Flatten the infinite query data
  const savedUnits =
    savedUnitsData?.pages?.flatMap((page) => page?.items || []) || [];

  const unitForm = useForm<UnitsFormValues>({
    initialValues: {
      units: [],
      cid: client?.csub || "",
      pid: property.pid,
    },
  });

  const newUnits = unitForm.values.units;
  const allUnits = [...savedUnits, ...newUnits] as UnitFormValues[];
  const totalUnitsCreated = newUnits.length;

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
    return allUnits.find((unit) => (unit as any).puid === puid);
  };

  const findUnitIndexByPuid = (puid: string): number => {
    return allUnits.findIndex((unit) => (unit as any).puid === puid);
  };

  const findNewUnitIndexByPuid = (puid: string): number => {
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
      const [fieldPath, message] = error.split(": ");
      if (fieldPath && message) {
        formErrors[fieldPath] = message;
      }
    });
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

    if (!unitToRemove.propertyId) {
      const newUnits = unitForm.values.units.filter(
        (unit) => unit.puid !== puid
      );
      unitForm.setFieldValue("units", newUnits);
    }

    if (currentUnit?.puid === puid) {
      if (allUnits.length > 1) {
        // Select another unit (prefer new units, then saved units)
        const remainingUnits = allUnits.filter(
          (unit) => (unit as any).puid !== puid
        );
        setCurrentUnit(remainingUnits[remainingUnits.length - 1]);
      } else {
        setCurrentUnit(null);
      }
    }

    openNotification(
      "success",
      "Unit Removed",
      `Unit removed successfully. ${newUnits.length} new units remaining.`
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
    // Check if this is a saved unit being edited for the first time
    const isSavedUnit = savedUnits.some(
      (unit) => (unit as any).puid === (updatedUnit as any).puid
    );

    if (isSavedUnit) {
      // Move saved unit to form state for editing
      const newFormUnits = [...unitForm.values.units, updatedUnit];
      unitForm.setFieldValue("units", newFormUnits);
      setCurrentUnit(updatedUnit);
      validateCurrentUnitAndSetErrors();
    } else {
      // Handle new unit (already in form)
      const index = findNewUnitIndexByPuid((updatedUnit as any).puid);
      if (index !== -1) {
        unitForm.setFieldValue(`units.${index}`, updatedUnit);
        setCurrentUnit(updatedUnit);
        validateCurrentUnitAndSetErrors();
      }
    }

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

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const canAddUnit = totalUnitsCreated <= FORM_MAX_UNITS;
  return {
    unitForm,
    isVisible,
    formConfig,
    canAddUnit,
    currentUnit,
    customPrefix,
    setCurrentUnit,
    handleCopyUnit,
    handleOnChange,
    unitTypeOptions,
    setCustomPrefix,
    unitNumberingScheme,
    setUnitNumberingScheme,
    handleRemoveUnit,
    handleUnitSelect,
    handleUnitChange,
    formConfigLoading,
    handleAddAnotherUnit,
    handleLoadMore,
    hasNextPage,
    isFetchingNextPage,
    allUnits,
    validateUnit: validateUnitWithTypeManager,
    isSubmitting: createUnitsMutation.isPending,
    handleSubmit: unitForm.onSubmit(handleSubmit),
  };
}
