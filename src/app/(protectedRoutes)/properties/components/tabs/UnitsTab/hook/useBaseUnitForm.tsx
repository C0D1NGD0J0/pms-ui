/* eslint-disable react-hooks/exhaustive-deps */
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@store/index";
import { useForm } from "@mantine/form";
import { ChangeEvent, useCallback, useState, useMemo } from "react";
import { PropertyTypeManager } from "@utils/propertyTypeManager";
import { createUnitSchema } from "@validations/unit.validations";
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

export interface BaseUnitFormConfig {
  mode: "create" | "edit" | "hybrid";
  maxUnits?: number;
}

export function useBaseUnitForm({
  property,
  config,
}: {
  property: PropertyFormValues;
  config: BaseUnitFormConfig;
}) {
  const FORM_MAX_UNITS = config.maxUnits || 20;
  const { client } = useAuth();
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

  // Memoize expensive calculations
  const allowedUnitTypes = useMemo(
    () => PropertyTypeManager.getAllowedUnitTypes(property.propertyType),
    [property.propertyType]
  );

  const unitTypeOptions = useMemo(
    () =>
      formConfig?.unitTypes
        ? PropertyTypeManager.getFilteredUnitTypes(
            property.propertyType,
            formConfig.unitTypes
          )
        : [],
    [property.propertyType, formConfig?.unitTypes]
  );

  // validations
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

  const copyUnitForCreation = (sourceUnit: UnitFormValues): UnitFormValues => {
    // Deep clone user-editable fields, excluding backend fields
    const deepClonedFields = {
      unitType: sourceUnit.unitType,
      status: sourceUnit.status,
      floor: sourceUnit.floor,
      isActive: sourceUnit.isActive,
      // Deep clone nested objects
      specifications: {
        ...sourceUnit.specifications,
      },
      amenities: {
        ...sourceUnit.amenities,
      },
      utilities: {
        ...sourceUnit.utilities,
      },
      fees: {
        ...sourceUnit.fees,
      },
      description: sourceUnit.description,
    };

    return {
      ...deepClonedFields,
      puid: uuidv4(),
      unitNumber: generateNextUnitNumber(sourceUnit.unitNumber),
    };
  };

  // unit management - optimized with useCallback for child components
  const handleCopyUnit = useCallback(() => {
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

    // check unit number and floor correlation
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

    const newUnit = copyUnitForCreation(currentUnit);
    unitForm.setFieldValue("units", [...unitForm.values.units, newUnit]);
    setCurrentUnit(newUnit);

    openNotification(
      "success",
      "Unit Duplicated",
      `Unit duplicated successfully. ${totalUnitsCreated + 1} units created.`
    );
  }, [
    currentUnit,
    validateUnitWithTypeManager,
    openNotification,
    validateUnitNumberFloorCorrelation,
    totalUnitsCreated,
    FORM_MAX_UNITS,
    copyUnitForCreation,
    unitForm,
    setCurrentUnit,
  ]);

  const handleRemoveUnit = useCallback(
    (puid: string) => {
      const unitToRemove = findUnitByPuid(puid);
      if (!unitToRemove) return;
      console.log("Removing unit:", unitToRemove);
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
    },
    [
      findUnitByPuid,
      unitForm,
      currentUnit,
      allUnits,
      setCurrentUnit,
      openNotification,
    ]
  );

  const handleUnitSelect = useCallback((unit: UnitFormValues) => {
    console.log("Selecting unit:", unit);
    setCurrentUnit(unit);
  }, []);

  const handleUnitChange = (updatedUnit: UnitFormValues) => {
    // check if this is a saved unit being edited for the first time
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
    if (
      updatedUnit.puid === currentUnit?.puid &&
      updatedUnit.unitNumber !== currentUnit?.unitNumber
    ) {
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

  const createDefaultUnit = (): UnitFormValues => {
    const defaultUnitType =
      allowedUnitTypes.length > 0
        ? allowedUnitTypes[0]
        : UnitTypeEnum.RESIDENTIAL;

    return {
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
  };

  const canAddUnit = totalUnitsCreated < FORM_MAX_UNITS;
  const isEditableItem =
    currentUnit && currentUnit.propertyId && currentUnit.id;

  return {
    unitForm,
    currentUnit,
    setCurrentUnit,
    allUnits,
    savedUnits,
    newUnits,
    totalUnitsCreated,

    formConfig,
    formConfigLoading,
    isVisible,
    unitTypeOptions,
    allowedUnitTypes,
    canAddUnit,
    isEditableItem,

    customPrefix,
    setCustomPrefix,
    unitNumberingScheme,
    setUnitNumberingScheme,
    generateNextUnitNumber,

    findUnitByPuid,
    findUnitIndexByPuid,
    findNewUnitIndexByPuid,
    createDefaultUnit,

    validateUnit: validateUnitWithTypeManager,
    validateCurrentUnitAndSetErrors,
    setFormErrors,

    handleUnitSelect,
    handleUnitChange,
    handleOnChange,
    handleCopyUnit,
    handleRemoveUnit,

    handleLoadMore,
    hasNextPage,
    isFetchingNextPage,
    openNotification,
    FORM_MAX_UNITS,
  };
}
