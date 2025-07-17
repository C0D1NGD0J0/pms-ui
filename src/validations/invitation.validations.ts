import { z } from "zod";

export const invitationSchema = z
  .object({
    personalInfo: z.object({
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      lastName: z.string().min(2, "Last name must be at least 2 characters"),
      phoneNumber: z
        .string()
        .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
        .optional()
        .or(z.literal("")),
    }),
    inviteeEmail: z.string().email("Please enter a valid email address"),
    role: z.enum(["LANDLORD", "TENANT", "EMPLOYEE", "VENDOR", "ADMIN"], {
      required_error: "Please select a role",
    }),
    metadata: z
      .object({
        inviteMessage: z
          .string()
          .max(500, "Message must be less than 500 characters")
          .optional(),
        expectedStartDate: z.date().optional(),
        attachments: z
          .record(
            z.string(),
            z
              .object({
                name: z.string(),
                size: z.number(),
                type: z.string(),
                url: z.string(),
              })
              .nullable()
          )
          .optional(),
      })
      .optional(),
    employeeInfo: z
      .object({
        jobTitle: z.string().optional(),
        department: z.string().optional(),
        permissions: z.array(z.string()).optional(),
        employeeId: z.string().optional(),
        reportsTo: z.string().optional(),
        startDate: z.date().optional(),
      })
      .optional(),
    vendorInfo: z
      .object({
        companyName: z.string().optional(),
        businessType: z.string().optional(),
        primaryService: z.string().optional(),
        taxId: z.string().optional(),
        registrationNumber: z.string().optional(),
        yearsInBusiness: z.number().min(0).max(100).optional(),
        servicesOffered: z.record(z.string(), z.boolean()).optional(),
        serviceArea: z
          .object({
            maxDistance: z
              .union([
                z.literal(10),
                z.literal(15),
                z.literal(25),
                z.literal(50),
              ])
              .optional(),
          })
          .optional(),
        insuranceInfo: z
          .object({
            hasInsurance: z.boolean().default(false),
            provider: z.string().optional(),
            policyNumber: z.string().optional(),
            coverageAmount: z.number().min(0).optional(),
            expirationDate: z.date().optional(),
            documentUrl: z.string().url().optional(),
            documentName: z.string().optional(),
          })
          .optional(),
        contactPerson: z
          .object({
            name: z.string().optional(),
            jobTitle: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            department: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Role-specific validation
    if (data.role === "EMPLOYEE" && data.employeeInfo) {
      if (!data.employeeInfo.jobTitle) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Job title is required for employees",
          path: ["employeeInfo", "jobTitle"],
        });
      }
      if (!data.employeeInfo.department) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Department is required for employees",
          path: ["employeeInfo", "department"],
        });
      }
    }

    if (data.role === "VENDOR" && data.vendorInfo) {
      // For invitation flow, only contact person name and email are required
      if (!data.vendorInfo.contactPerson?.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Contact person name is required for vendor invitations",
          path: ["vendorInfo", "contactPerson", "name"],
        });
      }
      if (!data.vendorInfo.contactPerson?.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Contact person email is required for vendor invitations",
          path: ["vendorInfo", "contactPerson", "email"],
        });
      }
    }

    // Email validation for vendor contact person
    if (
      data.role === "VENDOR" &&
      data.vendorInfo?.contactPerson?.email &&
      !z.string().email().safeParse(data.vendorInfo.contactPerson.email).success
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid email address",
        path: ["vendorInfo", "contactPerson", "email"],
      });
    }

    // Insurance validation
    if (
      data.role === "VENDOR" &&
      data.vendorInfo?.insuranceInfo?.hasInsurance
    ) {
      if (!data.vendorInfo.insuranceInfo.provider) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Insurance provider is required when insurance is available",
          path: ["vendorInfo", "insuranceInfo", "provider"],
        });
      }
      if (!data.vendorInfo.insuranceInfo.policyNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Policy number is required when insurance is available",
          path: ["vendorInfo", "insuranceInfo", "policyNumber"],
        });
      }
    }
  });

export type InvitationFormValues = z.infer<typeof invitationSchema>;
