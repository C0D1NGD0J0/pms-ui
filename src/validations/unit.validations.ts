import { z } from "zod";
import { unitTypeRules } from "@utils/constants";
import {
  UnitStatusEnum,
  UnitTypeEnum,
  UnitType,
} from "@interfaces/unit.interface";

const createNumericField = (
  min?: number,
  max?: number,
  fieldName = "Field",
  messages = ["", ""]
) => {
  let numberSchema = z.number();

  if (min !== undefined) {
    const minMessage = messages[0] || `${fieldName} must be at least ${min}`;
    numberSchema = numberSchema.min(min, minMessage);
  }
  if (max !== undefined) {
    const maxMessage = messages[1] || `${fieldName} cannot exceed ${max}`;
    numberSchema = numberSchema.max(max, maxMessage);
  }
  return z
    .string()
    .regex(
      /^-?\d+(\.\d+)?$/,
      `${fieldName} must be a valid number without alphabetic characters`
    )
    .transform(Number)
    .or(numberSchema);
};

export function createUnitSchema(unitType: UnitType) {
  const rules =
    unitTypeRules[unitType] || unitTypeRules[UnitTypeEnum.RESIDENTIAL];
  const requiredFields = rules.requiredFields || [];

  const isRequired = (fieldPath: string) =>
    requiredFields.includes(fieldPath) ||
    requiredFields.includes(fieldPath.split(".").pop() || "");

  const specificationsSchema = z.object({
    totalArea: createNumericField(0, undefined, "totalArea", [
      `Total area is required for ${unitType} units`,
      "Total area cannot be negative",
    ]).refine((val) => {
      if (isRequired("specifications.totalArea") || isRequired("totalArea")) {
        return val > 0;
      }
      return true;
    }, `Total area is required for ${unitType} units`),

    rooms: isRequired("specifications.rooms")
      ? createNumericField(1, 20, "rooms", [
          `Number of rooms is required for ${unitType} units`,
          "Room cannot exceed 20",
        ])
      : createNumericField(0, 20, "rooms", [
          `room cannot be negative`,
          "Room cannot exceed 20",
        ]).default(1),

    bathrooms: isRequired("specifications.bathrooms")
      ? createNumericField(1, 20, "bathrooms", [
          `Number of bathrooms is required for ${unitType} units`,
          "Bathrooms cannot exceed 20",
        ])
      : createNumericField(0, 20, "bathrooms", [
          `Bathrooms cannot be negative`,
          "Bathrooms cannot exceed 20",
        ]).default(1),

    maxOccupants: isRequired("specifications.maxOccupants")
      ? createNumericField(1, 50, "maxOccupants", [
          `Max occupants is required for ${unitType} units`,
          "Max occupants cannot exceed 50",
        ])
      : createNumericField(1, 50, "maxOccupants", [
          `Max occupants cannot be negative`,
          "Max occupants cannot exceed 50",
        ]).default(1),
  });

  const feesSchema = z.object({
    currency: z.enum(["USD", "EUR", "GBP", "CAD"]).default("USD"),
    rentAmount: createNumericField(0, 1000000, "rentAmount", [
      "Rent amount is required",
      "Rent amount cannot exceed 1000000",
    ]).refine((val) => {
      if (isRequired("fees.rentAmount") || isRequired("rentAmount")) {
        return val > 0;
      }
      return true;
    }, `Rent amount is required for ${unitType} units`),
    securityDeposit: createNumericField(0, 100000, "securityDeposit", [
      "Security deposit is required",
      "Security deposit cannot exceed 100000",
    ]).refine((val) => {
      if (isRequired("fees.securityDeposit") || isRequired("securityDeposit")) {
        return val > 0;
      }
      return true;
    }, `Security deposit is required for ${unitType} units`),
  });

  const amenitiesSchema = z.object({
    airConditioning: z.boolean().default(false),
    heating: z.boolean().default(false),
    washerDryer: z.boolean().default(false),
    dishwasher: z.boolean().default(false),
    parking: z.boolean().default(false),
    storage: z.boolean().default(false),
    cableTV: z.boolean().default(false),
    internet: z.boolean().default(false),
  });

  const utilitiesSchema = z.object({
    gas: z.boolean().default(false),
    trash: z.boolean().default(false),
    water: z.boolean().default(false),
    heating: z.boolean().default(false),
    centralAC: z.boolean().default(false),
  });

  return z.object({
    id: z.string().optional(),
    unitNumber: z
      .string()
      .min(1, "Unit number is required")
      .max(10, "Unit number cannot exceed 50 characters"),
    unitType: z.nativeEnum(UnitTypeEnum, {
      required_error: "Unit type is required",
    }),
    status: z.nativeEnum(UnitStatusEnum).default(UnitStatusEnum.AVAILABLE),
    floor: createNumericField(-4, 100, "floor"),
    isActive: z.boolean().default(true),
    puid: z
      .string()
      .min(24, "Property unique ID (puid) is required")
      .max(38, "Invalid property unique ID (puid) detected."),
    specifications: specificationsSchema,
    amenities: amenitiesSchema,
    utilities: utilitiesSchema,
    fees: feesSchema,
    description: z
      .string()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional(),
  });
}

export const unitSchema = z.object({
  id: z.string().optional(),
  propertyId: z.string().optional(),
  puid: z
    .string()
    .min(10, "Property unique ID (puid) is required")
    .max(36, "Invalid property unique ID (puid) detected.")
    .optional(),
  unitNumber: z
    .string()
    .min(1, "Unit number is required")
    .max(50, "Unit number cannot exceed 50 characters"),
  unitType: z.nativeEnum(UnitTypeEnum, {
    required_error: "Unit type is required",
  }),
  status: z.nativeEnum(UnitStatusEnum).default(UnitStatusEnum.AVAILABLE),
  floor: z
    .number()
    .min(
      -4,
      "Floor must be at least -4 (for basements) or 0 (for ground floor)"
    )
    .max(80, "Floor cannot exceed 80"),
  isActive: z.boolean().default(true),
  specifications: z.object({
    totalArea: z
      .number()
      .min(1, "Total area is required and must be greater than 0"),
    rooms: z
      .number()
      .min(0, "Rooms cannot be negative")
      .max(50, "Rooms cannot exceed 50")
      .optional(),
    bathrooms: z
      .number()
      .min(0, "Bathrooms cannot be negative")
      .max(20, "Bathrooms cannot exceed 20")
      .optional(),
    maxOccupants: z
      .number()
      .min(1, "Max occupants must be at least 1")
      .max(0, "Max occupants cannot exceed 50")
      .optional(),
  }),
  amenities: z.object({
    airConditioning: z.boolean().default(false),
    heating: z.boolean().default(false),
    washerDryer: z.boolean().default(false),
    dishwasher: z.boolean().default(false),
    parking: z.boolean().default(false),
    storage: z.boolean().default(false),
    cableTV: z.boolean().default(false),
    internet: z.boolean().default(false),
  }),
  utilities: z.object({
    gas: z.boolean().default(false),
    trash: z.boolean().default(false),
    water: z.boolean().default(false),
    heating: z.boolean().default(false),
    centralAC: z.boolean().default(false),
  }),
  fees: z.object({
    currency: z.enum(["USD", "EUR", "GBP", "CAD"]).default("USD"),
    rentAmount: z
      .number()
      .min(0, "Rent amount cannot be negative")
      .max(100000, "Rent amount seems too high"),
    securityDeposit: z
      .number()
      .min(0, "Security deposit cannot be negative")
      .optional(),
  }),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
});

export const unitsArraySchema = z
  .array(unitSchema)
  .min(1, "At least one unit is required");

export const unitsFormSchema = z.object({
  units: unitsArraySchema,
  pid: z.string(),
  cuid: z.string(),
});
