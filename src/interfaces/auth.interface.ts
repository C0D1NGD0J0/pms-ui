import {
  AccountActivationSchema,
  SignupSchema,
} from "@validations/auth.validations";
import { z } from "zod";

export type ISignupForm = z.infer<typeof SignupSchema>;
export type IAccountActivationForm = z.infer<typeof AccountActivationSchema>;
