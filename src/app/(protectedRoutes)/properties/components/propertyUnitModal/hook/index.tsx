import { useState } from "react";
import { useAuth } from "@store/index";
import { useForm } from "@mantine/form";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
import { UnitTypeManager } from "@utils/unitTypeManager";
import { usePropertyFormMetaData } from "@hooks/property";
import { propertyUnitService } from "@services/propertyUnit";
import { PropertyTypeManager } from "@utils/propertyTypeManager";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { StaticUnitFormConfig } from "@interfaces/property.interface";
import { unitsFormSchema, unitSchema } from "@validations/unit.validations";
import {
  defaultUnitValues,
  UnitFormValues,
  UnitStatusEnum,
  UnitTypeEnum,
  UnitType,
} from "@interfaces/unit.interface";

import { UsePropertyUnitLogicProps, UnitsFormData } from "../interface/index";
const FORM_MAX_UNITS = 20;

export function usePropertyUnitLogic({
  property,
  onClose,
}: UsePropertyUnitLogicProps) {
  const [isMultiUnit, setIsMultiUnit] = useState(true);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [unitNumberingScheme, setUnitNumberingScheme] =
    useState<string>("numeric");
  const [customPrefix, setCustomPrefix] = useState("");
  const { openNotification } = useNotification();
  const { client } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      units: [
        {
          ...defaultUnitValues,
          unitNumber: property.unitInfo?.suggestedNextUnitNumber || "101",
        },
      ],
    },
    validate: zodResolver(unitsFormSchema),
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });
  const { data: formConfig } =
    usePropertyFormMetaData<StaticUnitFormConfig>("unitForm");

  const allowedUnitTypes = PropertyTypeManager.getAllowedUnitTypes(
    property.propertyType
  );

  const unitTypeOptions = formConfig?.unitTypes
    ? PropertyTypeManager.getFilteredUnitTypes(
        property.propertyType,
        formConfig.unitTypes
      )
    : [];

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
        const firstUnit = form.values.units[0];
        let baseFloor = 1;
        if (firstUnit?.unitNumber && /^\d{4}$/.test(firstUnit.unitNumber)) {
          baseFloor = parseInt(firstUnit.unitNumber.substring(0, 1));
        }
        const currentFloor =
          currentUnit?.floor !== undefined ? currentUnit.floor : baseFloor;
        const unitNumber = sequence.toString().padStart(3, "0");
        return `${currentFloor}${unitNumber}`;

      case "suite":
        return `Suite-${sequence.toString().padStart(3, "0")}`;

      case "alpha":
        const alphabetIndex = (sequence - 1) % 26;
        const numberPart = Math.floor((sequence - 1) / 26) + 101;
        const letter = String.fromCharCode(65 + alphabetIndex); // A-Z
        return `${letter}-${numberPart}`;

      case "custom":
        const prefix = customPrefix || "Unit";
        return `${prefix}-${sequence.toString().padStart(3, "0")}`;

      case "numeric":
      default:
        return (100 + sequence).toString();
    }
  };

  const validateUnitWithTypeManager = (
    unit: UnitFormValues
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    const zodValidation = unitSchema.safeParse(unit);
    if (!zodValidation.success) {
      zodValidation.error.errors.forEach((err) => {
        errors.push(`${err.path.join(".")}: ${err.message}`);
      });
    }

    if (unit.type) {
      const requiredFields = UnitTypeManager.getRequiredFields(
        unit.type as UnitType
      );

      requiredFields.forEach((field) => {
        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          const parentObj = unit[parent as keyof UnitFormValues] as Record<
            string,
            unknown
          >;
          if (
            !parentObj ||
            parentObj[child] === undefined ||
            parentObj[child] === 0 ||
            parentObj[child] === ""
          ) {
            errors.push(`${field} is required for ${unit.type} units`);
          }
        } else {
          const value = unit[field as keyof UnitFormValues];
          if (value === undefined || value === "" || value === 0) {
            errors.push(`${field} is required for ${unit.type} units`);
          }
        }
      });
    }

    return { isValid: errors.length === 0, errors };
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
      unitNumber: generateNextUnitNumber(),
    };

    form.setFieldValue("units", [...form.values.units, newUnit]);
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

  const createUnitsMutation = useMutation({
    mutationFn: (data: { units: UnitFormValues[] }) => {
      if (!client?.csub) throw new Error("Client not authenticated");
      return propertyUnitService.createUnits(client.csub, property.id, data);
    },
    onSuccess: (response, variables) => {
      if (!client?.csub) return;

      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.propertyUnits(property.id, client.csub),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.propertyById(property.id, client.csub),
      });

      openNotification(
        "success",
        "Units Created",
        `Successfully created ${variables.units.length} units.`
      );
      onClose();
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

  const handleSubmit = (values: any) => {
    const formData = values as UnitsFormData;
    const allValidationErrors: string[] = [];

    formData.units.forEach((unit, index) => {
      const validation = validateUnitWithTypeManager(unit);
      if (!validation.isValid) {
        allValidationErrors.push(
          `Unit ${index + 1}: ${validation.errors.join(", ")}`
        );
      }
    });

    if (allValidationErrors.length > 0) {
      openNotification(
        "error",
        "Validation Failed",
        `Please fix the following errors:\n${allValidationErrors.join("\n")}`
      );
      return;
    }

    // Submit if validation passes
    // createUnitsMutation.mutate({ units: formData.units });
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

    onClose();
  };

  const handleFieldChange = (fieldPath: string, value: any) => {
    form.setFieldValue(fieldPath, value);
  };

  return {
    form,
    isMultiUnit,
    setIsMultiUnit,
    isSubmitting: createUnitsMutation.isPending,
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
    handleSubmit: form.onSubmit(handleSubmit),
    handleAddAnotherUnit,
    handleCancel,
    handleFieldChange,
  };
}
