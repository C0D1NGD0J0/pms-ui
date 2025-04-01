import { z } from "zod";
import {
  AccountActivationSchema,
  ResetPasswordSchema,
  SignupSchema,
  LoginSchema,
} from "@validations/auth.validations";

export type ISignupForm = z.infer<typeof SignupSchema>;
export type IResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
export type IAccountActivationForm = z.infer<typeof AccountActivationSchema>;
export type ILoginForm = z.infer<typeof LoginSchema>;
