export type UserClient = {
  cuid: string;
  displayName: string;
};

export interface IClientAccountType {
  planId: string;
  planName: string;
  isEnterpriseAccount: boolean;
}

export interface Icuidentification {
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

export interface IClientSubscription {
  planName: string;
  status: string;
  currentProperties: number;
  currentUnits: number;
  currentSeats: number;
  billingCycle?: "monthly" | "annual";
  nextBillingDate?: string;
  amount?: number;
  paymentMethod?: {
    type: string;
    last4: string;
    expiry: string;
  };
}

export interface IClient {
  cuid: string;
  accountType: IClientAccountType;
  identification: Icuidentification;
  subscription?: IClientSubscription;
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
