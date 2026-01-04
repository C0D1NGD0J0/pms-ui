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
  propertyType: z.string().optional(),
  hasUnits: z.boolean().optional(),
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
  acceptedPaymentMethod: z.nativeEnum(PaymentMethodEnum, {
    errorMap: () => ({ message: "Payment method is required" }),
  }),
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
  email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal(""))
    .or(z.undefined()),
  firstName: z.string().optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
});

const internalNoteSchema = z.object({
  note: z.string(),
  author: z.string(),
  authorId: z.string(),
  timestamp: z.string(),
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
      .union([z.string(), z.array(internalNoteSchema)])
      .optional(),
    leaseDocument: z.array(z.any()).optional(),
  })
  .refine(
    (data) => {
      // Either tenant ID OR (email + firstName + lastName) is required
      const hasId = data.tenantInfo.id && data.tenantInfo.id.trim() !== "";
      const hasEmail =
        data.tenantInfo.email && data.tenantInfo.email.trim() !== "";
      const hasFirstName =
        data.tenantInfo.firstName && data.tenantInfo.firstName.trim() !== "";
      const hasLastName =
        data.tenantInfo.lastName && data.tenantInfo.lastName.trim() !== "";

      return hasId || (hasEmail && hasFirstName && hasLastName);
    },
    {
      message:
        "Either select an existing tenant OR provide email, first name, and last name to invite a new tenant",
      path: ["tenantInfo"],
    }
  )
  .refine(
    (data) => {
      // If email is provided without ID, firstName and lastName must be provided
      const hasEmail =
        data.tenantInfo.email && data.tenantInfo.email.trim() !== "";
      const hasId = data.tenantInfo.id && data.tenantInfo.id.trim() !== "";
      const hasFirstName =
        data.tenantInfo.firstName && data.tenantInfo.firstName.trim() !== "";
      const hasLastName =
        data.tenantInfo.lastName && data.tenantInfo.lastName.trim() !== "";

      if (hasEmail && !hasId) {
        return hasFirstName && hasLastName;
      }
      return true;
    },
    {
      message:
        "First name and last name are required when inviting a new tenant",
      path: ["tenantInfo", "firstName"],
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
  )
  .refine(
    (data) => {
      // Properties with units must have a unitId selected
      if (data.property.hasUnits) {
        return data.property.unitId && data.property.unitId.trim() !== "";
      }
      return true;
    },
    {
      message: "Unit selection is required for this property",
      path: ["property", "unitId"],
    }
  )
  .refine(
    (data) => {
      // If late fee type is "fixed", late fee amount must be > 0
      if (data.fees.lateFeeType === "fixed") {
        return data.fees.lateFeeAmount && data.fees.lateFeeAmount > 0;
      }
      return true;
    },
    {
      message: "Late fee amount is required when late fee type is Fixed",
      path: ["fees", "lateFeeAmount"],
    }
  )
  .refine(
    (data) => {
      // If late fee type is "percentage", late fee percentage must be > 0
      if (data.fees.lateFeeType === "percentage") {
        return data.fees.lateFeePercentage && data.fees.lateFeePercentage > 0;
      }
      return true;
    },
    {
      message:
        "Late fee percentage is required when late fee type is Percentage",
      path: ["fees", "lateFeePercentage"],
    }
  )
  .refine(
    (data) => {
      // If late fee type is selected, late fee days must be > 0
      if (data.fees.lateFeeType) {
        return data.fees.lateFeeDays && data.fees.lateFeeDays > 0;
      }
      return true;
    },
    {
      message:
        "Late fee grace period (days) is required when late fee type is selected",
      path: ["fees", "lateFeeDays"],
    }
  );

// Renewal-specific schemas (relaxed validation for pre-filled fields)
const leaseRenewalTenantSchema = z.object({
  id: z.string().min(1, "Tenant is required"), // Only validate tenant ID exists
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// Lease renewal schema - built from scratch with relaxed property/tenant validation
export const leaseRenewalSchema = z
  .object({
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
      .union([z.string(), z.array(internalNoteSchema)])
      .optional(),
    leaseDocument: z.array(z.any()).optional(),
  })
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
  )
  .refine(
    (data) => {
      // If late fee type is "fixed", late fee amount must be > 0
      if (data.fees.lateFeeType === "fixed") {
        return data.fees.lateFeeAmount && data.fees.lateFeeAmount > 0;
      }
      return true;
    },
    {
      message: "Late fee amount is required when late fee type is Fixed",
      path: ["fees", "lateFeeAmount"],
    }
  )
  .refine(
    (data) => {
      // If late fee type is "percentage", late fee percentage must be > 0
      if (data.fees.lateFeeType === "percentage") {
        return data.fees.lateFeePercentage && data.fees.lateFeePercentage > 0;
      }
      return true;
    },
    {
      message:
        "Late fee percentage is required when late fee type is Percentage",
      path: ["fees", "lateFeePercentage"],
    }
  )
  .refine(
    (data) => {
      // If late fee type is selected, late fee days must be > 0
      if (data.fees.lateFeeType) {
        return data.fees.lateFeeDays && data.fees.lateFeeDays > 0;
      }
      return true;
    },
    {
      message:
        "Late fee grace period (days) is required when late fee type is selected",
      path: ["fees", "lateFeeDays"],
    }
  );

export const leaseTabFields = {
  property: ["property.id", "property.unitId", "property.propertyType"],
  tenant: [
    "tenantInfo.id",
    "tenantInfo.email",
    "tenantInfo.firstName",
    "tenantInfo.lastName",
  ],
  leaseTerms: [
    "type",
    "templateType",
    "duration.startDate",
    "duration.endDate",
    "duration.moveInDate",
  ],
  financial: [
    "fees.monthlyRent",
    "fees.securityDeposit",
    "fees.rentDueDay",
    "fees.currency",
    "fees.acceptedPaymentMethod",
    "fees.lateFeeAmount",
    "fees.lateFeeDays",
    "fees.lateFeeType",
  ],
  signature: ["signingMethod"],
  additional: [
    "utilitiesIncluded",
    "petPolicy",
    "renewalOptions",
    "internalNotes",
  ],
  cotenants: ["coTenants"],
  documents: ["leaseDocument"],
};
