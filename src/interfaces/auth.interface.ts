import { z } from "zod";
import { GDPRSettings } from "@store/interface";
import {
  AccountActivationSchema,
  ResetPasswordSchema,
  SignupSchema,
  LoginSchema,
} from "@validations/auth.validations";

import { UserClient } from "./client.interface";

export type ISignupForm = z.infer<typeof SignupSchema>;
export type IResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
export type IAccountActivationForm = z.infer<typeof AccountActivationSchema>;
export type ILoginForm = z.infer<typeof LoginSchema>;

export interface IUserSubscription {
  plan: {
    name: "essential" | "growth" | "portfolio";
    status: "active" | "inactive" | "pending" | "expired";
    billingInterval: "monthly" | "annual";
  };
  entitlements: {
    eSignature: boolean;
    RepairRequestService: boolean;
    VisitorPassService: boolean;
    reportingAnalytics: boolean;
    prioritySupport?: boolean;
  };
  paymentFlow?: {
    requiresPayment: boolean;
    reason: "pending_signup" | "grace_period" | "expired" | null;
    gracePeriodEndsAt: string | null;
    daysUntilDowngrade: number | null;
  };
}

export interface ICurrentUser {
  preferences: {
    theme?: "light" | "dark";
    lang?: string;
    timezone?: string;
  };
  client: { cuid: string; clientDisplayName: string; role: string };
  clients: UserClient[];
  fullname: string | null;
  permissions: string[];
  displayName: string;
  gdpr?: GDPRSettings;
  avatarUrl: string;
  isActive: boolean;
  email: string;
  uid: string;
  sub: string;
  subscription?: IUserSubscription;
}
