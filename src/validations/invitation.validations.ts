import { z } from "zod";

// Helper function to transform form data before validation
export const sanitizeInvitationFormData = (data: any) => {
  const sanitized = { ...data };
  const emptyStringToUndefined = (value: any) => {
    if (value === "" || value === null) return undefined;
    return value;
  };
  const stringToDate = (value: any) => {
    if (typeof value === "string" && value.trim() !== "") {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return emptyStringToUndefined(value);
  };

  // Sanitize employeeInfo
  if (sanitized.employeeInfo) {
    if (sanitized.employeeInfo.startDate) {
      sanitized.employeeInfo.startDate = stringToDate(
        sanitized.employeeInfo.startDate
      );
    }

    Object.keys(sanitized.employeeInfo).forEach((key) => {
      if (key !== "startDate" && key !== "permissions") {
        sanitized.employeeInfo[key] = emptyStringToUndefined(
          sanitized.employeeInfo[key]
        );
      }
    });

    const hasValidEmployeeData = Object.values(sanitized.employeeInfo).some(
      (value) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (Array.isArray(value) ? value.length > 0 : true)
    );
    if (!hasValidEmployeeData) {
      sanitized.employeeInfo = undefined;
    }
  }

  if (sanitized.vendorInfo) {
    if (sanitized.vendorInfo.contactPerson) {
      Object.keys(sanitized.vendorInfo.contactPerson).forEach((key) => {
        sanitized.vendorInfo.contactPerson[key] = emptyStringToUndefined(
          sanitized.vendorInfo.contactPerson[key]
        );
      });

      // Remove contactPerson if it's empty
      const hasValidContactData = Object.values(
        sanitized.vendorInfo.contactPerson
      ).some((value) => value !== undefined && value !== null && value !== "");
      if (!hasValidContactData) {
        sanitized.vendorInfo.contactPerson = undefined;
      }
    }

    if (sanitized.vendorInfo.insuranceInfo) {
      if (sanitized.vendorInfo.insuranceInfo.expirationDate) {
        sanitized.vendorInfo.insuranceInfo.expirationDate = stringToDate(
          sanitized.vendorInfo.insuranceInfo.expirationDate
        );
      }

      Object.keys(sanitized.vendorInfo.insuranceInfo).forEach((key) => {
        if (
          key !== "hasInsurance" &&
          key !== "expirationDate" &&
          key !== "coverageAmount"
        ) {
          sanitized.vendorInfo.insuranceInfo[key] = emptyStringToUndefined(
            sanitized.vendorInfo.insuranceInfo[key]
          );
        }
      });
    }

    Object.keys(sanitized.vendorInfo).forEach((key) => {
      if (
        key !== "contactPerson" &&
        key !== "insuranceInfo" &&
        key !== "yearsInBusiness" &&
        key !== "servicesOffered" &&
        key !== "serviceArea"
      ) {
        sanitized.vendorInfo[key] = emptyStringToUndefined(
          sanitized.vendorInfo[key]
        );
      }
    });

    const hasValidVendorData = Object.values(sanitized.vendorInfo).some(
      (value) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (typeof value === "object" && value !== null
          ? Object.keys(value).length > 0
          : true)
    );
    if (!hasValidVendorData) {
      sanitized.vendorInfo = undefined;
    }
  }

  if (sanitized.personalInfo) {
    sanitized.personalInfo.phoneNumber = emptyStringToUndefined(
      sanitized.personalInfo.phoneNumber
    );
  }

  if (sanitized.metadata) {
    if (sanitized.metadata.inviteMessage) {
      sanitized.metadata.inviteMessage = emptyStringToUndefined(
        sanitized.metadata.inviteMessage
      );
    }

    const hasValidMetadata = Object.values(sanitized.metadata).some(
      (value) => value !== undefined && value !== null && value !== ""
    );
    if (!hasValidMetadata) {
      sanitized.metadata = undefined;
    }
  }

  return sanitized;
};

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
    role: z.enum(["manager", "vendor", "tenant", "staff", "admin"], {
      required_error: "Please select a role",
    }),
    status: z
      .enum(["draft", "pending"], {
        errorMap: () => ({ message: "Status must be either draft or pending" }),
      })
      .optional()
      .default("pending"),
    metadata: z
      .object({
        inviteMessage: z
          .string()
          .max(500, "Message must be less than 500 characters")
          .optional(),
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
    // For staff roles (manager, staff, tenant, admin), validate employeeInfo
    if (
      ["manager", "staff", "tenant", "admin"].includes(data.role) &&
      data.employeeInfo
    ) {
      if (!data.employeeInfo.jobTitle) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Job title is required for staff roles",
          path: ["employeeInfo", "jobTitle"],
        });
      }
      if (!data.employeeInfo.department) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Department is required for staff roles",
          path: ["employeeInfo", "department"],
        });
      }
    }

    // For vendor role, validate vendorInfo
    if (data.role === "vendor" && data.vendorInfo) {
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

    if (
      data.role === "vendor" &&
      data.vendorInfo?.contactPerson?.email &&
      !z.string().email().safeParse(data.vendorInfo.contactPerson.email).success
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid email address",
        path: ["vendorInfo", "contactPerson", "email"],
      });
    }

    if (
      data.role === "vendor" &&
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
