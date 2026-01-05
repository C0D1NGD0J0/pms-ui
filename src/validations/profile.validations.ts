import { z } from "zod";

// Personal Information Schema
const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name is too long"),
  email: z.string().email("Invalid email format"),
  location: z.string().optional(),
  dob: z.date().nullable().optional(),
  avatar: z
    .object({
      url: z.string().optional().or(z.literal("")),
      filename: z.string().optional(),
      key: z.string().optional(),
      file: z.instanceof(File).optional(),
    })
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .min(10, "Phone number is too short")
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  bio: z.string().max(500, "Bio is too long").optional(),
  headline: z.string().max(100, "Headline is too long").optional(),
});

// Settings Schema
const settingsSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  loginType: z.enum(["otp", "password"]).default("password"),
  timeZone: z.string().default("UTC"),
  lang: z.string().default("en"),
  notifications: z
    .object({
      messages: z.boolean().default(false),
      comments: z.boolean().default(false),
      announcements: z.boolean().default(false),
    })
    .default({
      messages: false,
      comments: false,
      announcements: false,
    }),
  gdprSettings: z
    .object({
      dataRetentionPolicy: z
        .enum(["standard", "extended", "minimal"])
        .default("standard"),
      dataProcessingConsent: z.boolean().default(false),
    })
    .default({
      dataRetentionPolicy: "standard",
      dataProcessingConsent: false,
    }),
});

// Identification Schema
const identificationSchema = z
  .object({
    idType: z
      .enum([
        "passport",
        "drivers-license",
        "national-id",
        "corporation-license",
      ])
      .default("passport"),
    issueDate: z.date().nullable().optional(),
    expiryDate: z.date().nullable().optional(),
    idNumber: z.string().optional(),
    authority: z.string().optional(),
    issuingState: z.string().optional(),
  })
  .refine(
    (data) => {
      // If any ID field is filled, then idNumber should be required
      if (
        data.authority ||
        data.issuingState ||
        data.issueDate ||
        data.expiryDate
      ) {
        return data.idNumber && data.idNumber.length > 0;
      }
      return true;
    },
    {
      message:
        "ID number is required when other identification details are provided",
      path: ["idNumber"],
    }
  )
  .refine(
    (data) => {
      // If expiry date is provided, issue date should be before expiry date
      if (data.issueDate && data.expiryDate) {
        return data.issueDate <= data.expiryDate;
      }
      return true;
    },
    {
      message: "Issue date must be before expiry date",
      path: ["expiryDate"],
    }
  );

// Documents Schema
const documentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Document name is required"),
  type: z.enum([
    "passport",
    "id_card",
    "drivers_license",
    "birth_certificate",
    "social_security",
    "tax_document",
    "employment_verification",
    "other",
  ]),
  file: z.instanceof(File).optional(),
  url: z.string().optional(),
  filename: z.string().optional(),
  key: z.string().optional(),
  uploadedAt: z.date().optional(),
  expiryDate: z.date().nullable().optional(),
  status: z
    .enum(["valid", "expiring", "expired", "uploaded", "pending"])
    .default("pending"),
});

const documentsSchema = z.object({
  items: z.array(documentSchema).default([]).optional(),
});

// Employee Information Schema
const employeeInfoSchema = z.object({
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  reportsTo: z.string().optional(),
  employeeId: z.string().optional(),
  startDate: z.date().nullable().optional(),
  permissions: z.array(z.string()).default([]),
});

// Vendor Information Schema
const vendorInfoSchema = z.object({
  vendorId: z.string().optional(),
  linkedVendorUid: z.string().optional(),
  isLinkedAccount: z.boolean().default(false),
});

// Main Profile Schema
export const profileSchema = z.object({
  personalInfo: personalInfoSchema,
  settings: settingsSchema,
  identification: identificationSchema,
  documents: documentsSchema,
  employeeInfo: employeeInfoSchema,
  vendorInfo: vendorInfoSchema,
});

// Export individual schemas for specific use cases
export const personalInfoValidation = personalInfoSchema;
export const settingsValidation = settingsSchema;
export const identificationValidation = identificationSchema;
export const documentsValidation = documentsSchema;
export const documentValidation = documentSchema;
export const employeeInfoValidation = employeeInfoSchema;
export const vendorInfoValidation = vendorInfoSchema;

// TypeScript types derived from schemas
export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
export type SettingsFormValues = z.infer<typeof settingsSchema>;
export type IdentificationFormValues = z.infer<typeof identificationSchema>;
export type DocumentFormValues = z.infer<typeof documentSchema>;
export type DocumentsFormValues = z.infer<typeof documentsSchema>;
export type EmployeeInfoFormValues = z.infer<typeof employeeInfoSchema>;
export type VendorInfoFormValues = z.infer<typeof vendorInfoSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
// Default values for form initialization
export const defaultProfileValues: ProfileFormValues = {
  personalInfo: {
    firstName: "",
    lastName: "",
    displayName: "",
    location: "",
    dob: null,
    avatar: {
      url: "",
      filename: "",
      key: "",
      file: undefined,
    },
    phoneNumber: "",
    bio: "",
    email: "",
    headline: "",
  },
  settings: {
    theme: "light",
    loginType: "password",
    notifications: {
      messages: false,
      comments: false,
      announcements: false,
    },
    gdprSettings: {
      dataRetentionPolicy: "standard",
      dataProcessingConsent: false,
    },
    timeZone: "",
    lang: "en",
  },
  identification: {
    idType: "passport",
    issueDate: null,
    expiryDate: null,
    idNumber: "",
    authority: "",
    issuingState: "",
  },
  documents: {
    items: [],
  },
  employeeInfo: {
    jobTitle: "",
    department: "",
    reportsTo: "",
    employeeId: "",
    startDate: null,
    permissions: [],
  },
  vendorInfo: {
    vendorId: "",
    linkedVendorUid: "",
    isLinkedAccount: false,
  },
};

// Tab field mapping for validation
export const profileTabFields = {
  personal: [
    "personalInfo.firstName",
    "personalInfo.lastName",
    "personalInfo.displayName",
    "personalInfo.email",
    "personalInfo.location",
    "personalInfo.dob",
    "personalInfo.phoneNumber",
    "personalInfo.bio",
    "personalInfo.headline",
    "personalInfo.avatar",
  ],
  identification: [
    "identification.idType",
    "identification.issueDate",
    "identification.expiryDate",
    "identification.idNumber",
    "identification.authority",
    "identification.issuingState",
  ],
  settings: [
    "settings.theme",
    "settings.loginType",
    "settings.timeZone",
    "settings.lang",
    "settings.notifications.messages",
    "settings.notifications.comments",
    "settings.notifications.announcements",
    "settings.gdprSettings.dataRetentionPolicy",
    "settings.gdprSettings.dataProcessingConsent",
  ],
  documents: ["documents.items"],
  security: [], // Security settings handled separately
} as const;
