import { z } from "zod";
import { MAX_TOTAL_UNITS } from "@utils/constants";
import { PropertyTypeManager } from "@utils/propertyTypeManager";
import {
  PropertyOccupancyStatusEnum,
  PropertyStatusEnum,
  PropertyTypesEnum,
} from "@interfaces/index";

export const propertySchema = z
  .object({
    cuid: z.string().optional(),
    name: z.string().min(5, "Property name is required"),
    propertyType: z
      .nativeEnum(PropertyTypesEnum, {
        required_error: "Property type is required",
      })
      .optional(),
    status: z.nativeEnum(PropertyStatusEnum).optional(),
    managedBy: z.string().optional(),
    yearBuilt: z
      .number()
      .min(1800)
      .max(new Date().getFullYear() + 10)
      .optional(),

    address: z.object({
      unitNumber: z.string().optional(),
      city: z.string().optional(),
      street: z.string().optional(),
      state: z.string().optional(),
      postCode: z.string().optional(),
      country: z.string().default("us"),
      coordinates: z
        .array(z.number())
        .length(2, "Coordinates are required")
        .optional(),
      fullAddress: z
        .string()
        .min(10, "Address is required and must be at least 10 characters"),
    }),
    financialDetails: z.object({
      purchasePrice: z.number().min(0).optional().default(0),
      purchaseDate: z.string().optional().default(""),
      marketValue: z.number().min(0).optional().default(0),
      propertyTax: z.number().min(0).optional().default(0),
      lastAssessmentDate: z.string().optional().default(""),
    }),

    fees: z.object({
      currency: z.string().default("USD"),
      taxAmount: z.string().default("0.00"),
      rentalAmount: z.string().default("0.00"),
      managementFees: z.string().default("0.00"),
      securityDeposit: z.string().default("0.00"),
    }),

    specifications: z.object({
      totalArea: z.number().min(0, "Total area is required"),
      lotSize: z.number().min(0).optional(),
      bedrooms: z.number().min(0).default(0),
      bathrooms: z.number().min(0).default(0),
      floors: z.number().min(1).default(1),
      garageSpaces: z.number().min(0).default(0),
      maxOccupants: z.number().min(1).optional(),
    }),
    utilities: z.object({
      water: z.boolean().default(false),
      gas: z.boolean().default(false),
      electricity: z.boolean().default(false),
      internet: z.boolean().default(false),
      trash: z.boolean().default(false),
      cableTV: z.boolean().default(false),
    }),
    description: z.object({
      text: z.string().optional(),
      html: z.string().optional(),
    }),

    occupancyStatus: z.nativeEnum(PropertyOccupancyStatusEnum).optional(),
    maxAllowedUnits: z
      .union([z.string().transform((val) => Number(val)), z.number()])
      .refine((val) => !isNaN(val), {
        message: "Max allowed units must be a valid number",
      })
      .transform((val) => Number(val))
      .pipe(z.number().min(0).max(MAX_TOTAL_UNITS).default(1)),

    interiorAmenities: z.object({
      airConditioning: z.boolean().default(false),
      heating: z.boolean().default(false),
      washerDryer: z.boolean().default(false),
      dishwasher: z.boolean().default(false),
      fridge: z.boolean().default(false),
      furnished: z.boolean().default(false),
      storageSpace: z.boolean().default(false),
    }),
    communityAmenities: z.object({
      swimmingPool: z.boolean().default(false),
      fitnessCenter: z.boolean().default(false),
      elevator: z.boolean().default(false),
      parking: z.boolean().default(false),
      securitySystem: z.boolean().default(false),
      petFriendly: z.boolean().default(false),
      laundryFacility: z.boolean().default(false),
      doorman: z.boolean().default(false),
    }),

    documents: z
      .array(
        z.object({
          documentType: z
            .enum(["deed", "tax", "insurance", "inspection", "other", "lease"])
            .optional(),
          description: z.string().optional(),
          externalUrl: z.union([z.string().url(), z.literal("")]).optional(),
          file: z.any().optional(),
        })
      )
      .default([]),

    images: z.array(z.any()).default([]),
  })
  .superRefine((data, ctx) => {
    const propertyType = data.propertyType || "house";
    const maxAllowedUnits = Number(data.maxAllowedUnits);
    const rules = PropertyTypeManager.getRules(propertyType);

    if (isNaN(maxAllowedUnits) || maxAllowedUnits < rules.minUnits) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `This property type requires at least ${rules.minUnits} units.`,
        path: ["maxAllowedUnits"],
      });
    }

    const shouldValidate = PropertyTypeManager.shouldValidateBedBath(
      propertyType,
      maxAllowedUnits
    );

    // If bedrooms/bathrooms shouldn't be validated (multi-unit properties), return early
    if (!shouldValidate) {
      return;
    }

    // For single-family homes with only one unit, validate bedroom/bathroom counts
    if (maxAllowedUnits === 1 && rules.validateBedBath) {
      if (
        data.specifications.bedrooms === 0 &&
        rules.requiredFields.includes("bedrooms")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Number of bedrooms is required for this property type.",
          path: ["specifications.bedrooms"],
        });
      }

      if (
        data.specifications.bathrooms === 0 &&
        rules.requiredFields.includes("bathrooms")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Number of bathrooms is required for this property type.",
          path: ["specifications.bathrooms"],
        });
      }

      rules.requiredFields.forEach((field: string) => {
        if (field === "bedrooms" || field === "bathrooms") {
          return;
        }

        // nested fields like specifications.totalArea
        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          if (parent === "specifications") {
            const specValue =
              data.specifications[child as keyof typeof data.specifications];
            if (specValue === undefined || specValue === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `${field} is required for this property type.`,
                path: [field],
              });
            }
          }
        }
      });
    }
  });

export const csvUploadSchema = z.object({
  cuid: z.string().min(1, "cuid is required").default(""),
  csvFile: z
    .instanceof(File)
    .refine((file) => file.name.endsWith(".csv"), {
      message: "File must be a CSV",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .nullable()
    .default(null),
});
