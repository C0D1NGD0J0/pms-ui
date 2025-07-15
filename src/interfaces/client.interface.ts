export type UserClient = {
  csub: string;
  displayName: string;
};

export interface IClientAccountType {
  planId: string;
  planName: string;
  isEnterpriseAccount: boolean;
}

export interface IClientIdentification {
  idType:
    | "passport"
    | "driverLicense"
    | "nationalId"
    | "businessRegistration"
    | "";
  issueDate?: Date | string;
  expiryDate?: Date | string;
  idNumber?: string;
  authority?: string;
  issuingState?: string;
  retentionExpiryDate?: Date | string;
  lastVerifiedAt?: Date | string;
  dataProcessingConsent: boolean;
  processingConsentDate?: Date | string;
}

export interface IClientContactInfo {
  email?: string;
  phoneNumber?: string;
  contactPerson?: string;
}

export interface IClientCompanyProfile {
  legalEntityName?: string;
  tradingName?: string;
  companyEmail?: string;
  registrationNumber?: string;
  website?: string;
  companyPhone?: string;
  contactInfo: IClientContactInfo;
}

export interface IClientNotificationPreferences {
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

export interface IClientSettings {
  notificationPreferences: IClientNotificationPreferences;
  timeZone: string;
  lang: string;
}

export interface IClient {
  cuid: string;
  accountType: IClientAccountType;
  identification: IClientIdentification;
  subscription?: string;
  isVerified: boolean;
  accountAdmin:
    | string
    | {
        id: string;
        email: string;
        profile: {
          firstName: string;
          lastName: string;
          displayName: string;
          avatarUrl?: string;
        };
      };
  displayName?: string;
  companyProfile: IClientCompanyProfile;
  settings: IClientSettings;
  deletedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  verifiedBy: string;
  clientStats: {
    totalUsers: number;
    totalProperties: number;
  };
  id: string;
}

// Form-specific interfaces
export type IClientFormData = Omit<
  IClient,
  "cuid" | "accountAdmin" | "subscription" | "createdAt" | "updatedAt"
>;

// Account overview metrics
export interface IAccountMetric {
  label: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  variant?: "basic" | "icon" | "detailed";
}
