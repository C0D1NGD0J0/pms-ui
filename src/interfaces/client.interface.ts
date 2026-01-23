export type UserClient = {
  cuid: string;
  displayName: string;
};

export interface IClientAccountType {
  category: "business" | "individual";
  billingInterval: "monthly" | "annual";
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

export interface IClientSubscription {
  _id: string;
  id: string;
  cuid: string;
  suid: string;
  client: string;
  planName: string;
  status: string;
  startDate: string;
  endDate?: string;
  billingInterval: "monthly" | "annual";
  additionalSeatsCount: number;
  additionalSeatsCost: number;
  totalMonthlyPrice: number;
  currentSeats: number;
  currentProperties: number;
  currentUnits: number;
  paymentGateway?: {
    provider: string;
    customerId: string;
    planId: string;
  };
  nextBillingDate?: string;
  amount?: number;
  pendingDowngradeAt?: string;
  paymentMethod?: {
    type: string;
    last4: string;
    expiry: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IClient {
  cuid: string;
  accountType: IClientAccountType;
  identification: IClientIdentification;
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
