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

// Lease List Interfaces
export interface Lease {
  _id: string;
  luid: string;
  leaseNumber: string;
  cuid: string;
  status: LeaseStatusEnum;
  type: LeaseTypeEnum;
  tenantId: string;
  useInvitationIdAsTenantId?: boolean;
  property: {
    id: string;
    unitId?: string;
    address: string;
    name?: string;
    propertyType?: string;
  };
  duration: {
    startDate: string;
    endDate: string;
    moveInDate?: string;
    moveOutDate?: string;
    terminationDate?: string;
  };
  fees: {
    monthlyRent: number;
    securityDeposit: number;
    rentDueDay: number;
    currency: string;
    lateFeeAmount?: number;
    lateFeeDays?: number;
    lateFeeType?: "fixed" | "percentage";
    lateFeePercentage?: number;
    acceptedPaymentMethod?: string;
  };
  signingMethod: SigningMethodEnum;
  signedDate?: string;
  approvalStatus: string;
  createdAt: string;
  updatedAt: string;
  // Virtuals
  daysUntilExpiry?: number | null;
  durationMonths?: number | null;
  isExpiringSoon?: boolean;
  isActive?: boolean;
}

export interface LeaseListItem {
  _id: string;
  luid: string;
  leaseNumber: string;
  status: LeaseStatusEnum;
  type: LeaseTypeEnum;
  tenantName?: string;
  tenantEmail?: string;
  propertyAddress: string;
  propertyName?: string;
  unitNumber?: string;
  monthlyRent: number;
  currency: string;
  startDate: string;
  endDate: string;
  daysUntilExpiry?: number | null;
  isExpiringSoon?: boolean;
}

export interface LeaseStats {
  totalLeases: number;
  leasesByStatus: {
    draft: number;
    pending_signature: number;
    active: number;
    expired: number;
    terminated: number;
    cancelled: number;
  };
  averageLeaseDuration: number;
  totalMonthlyRent: number;
  expiringIn30Days: number;
  expiringIn60Days: number;
  expiringIn90Days: number;
  occupancyRate: number;
}

export interface FilteredLeasesResponse {
  items: Lease[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Actual API response structure for getFilteredLeases
export interface LeaseListResponse {
  success: boolean;
  data: LeaseListItem[];
  message: string;
  pagination: {
    total: number;
    perPage: number;
    totalPages: number;
    currentPage: number;
    hasMoreResource: boolean;
  };
}
