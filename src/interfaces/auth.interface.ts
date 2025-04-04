import { z } from "zod";
import { GDPRSettings } from "@store/interface";
import { UserClient } from "@store/hooks/useAuth";
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
export interface ICurrentUser {
  preferences: {
    theme?: "light" | "dark";
    lang?: string;
    timezone?: string;
  };
  client: { csub: string; displayName: string };
  clients: UserClient[];
  fullname: string | null;
  permissions: string[];
  displayName: string;
  gdpr?: GDPRSettings;
  avatarUrl: string;
  isActive: boolean;
  email: string;
  sub: string;
}
