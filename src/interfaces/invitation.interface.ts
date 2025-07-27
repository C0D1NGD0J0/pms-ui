import { IFilterQuery } from "./utils.interface";

export type IUserRole = "manager" | "vendor" | "tenant" | "staff" | "admin";

export interface IInvitationFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
  metadata?: {
    inviteMessage?: string;
    expectedStartDate?: Date;
    attachments?: Record<
      string,
      {
        name: string;
        size: number;
        type: string;
        url: string;
      } | null
    >;
  };
  inviteeEmail: string;
  role: IUserRole;
  employeeInfo?: {
    jobTitle?: string;
    department?: string;
    permissions?: string[];
    employeeId?: string;
    reportsTo?: string;
    startDate?: Date;
  };
  vendorInfo?: {
    companyName?: string;
    businessType?: string;
    primaryService?: string;
    taxId?: string;
    registrationNumber?: string;
    yearsInBusiness?: number;
    servicesOffered?: Record<string, boolean>;
    serviceArea?: {
      maxDistance: 10 | 15 | 25 | 50;
    };
    insuranceInfo?: {
      hasInsurance: boolean;
      provider?: string;
      policyNumber?: string;
      coverageAmount?: number;
      expirationDate?: Date;
      documentUrl?: string;
      documentName?: string;
    };
    contactPerson?: {
      name?: string;
      jobTitle?: string;
      email?: string;
      phone?: string;
      department?: string;
    };
  };
  status: "pending" | "accepted" | "expired" | "revoked" | "sent" | "draft";
}

export interface IInvitationTableData {
  id: string;
  inviteeFullName: string;
  inviteeEmail: string;
  role: IUserRole;
  status: "pending" | "accepted" | "expired" | "revoked" | "sent";
  createdAt: Date;
  expiresAt: Date;
  jobTitle?: string;
  companyName?: string;
  iuid: string;
  metadata?: {
    inviteMessage?: string;
    expectedStartDate?: Date;
    remindersSent: number;
    lastReminderSent?: Date;
  };
}

export interface IInvitationStats {
  byRole: Record<IUserRole, number>;
  accepted: number;
  expired: number;
  pending: number;
  revoked: number;
  total: number;
  sent: number;
}

export interface IInvitationQuery
  extends IFilterQuery<
    "createdAt" | "inviteeEmail" | "status",
    "draft" | "pending" | "accepted" | "expired" | "revoked" | "sent" | "all"
  > {
  role?: IUserRole;
}

export interface IResendInvitationData {
  customMessage?: string;
  iuid: string;
}
