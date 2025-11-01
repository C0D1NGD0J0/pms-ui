export enum LeaseStatusEnum {
  DRAFT = "draft",
  PENDING_SIGNATURE = "pending_signature",
  ACTIVE = "active",
  EXPIRED = "expired",
  TERMINATED = "terminated",
  CANCELLED = "cancelled",
}

export enum LeaseTypeEnum {
  FIXED_TERM = "fixed_term",
  MONTH_TO_MONTH = "month_to_month",
}

export enum SigningMethodEnum {
  ELECTRONIC = "electronic",
  MANUAL = "manual",
  PENDING = "pending",
}

export enum PaymentMethodEnum {
  E_TRANSFER = "e-transfer",
  CREDIT_CARD = "credit_card",
  CRYPTO = "crypto",
}

export enum UtilityEnum {
  WATER = "water",
  GAS = "gas",
  ELECTRICITY = "electricity",
  INTERNET = "internet",
  CABLE = "cable",
  TRASH = "trash",
  SEWER = "sewer",
  HEATING = "heating",
  COOLING = "cooling",
}

export interface LeaseProperty {
  id: string;
  address?: string;
  unitId?: string;
  propertyType?: string;
}

export interface LeaseFees {
  monthlyRent: number;
  currency: string;
  rentDueDay: number;
  securityDeposit: number;
  lateFeeAmount?: number;
  lateFeeDays?: number;
  lateFeeType?: "fixed" | "percentage";
  lateFeePercentage?: number;
  acceptedPaymentMethod?: PaymentMethodEnum;
}

export interface LeaseDuration {
  startDate: Date | string;
  endDate: Date | string;
  moveInDate?: Date | string;
}

export interface CoTenant {
  name: string;
  email: string;
  phone: string;
  occupation?: string;
}

export interface PetPolicy {
  allowed: boolean;
  types?: string[];
  maxPets?: number;
  deposit?: number;
  monthlyFee?: number;
}

export interface RenewalOptions {
  autoRenew: boolean;
  noticePeriodDays?: number;
  renewalTermMonths?: number;
}

export interface TenantInfo {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface LeaseDocument {
  documentType?: string;
  filename: string;
  url: string;
  key: string;
  mimeType?: string;
  size?: number;
}

export interface LeaseFormValues {
  property: LeaseProperty;
  tenantInfo: TenantInfo;
  duration: LeaseDuration;
  fees: LeaseFees;
  type: LeaseTypeEnum;
  signingMethod?: SigningMethodEnum;
  templateType?: string;
  utilitiesIncluded?: UtilityEnum[];
  coTenants?: CoTenant[];
  petPolicy?: PetPolicy;
  renewalOptions?: RenewalOptions;
  internalNotes?: string;
  leaseDocument?: LeaseDocument[];
  [key: string]: any;
}

export const defaultLeaseFormValues: LeaseFormValues = {
  property: {
    id: "",
    address: "",
    unitId: "",
  },
  tenantInfo: {
    id: "",
    email: "",
  },
  duration: {
    startDate: "",
    endDate: "",
    moveInDate: "",
  },
  fees: {
    monthlyRent: 0,
    currency: "USD",
    rentDueDay: 1,
    securityDeposit: 0,
    lateFeeAmount: 0,
    lateFeeDays: 0,
    lateFeeType: undefined,
    lateFeePercentage: 0,
    acceptedPaymentMethod: undefined,
  },
  type: LeaseTypeEnum.FIXED_TERM,
  signingMethod: undefined,
  templateType: "",
  utilitiesIncluded: [],
  coTenants: [],
  petPolicy: {
    allowed: false,
    types: [],
    maxPets: 0,
    deposit: 0,
    monthlyFee: 0,
  },
  renewalOptions: {
    autoRenew: false,
    noticePeriodDays: 0,
    renewalTermMonths: 0,
  },
  internalNotes: "",
  leaseDocument: [],
};

export interface CreateLeaseRequest extends Omit<LeaseFormValues, "property"> {
  property: LeaseProperty;
}

export interface LeasePreviewRequest {
  property: LeaseProperty;
  tenantInfo: TenantInfo;
  duration: LeaseDuration;
  fees: LeaseFees;
  type: LeaseTypeEnum;
  utilitiesIncluded?: UtilityEnum[];
  coTenants?: CoTenant[];
  petPolicy?: PetPolicy;
  renewalOptions?: RenewalOptions;
}

export interface LeaseableProperty {
  id: string;
  name: string;
  address: string;
  propertyType: string;
  financialInfo?: {
    monthlyRent?: number;
    securityDeposit?: number;
    currency?: string;
  };
  units?: {
    id: string;
    unitNumber: string;
    status: string;
    financialInfo?: {
      monthlyRent?: number;
      securityDeposit?: number;
      currency?: string;
    };
  }[];
}

export interface FilteredProperty {
  id: string;
  name: string;
  propertyType: string;
  reason: string;
}

export interface LeaseablePropertiesMetadata {
  totalProperties: number;
  filteredCount: number;
  filteredProperties?: FilteredProperty[];
}
