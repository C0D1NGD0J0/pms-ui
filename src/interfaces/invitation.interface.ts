export type IUserRole = "LANDLORD" | "TENANT" | "EMPLOYEE" | "VENDOR" | "ADMIN";

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
  // Role-specific data
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

export interface IInvitationListQuery {
  status?: "pending" | "accepted" | "expired" | "revoked" | "sent";
  sortBy?: "createdAt" | "expiresAt" | "inviteeEmail";
  sortOrder?: "asc" | "desc";
  clientId: string;
  role?: IUserRole;
  limit?: number;
  page?: number;
}

export interface IResendInvitationData {
  customMessage?: string;
  iuid: string;
}
