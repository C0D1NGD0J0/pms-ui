import { useState } from "react";
import { useForm } from "@mantine/form";
import { useNotification } from "@hooks/useNotification";
import { UnitTypeManager } from "@utils/unitTypeManager";
import { usePropertyFormMetaData } from "@hooks/property";
import { unitSchema } from "@validations/unit.validations";
import { PropertyTypeManager } from "@utils/propertyTypeManager";
import { StaticUnitFormConfig } from "@interfaces/property.interface";
import {
  defaultUnitValues,
  UnitFormValues,
  UnitStatusEnum,
  UnitTypeEnum,
} from "@interfaces/unit.interface";

import { UsePropertyUnitLogicProps, UnitsFormData } from "../interface/index";

export function usePropertyUnitLogic({
  property,
  onClose,
}: UsePropertyUnitLogicProps) {
  const [isMultiUnit, setIsMultiUnit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [unitNumberingScheme, setUnitNumberingScheme] =
    useState<string>("numeric");
  const [customPrefix, setCustomPrefix] = useState("");
  const { openNotification } = useNotification();

  const form = useForm<UnitsFormData>({
    initialValues: {
      units: [
        {
          ...defaultUnitValues,
          unitNumber: property.unitInfo?.suggestedNextUnitNumber || "101",
        },
      ],
    },
    validateInputOnChange: true,
  });
  const { data: formConfig } =
    usePropertyFormMetaData<StaticUnitFormConfig>("unitForm");

  const allowedUnitTypes = PropertyTypeManager.getAllowedUnitTypes(
    property.propertyType
  );

  const unitTypeOptions =
    formConfig?.unitTypes?.filter((option) =>
      allowedUnitTypes.includes(option.value)
    ) || [];

  const currentUnit = form.values.units[activeUnitIndex];
  const totalUnitsCreated = form.values.units.length;

  const fieldVisibility = UnitTypeManager.getSpecificationVisibility(
    currentUnit?.type || UnitTypeEnum.RESIDENTIAL
  );

  const prefixOptions = [
    { value: "numeric", label: "Numeric", example: "101, 102, 103" },
    {
      value: "floor",
      label: "Floor Based",
      example: "0001 (ground), 1001, 2001",
    },
    { value: "suite", label: "Suite", example: "Suite-101, Suite-102" },
    { value: "alpha", label: "Alphabetic", example: "A-101, B-101" },
    { value: "custom", label: "Custom Prefix", example: "Custom-001" },
  ];

  // pattern detection helper
  const detectNumberingPattern = (suggestedNumber: string): string => {
    if (!suggestedNumber) return "numeric";
    if (/^\d{4}$/.test(suggestedNumber)) return "floor";
    if (/^Suite-\d+/i.test(suggestedNumber)) return "suite";
    if (/^[A-Z]-\d+/.test(suggestedNumber)) return "alpha";
    if (/^[A-Za-z]+-\d+/.test(suggestedNumber)) return "custom";
    return "numeric";
  };

  const generateNextUnitNumber = (): string => {
    const existingUnits = form.values.units;
    const suggestedNumber = property.unitInfo?.suggestedNextUnitNumber;

    // For the first unit, we use the suggested number from API or detect pattern
    if (existingUnits.length === 0) {
      if (suggestedNumber) {
        const detectedPattern = detectNumberingPattern(suggestedNumber);
        setUnitNumberingScheme(detectedPattern);
        return suggestedNumber;
      }
      return generateNumberByScheme(1);
    }

    // For subsequent units, generate based on the selected scheme
    const nextSequence = existingUnits.length + 1;
    return generateNumberByScheme(nextSequence);
  };

  const generateNumberByScheme = (sequence: number): string => {
    switch (unitNumberingScheme) {
      case "floor":
        // Floor-based: 0001 (ground), 1001, 1002, 1003, 1011, 1012, etc.
        // Extract floor from first unit or use default
        const firstUnit = form.values.units[0];
        let baseFloor = 1;
        if (firstUnit?.unitNumber && /^\d{4}$/.test(firstUnit.unitNumber)) {
          baseFloor = parseInt(firstUnit.unitNumber.substring(0, 1));
        }
        // use current unit's floor if specified, otherwise use base floor
        // floor 0 (ground floor)
        const currentFloor =
          currentUnit?.floor !== undefined ? currentUnit.floor : baseFloor;
        const unitNumber = sequence.toString().padStart(3, "0");
        return `${currentFloor}${unitNumber}`;

      case "suite":
        return `Suite-${sequence.toString().padStart(3, "0")}`;

      case "alpha":
        // A-101, B-101, ..., Z-101, A-102
        const alphabetIndex = (sequence - 1) % 26;
        const numberPart = Math.floor((sequence - 1) / 26) + 101;
        const letter = String.fromCharCode(65 + alphabetIndex); // A-Z
        return `${letter}-${numberPart}`;

      case "custom":
        const prefix = customPrefix || "Unit";
        return `${prefix}-${sequence.toString().padStart(3, "0")}`;

      case "numeric":
      default:
        // Simple numeric: 101, 102, 103
        return (100 + sequence).toString();
    }
  };

  const validateRequiredFields = (unit: UnitFormValues): boolean => {
    const requiredFields = [
      "unitNumber",
      "type",
      "specifications.totalArea",
      "fees.rentAmount",
    ];

    for (const field of requiredFields) {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        const parentObj = unit[parent as keyof UnitFormValues] as any;
        if (
          !parentObj ||
          parentObj[child] === undefined ||
          parentObj[child] === 0 ||
          parentObj[child] === ""
        ) {
          return false;
        }
      } else {
        const value = unit[field as keyof UnitFormValues];
        if (value === undefined || value === "" || value === 0) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCopyUnit = () => {
    if (!validateRequiredFields(currentUnit)) {
      openNotification(
        "error",
        "Validation Error",
        "Please fill in all required fields (Unit Number, Type, Total Area, and Rent Amount) before copying."
      );
      return;
    }

    if (totalUnitsCreated >= property.totalUnits) {
      openNotification(
        "error",
        "Unit Limit Exceeded",
        `Cannot add more units. This property has a maximum of ${property.totalUnits} units.`
      );
      return;
    }

    const validation = unitSchema.safeParse(currentUnit);
    if (!validation.success) {
      openNotification(
        "error",
        "Validation Error",
        "Please fix all validation errors in the current unit before copying."
      );
      return;
    }

    const newUnit: UnitFormValues = {
      ...currentUnit,
      unitNumber: generateNextUnitNumber(),
    };

    // Add new unit to form
    form.setFieldValue("units", [...form.values.units, newUnit]);

    // Switch to the new unit
    setActiveUnitIndex(form.values.units.length);

    openNotification(
      "success",
      "Unit Copied",
      `Unit copied successfully. ${totalUnitsCreated + 1} units created.`
    );
  };

  const handleRemoveUnit = (index: number) => {
    if (form.values.units.length <= 1) {
      openNotification(
        "error",
        "Cannot Remove",
        "At least one unit is required."
      );
      return;
    }

    const newUnits = form.values.units.filter((_, i) => i !== index);
    form.setFieldValue("units", newUnits);

    if (activeUnitIndex >= newUnits.length) {
      setActiveUnitIndex(newUnits.length - 1);
    } else if (activeUnitIndex > index) {
      setActiveUnitIndex(activeUnitIndex - 1);
    }

    openNotification(
      "success",
      "Unit Removed",
      `Unit removed successfully. ${newUnits.length} units remaining.`
    );
  };

  const handleSubmit = (values: UnitsFormData) => {
    setIsSubmitting(true);

    // Here we would typically send the data to the server
    console.log("Submitting units data:", {
      propertyId: property.id,
      units: values.units,
    });

    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      openNotification(
        "success",
        "Units Saved",
        `Successfully saved ${values.units.length} units.`
      );
    }, 1000);
  };

  const handleAddAnotherUnit = () => {
    if (totalUnitsCreated >= property.totalUnits) {
      openNotification(
        "error",
        "Unit Limit Exceeded",
        `Cannot add more units. This property has a maximum of ${property.totalUnits} units.`
      );
      return;
    }

    const defaultUnitType =
      allowedUnitTypes.length > 0
        ? allowedUnitTypes[0]
        : UnitTypeEnum.RESIDENTIAL;

    const newUnit: UnitFormValues = {
      unitNumber: generateNextUnitNumber(),
      type: defaultUnitType as any,
      status: UnitStatusEnum.AVAILABLE,
      floor: undefined,
      isActive: true,
      specifications: {
        totalArea: 0,
        rooms: undefined,
        bathrooms: undefined,
        maxOccupants: undefined,
      },
      amenities: {
        airConditioning: false,
        heating: false,
        washerDryer: false,
        dishwasher: false,
        parking: false,
        storage: false,
        cableTV: false,
        internet: false,
      },
      utilities: {
        gas: false,
        trash: false,
        water: false,
        heating: false,
        centralAC: false,
      },
      fees: {
        currency: "USD" as const,
        rentAmount: 0,
        securityDeposit: undefined,
      },
      description: undefined,
    };

    form.setFieldValue("units", [...form.values.units, newUnit]);
    setActiveUnitIndex(form.values.units.length);

    openNotification(
      "success",
      "Unit Added",
      `New blank unit added. ${totalUnitsCreated + 1} units total.`
    );
  };

  const handleCancel = () => {
    form.reset();

    setActiveUnitIndex(0);
    setIsMultiUnit(false);
    setIsSubmitting(false);

    onClose();
  };

  const handleFieldChange = (fieldPath: string, value: any) => {
    form.setFieldValue(fieldPath, value);
  };

  return {
    form,
    isMultiUnit,
    setIsMultiUnit,
    isSubmitting,
    activeUnitIndex,
    setActiveUnitIndex,

    currentUnit,
    totalUnitsCreated,
    unitTypeOptions,
    unitStatusOptions: formConfig?.unitStatus || [],
    allowedUnitTypes,
    fieldVisibility,

    // Unit numbering scheme functionality
    unitNumberingScheme,
    setUnitNumberingScheme,
    customPrefix,
    setCustomPrefix,
    prefixOptions,
    generateNextUnitNumber,

    handleCopyUnit,
    handleRemoveUnit,
    handleSubmit,
    handleAddAnotherUnit,
    handleCancel,
    handleFieldChange,
  };
}
