import { z } from "zod";
import {
  AccountActivationSchema,
  ResetPasswordSchema,
  SignupSchema,
} from "@validations/auth.validations";

export type ISignupForm = z.infer<typeof SignupSchema>;
export type IResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
export type IAccountActivationForm = z.infer<typeof AccountActivationSchema>;
