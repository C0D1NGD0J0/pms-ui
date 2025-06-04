import { z } from "zod";
import { UnitStatusEnum, UnitTypeEnum } from "@interfaces/unit.interface";

export const unitSchema = z.object({
  unitNumber: z
    .string()
    .min(1, "Unit number is required")
    .max(50, "Unit number cannot exceed 50 characters"),
  type: z.nativeEnum(UnitTypeEnum, {
    required_error: "Unit type is required",
  }),
  status: z.nativeEnum(UnitStatusEnum).default(UnitStatusEnum.AVAILABLE),
  floor: z
    .number()
    .min(1, "Floor must be at least 1")
    .max(200, "Floor cannot exceed 200")
    .optional(),
  isActive: z.boolean().default(true),
  specifications: z.object({
    totalArea: z
      .number()
      .min(1, "Total area is required and must be greater than 0"),
    rooms: z
      .number()
      .min(0, "Rooms cannot be negative")
      .max(20, "Rooms cannot exceed 20")
      .optional(),
    bathrooms: z
      .number()
      .min(0, "Bathrooms cannot be negative")
      .max(20, "Bathrooms cannot exceed 20")
      .optional(),
    maxOccupants: z
      .number()
      .min(1, "Max occupants must be at least 1")
      .max(50, "Max occupants cannot exceed 50")
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
    currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD", "JPY"]).default("USD"),
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
});
