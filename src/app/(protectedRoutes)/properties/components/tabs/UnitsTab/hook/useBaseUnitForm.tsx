import { v4 as uuidv4 } from "uuid";
import { useForm } from "@mantine/form";
import { extractChanges } from "@utils/helpers";
import { useUnitFormStaticData, useAuth } from "@store/index";
import { PropertyTypeManager } from "@utils/propertyTypeManager";
import { createUnitSchema } from "@validations/unit.validations";
import { PropertyFormValues } from "@interfaces/property.interface";
import { usePropertyFormRenderer, useNotification } from "@hooks/index";
import { useGetPropertyUnits } from "@app/(protectedRoutes)/properties/hooks";
import { ChangeEvent, useCallback, useEffect, useState, useMemo } from "react";
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
  const [originalUnit, setOriginalUnit] = useState<UnitFormValues | null>(null);

  const { data: formConfig, loading: formConfigLoading } =
    useUnitFormStaticData();
  const { isVisible } = usePropertyFormRenderer({
    unitType: currentUnit?.unitType,
  });

  const {
    data: savedUnitsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPropertyUnits(client?.cuid || "", property.pid, {
    limit: 2,
    page: 1,
    sortBy: "floor",
  });

  // Flatten the infinite query data
  const savedUnits =
    savedUnitsData?.pages?.flatMap((page) => page?.items || []) || [];

  const unitForm = useForm<UnitsFormValues>({
    initialValues: {
      units: [],
      cuid: client?.cuid || "",
      pid: property.pid,
    },
  });

  useEffect(() => {
    if (savedUnits.length > 0) {
      const firstSavedUnit = savedUnits[0];
      setCurrentUnit(firstSavedUnit as UnitFormValues);
      setOriginalUnit(firstSavedUnit as UnitFormValues);
      unitForm.setFieldValue("units", savedUnits);
    }
  }, [savedUnitsData?.pages]);

  const newUnits = unitForm.values.units;
  const totalUnitsCreated = newUnits.length;

  const hasUnsavedChanges = useMemo(() => {
    if (!currentUnit || !originalUnit) return false;
    if (!currentUnit.propertyId || !currentUnit.id) return false; // only perform this for saved units

    const changes = extractChanges(originalUnit, currentUnit);
    return changes !== null;
  }, [currentUnit, originalUnit]);

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

  const findNewUnitIndexByPuid = (puid: string): number => {
    return unitForm.values.units.findIndex(
      (unit) => (unit as any).puid === puid
    );
  };

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
    const unitIndex = findUnitIndexByPuid(unit?.puid || "");
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
    const deepClonedFields = {
      unitType: sourceUnit.unitType,
      status: sourceUnit.status,
      floor: sourceUnit.floor,
      isActive: sourceUnit.isActive,
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
        if (unitForm.values.units.length > 1) {
          // Select another unit (prefer new units, then saved units)
          const remainingUnits = unitForm.values.units.filter(
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
      unitForm.values.units,
      setCurrentUnit,
      openNotification,
    ]
  );

  const handleUnitSelect = useCallback((unit: UnitFormValues) => {
    setCurrentUnit(unit);

    if (unit.propertyId && unit.id) {
      setOriginalUnit(unit);
    } else {
      setOriginalUnit(null);
    }
  }, []);

  const handleUnitChange = (updatedUnit: UnitFormValues) => {
    const isSavedUnit = savedUnits.some(
      (unit) => (unit as any).puid === (updatedUnit as any).puid
    );

    if (isSavedUnit) {
      // Check if unit is already in form state to prevent duplication
      const isAlreadyInForm = unitForm.values.units.some(
        (unit) => unit.puid === (updatedUnit as any).puid
      );

      if (!isAlreadyInForm) {
        // only add if not already in form
        const newFormUnits = [...unitForm.values.units, updatedUnit];
        unitForm.setFieldValue("units", newFormUnits);
        setCurrentUnit(updatedUnit);
        console.log(
          unitForm.values.units,
          "first time editing saved unit, added to form:",
          updatedUnit
        );
      } else {
        // Update existing unit in form
        const index = findNewUnitIndexByPuid((updatedUnit as any).puid);
        if (index !== -1) {
          unitForm.setFieldValue(`units.${index}`, updatedUnit);
          setCurrentUnit(updatedUnit);
          console.log(
            "second time editing saved unit, added to form:",
            updatedUnit
          );
        }
      }
      validateCurrentUnitAndSetErrors();
    } else {
      const index = findNewUnitIndexByPuid((updatedUnit as any).puid);
      if (index !== -1) {
        unitForm.setFieldValue(`units.${index}`, updatedUnit);
        setCurrentUnit(updatedUnit);
        validateCurrentUnitAndSetErrors();
        console.log(
          "third time editing saved unit, added to form:",
          updatedUnit
        );
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
    allUnits: unitForm.values.units,
    savedUnits,
    newUnits,
    totalUnitsCreated,
    hasUnsavedChanges,

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
