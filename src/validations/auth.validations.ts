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
    displayName: z.string().min(1, { message: "Display name is required" }),
    companyProfile: z
      .object({
        tradingName: z.string().optional(),
        legalEntityName: z.string().optional(),
        website: z.string().url({ message: "Invalid URL" }).optional(),
        companyEmail: z
          .string()
          .email({ message: "Invalid email address" })
          .optional(),
        companyPhone: z.string().optional(),
      })
      .optional(),
    phoneNumber: z.string(),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords don't match",
    path: ["cpassword"],
  });

export const enterpriseUserFormSchema = SignupSchema.refine(
  (data) => {
    // If it's an enterprise account, require company profile fields
    if (data.accountType.isEnterpriseAccount) {
      return (
        !!data.companyProfile.tradingName &&
        !!data.companyProfile.legalEntityName &&
        !!data.companyProfile.companyEmail
      );
    }
    return true;
  },
  {
    message: "Company information is required for business accounts",
    path: ["companyProfile"],
  }
);
