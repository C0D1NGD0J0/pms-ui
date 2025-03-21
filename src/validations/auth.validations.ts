import { validatePhoneNumber } from "@utils/helpers";
import { z } from "zod";

export const SignupSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    cpassword: z.string(),
    location: z.string().min(1, { message: "Location is required" }),
    accountType: z.object({
      planId: z.string().min(1, { message: "Plan is required" }).optional(),
      planName: z.string().min(1, { message: "Plan name is required" }),
      isEnterpriseAccount: z.boolean(),
    }),
    displayName: z
      .string()
      .min(2, { message: "Display name is required" })
      .max(15, { message: "Display name must be at most 15 characters long" }),
    companyProfile: z.object({
      tradingName: z.string().optional(),
      legalEntityName: z.string().optional(),
      website: z.string().optional(),
      companyEmail: z.string().optional(),
      companyPhone: z.string().optional(),
      companyAddress: z.string().optional(),
    }),
    phoneNumber: z
      .string()
      .min(9, { message: "Phone number is required" })
      .max(15, { message: "Phone number is too long" })
      .refine(
        validatePhoneNumber,
        "Please specify a valid phone number (include the international prefix)."
      ),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords don't match",
    path: ["cpassword"],
  })
  .superRefine((data, ctx) => {
    // Only validate companyProfile if accountType is corporate/enterprise
    if (data.accountType.isEnterpriseAccount) {
      // Validate tradingName
      if (
        !data.companyProfile.tradingName ||
        data.companyProfile.tradingName.length < 2
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Trading name is required",
          path: ["companyProfile", "tradingName"],
        });
      }

      // Validate legalEntityName
      if (
        !data.companyProfile.legalEntityName ||
        data.companyProfile.legalEntityName.length < 2
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Legal entity name is required",
          path: ["companyProfile", "legalEntityName"],
        });
      }

      // Validate website
      if (
        data.companyProfile.website &&
        !data.companyProfile.website.match(
          /^https?:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(\/[a-zA-Z0-9-./?=&%]*)*$/
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid URL",
          path: ["companyProfile", "website"],
        });
      }

      // Validate companyEmail
      if (
        !data.companyProfile.companyEmail ||
        !data.companyProfile.companyEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid email address",
          path: ["companyProfile", "companyEmail"],
        });
      }

      // Validate companyPhone
      if (
        !data.companyProfile.companyPhone ||
        data.companyProfile.companyPhone.length < 9 ||
        data.companyProfile.companyPhone.length > 15 ||
        !validatePhoneNumber(data.companyProfile.companyPhone)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Please specify a valid phone number (include the international prefix).",
          path: ["companyProfile", "companyPhone"],
        });
      }

      // Validate companyAddress
      if (
        !data.companyProfile.companyAddress ||
        data.companyProfile.companyAddress.length < 5
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Address is required",
          path: ["companyProfile", "companyAddress"],
        });
      }
    }
  });
