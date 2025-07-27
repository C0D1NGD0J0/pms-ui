import { z } from "zod";

// Identification Schema
const cuidentificationSchema = z.object({
  idType: z.enum([
    "passport",
    "driverLicense",
    "nationalId",
    "businessRegistration",
    "",
  ]),
  issueDate: z.union([z.date(), z.string()]).optional(),
  expiryDate: z.union([z.date(), z.string()]).optional(),
  idNumber: z.string().optional(),
  authority: z.string().optional(),
  issuingState: z.string().optional(),
  retentionExpiryDate: z.union([z.date(), z.string()]).optional(),
  lastVerifiedAt: z.union([z.date(), z.string()]).optional(),
  dataProcessingConsent: z.boolean(),
  processingConsentDate: z.union([z.date(), z.string()]).optional(),
  idimage: z.union([z.instanceof(File), z.string()]).optional(),
});

// Contact Info Schema
const clientContactInfoSchema = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  contactPerson: z.string().optional(),
});

// Company Profile Schema
const companyProfileSchema = z.object({
  legalEntityName: z.string().optional(),
  tradingName: z.string().optional(),
  companyEmail: z.string().email().optional(),
  registrationNumber: z.string().optional(),
  website: z.string().url().optional(),
  companyPhone: z.string().optional(),
  contactInfo: clientContactInfoSchema,
});

// Notification Preferences Schema
const clientNotificationPreferencesSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  inApp: z.boolean(),
});

// Settings Schema
const clientSettingsSchema = z.object({
  notificationPreferences: clientNotificationPreferencesSchema,
  timeZone: z.string(),
  lang: z.string(),
});

// Main Update Schema - mirrors server validation exactly
export const updateClientDetailsSchema = z
  .object({
    identification: cuidentificationSchema.partial().optional(),
    companyProfile: companyProfileSchema.partial().optional(),
    displayName: z
      .string()
      .trim()
      .min(1, "Display name cannot be empty")
      .optional(),
    settings: clientSettingsSchema.partial().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  })
  .refine(
    (data) => {
      // If identification is provided, ensure required fields are present when updating idType
      if (data.identification?.idType && !data.identification?.idNumber) {
        return false;
      }
      if (data.identification?.idNumber && !data.identification?.idType) {
        return false;
      }
      return true;
    },
    {
      message:
        "When updating identification, both idType and idNumber are required",
      path: ["identification"],
    }
  )
  .refine(
    (data) => {
      // Validate email format in company profile if provided
      if (data.companyProfile?.companyEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(data.companyProfile.companyEmail);
      }
      return true;
    },
    {
      message: "Invalid company email format",
      path: ["companyProfile", "companyEmail"],
    }
  );

export type UpdateClientDetailsFormData = z.infer<
  typeof updateClientDetailsSchema
>;
