import { z } from "zod";

const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .min(10, "Phone number is too short")
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
});

const employerInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  monthlyIncome: z
    .number({ invalid_type_error: "Monthly income must be a number" })
    .min(0, "Monthly income must be non-negative"),
  contactPerson: z.string().optional().or(z.literal("")),
  companyAddress: z.string().optional().or(z.literal("")),
  contactEmail: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
});

const rentalReferenceSchema = z.object({
  landlordName: z.string().min(1, "Landlord name is required"),
  landlordEmail: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  landlordContact: z.string().optional().or(z.literal("")),
  durationMonths: z
    .number({ invalid_type_error: "Duration must be a number" })
    .int("Duration must be a whole number")
    .min(0, "Duration must be non-negative"),
  reasonForLeaving: z.string().optional().or(z.literal("")),
  propertyAddress: z.string().optional().or(z.literal("")),
});

const petSchema = z.object({
  type: z.string().min(1, "Pet type is required"),
  breed: z.string().optional().or(z.literal("")),
  isServiceAnimal: z.boolean().default(false),
});

const emergencyContactSchema = z.object({
  name: z.string().min(1, "Emergency contact name is required").optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  relationship: z.string().optional().or(z.literal("")),
  email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
});

const backgroundCheckSchema = z.object({
  status: z.string(),
  checkedDate: z.string(),
  expiryDate: z.string().optional(),
  notes: z.string().optional().or(z.literal("")),
});

const tenantInfoSchema = z.object({
  employerInfo: z.array(employerInfoSchema).default([]),
  rentalReferences: z.array(rentalReferenceSchema).default([]),
  pets: z.array(petSchema).default([]),
  emergencyContact: emergencyContactSchema,
  backgroundChecks: z.array(backgroundCheckSchema).default([]).optional(),
});

export const tenantFormSchema = z.object({
  personalInfo: personalInfoSchema,
  tenantInfo: tenantInfoSchema,
});

export const employerInfoValidation = employerInfoSchema;
export const rentalReferenceValidation = rentalReferenceSchema;
export const petValidation = petSchema;
export const emergencyContactValidation = emergencyContactSchema;

export type TenantFormValues = z.infer<typeof tenantFormSchema>;
export type EmployerInfoFormValues = z.infer<typeof employerInfoSchema>;
export type RentalReferenceFormValues = z.infer<typeof rentalReferenceSchema>;
export type PetFormValues = z.infer<typeof petSchema>;
export type EmergencyContactFormValues = z.infer<typeof emergencyContactSchema>;

export const defaultTenantFormValues: TenantFormValues = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  },
  tenantInfo: {
    employerInfo: [],
    rentalReferences: [],
    pets: [],
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
      email: "",
    },
  },
};
