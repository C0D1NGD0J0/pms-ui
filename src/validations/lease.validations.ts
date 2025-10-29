import { z } from "zod";
import {
  SigningMethodEnum,
  PaymentMethodEnum,
  LeaseTypeEnum,
  UtilityEnum,
} from "@interfaces/lease.interface";

const leasePropertySchema = z.object({
  id: z.string().min(1, "Property is required"),
  address: z.string().optional(),
  unitId: z.string().optional(),
});

const leaseFeesSchema = z.object({
  monthlyRent: z
    .union([z.string().transform((val) => Number(val)), z.number()])
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Monthly rent must be a positive number",
    })
    .transform((val) => Number(val)),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter code")
    .default("USD"),
  rentDueDay: z
    .union([z.string().transform((val) => Number(val)), z.number()])
    .refine((val) => !isNaN(val) && val >= 1 && val <= 31, {
      message: "Rent due day must be between 1-31",
    })
    .transform((val) => Number(val)),
  securityDeposit: z
    .union([z.string().transform((val) => Number(val)), z.number()])
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Security deposit must be non-negative",
    })
    .transform((val) => Number(val)),
  lateFeeAmount: z
    .union([
      z
        .string()
        .refine((val) => val === "" || !isNaN(Number(val)), {
          message: "Must be a valid number",
        })
        .transform((val) => (val === "" ? 0 : Number(val))),
      z.number(),
    ])
    .refine((val) => val >= 0, {
      message: "Late fee amount must be non-negative",
    })
    .optional(),
  lateFeeDays: z
    .union([
      z
        .string()
        .refine((val) => val === "" || !isNaN(Number(val)), {
          message: "Must be a valid number",
        })
        .transform((val) => (val === "" ? 0 : Number(val))),
      z.number(),
    ])
    .refine((val) => val === 0 || val >= 1, {
      message: "Late fee days must be at least 1",
    })
    .optional(),
  lateFeeType: z.enum(["fixed", "percentage"]).optional(),
  lateFeePercentage: z
    .union([
      z
        .string()
        .refine((val) => val === "" || !isNaN(Number(val)), {
          message: "Must be a valid number",
        })
        .transform((val) => (val === "" ? 0 : Number(val))),
      z.number(),
    ])
    .refine((val) => val >= 0 && val <= 100, {
      message: "Late fee percentage must be between 0-100",
    })
    .optional(),
  acceptedPaymentMethod: z.nativeEnum(PaymentMethodEnum).optional(),
});

const leaseDurationSchema = z.object({
  startDate: z.union([z.date(), z.string().min(1, "Start date is required")]),
  endDate: z.union([z.date(), z.string().min(1, "End date is required")]),
  moveInDate: z.union([z.date(), z.string()]).optional(),
});

const coTenantSchema = z.object({
  name: z.string().min(2, "Co-tenant name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  occupation: z.string().optional(),
});

const petPolicySchema = z.object({
  allowed: z.boolean().default(false),
  types: z.array(z.string()).optional(),
  maxPets: z
    .union([
      z
        .string()
        .refine((val) => val === "" || !isNaN(Number(val)), {
          message: "Must be a valid number",
        })
        .transform((val) => (val === "" ? 0 : Number(val))),
      z.number(),
    ])
    .refine((val) => val >= 0, {
      message: "Max pets must be non-negative",
    })
    .optional(),
  deposit: z
    .union([
      z
        .string()
        .refine((val) => val === "" || !isNaN(Number(val)), {
          message: "Must be a valid number",
        })
        .transform((val) => (val === "" ? 0 : Number(val))),
      z.number(),
    ])
    .refine((val) => val >= 0, {
      message: "Pet deposit must be non-negative",
    })
    .optional(),
  monthlyFee: z
    .union([
      z
        .string()
        .refine((val) => val === "" || !isNaN(Number(val)), {
          message: "Must be a valid number",
        })
        .transform((val) => (val === "" ? 0 : Number(val))),
      z.number(),
    ])
    .refine((val) => val >= 0, {
      message: "Pet monthly fee must be non-negative",
    })
    .optional(),
});

const renewalOptionsSchema = z.object({
  autoRenew: z.boolean().default(false),
  noticePeriodDays: z
    .union([
      z
        .string()
        .refine((val) => val === "" || !isNaN(Number(val)), {
          message: "Must be a valid number",
        })
        .transform((val) => (val === "" ? 0 : Number(val))),
      z.number(),
    ])
    .refine((val) => val === 0 || val >= 1, {
      message: "Notice period must be at least 1 day",
    })
    .optional(),
  renewalTermMonths: z
    .union([
      z
        .string()
        .refine((val) => val === "" || !isNaN(Number(val)), {
          message: "Must be a valid number",
        })
        .transform((val) => (val === "" ? 0 : Number(val))),
      z.number(),
    ])
    .refine((val) => val === 0 || val >= 1, {
      message: "Renewal term must be at least 1 month",
    })
    .optional(),
});

const tenantInfoSchema = z.object({
  id: z.string().optional(),
  email: z.string().optional(),
});

export const leaseSchema = z
  .object({
    property: leasePropertySchema,
    tenantInfo: tenantInfoSchema,
    duration: leaseDurationSchema,
    fees: leaseFeesSchema,
    type: z.nativeEnum(LeaseTypeEnum, {
      required_error: "Lease type is required",
    }),
    signingMethod: z.nativeEnum(SigningMethodEnum).optional(),
    utilitiesIncluded: z.array(z.nativeEnum(UtilityEnum)).optional(),
    coTenants: z.array(coTenantSchema).optional(),
    petPolicy: petPolicySchema.optional(),
    renewalOptions: renewalOptionsSchema.optional(),
    internalNotes: z
      .string()
      .max(2000, "Internal notes must be at most 2000 characters")
      .optional(),
    leaseDocument: z.array(z.any()).optional(),
  })
  .refine(
    (data) => {
      // Either tenant ID or email is required
      return (
        (data.tenantInfo.id && data.tenantInfo.id.trim() !== "") ||
        (data.tenantInfo.email && data.tenantInfo.email.trim() !== "")
      );
    },
    {
      message: "Either tenant ID or email is required",
      path: ["tenantInfo"],
    }
  )
  .refine(
    (data) => {
      // End date must be after start date
      const start = new Date(data.duration.startDate);
      const end = new Date(data.duration.endDate);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["duration", "endDate"],
    }
  );
