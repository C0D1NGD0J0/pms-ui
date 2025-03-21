import { SignupSchema } from "@validations/auth.validations";
import { z } from "zod";

export type ISignupForm = z.infer<typeof SignupSchema>;
