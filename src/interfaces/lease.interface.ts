export enum LeaseStatusEnum {
  DRAFT = "draft",
  DRAFT_RENEWAL = "draft_renewal",
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
  hasUnits?: boolean;
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
  occupation: string | undefined;
  relationship: string | undefined;
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
  daysBeforeExpiryToGenerateRenewal?: number;
  daysBeforeExpiryToAutoSendSignature?: number;
  requireApproval?: boolean;
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

export interface InternalNote {
  note: string;
  author: string;
  authorId: string;
  timestamp: string;
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
  internalNotes?: InternalNote[] | string; // TODO: Migrate to InternalNote[] format after UI update
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

// Lease Detail Response Interfaces
export interface LeaseDetailResponse {
  success: boolean;
  message: string;
  data: {
    lease: LeaseDetailData;
    property: LeasePropertyDetail;
    unit?: LeaseUnitDetails;
    tenant: LeaseTenantDetail;
    documents: LeaseDocumentItem[];
    activity: LeaseActivityEvent[];
    timeline: LeaseTimeline;
    permissions: LeaseUserPermissions;
    financialSummary: LeaseFinancialSummary;
    renewalMetadata?: RenewalMetadata;
  };
}

export interface LeaseUnitDetails {
  unitId: string;
  unitNumber: string;
  floor: number;
  status: string;
  specifications: {
    totalArea: number;
    bedrooms: number;
    bathrooms: number;
    rooms: number;
    maxOccupants: number;
  };
}

export interface LeaseDetailData {
  _id: string;
  leaseNumber: string;
  status: LeaseStatusEnum;
  type: LeaseTypeEnum;
  duration: LeaseDuration;
  fees: LeaseFees;
  property: {
    id: string;
    unitId?: string;
    address: { fullAddress: string };
  };
  signingMethod: SigningMethodEnum;
  renewalOptions?: RenewalOptions;
  petPolicy?: PetPolicy;
  coTenants?: CoTenant[];
  utilitiesIncluded?: string[];
  legalTerms?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  internalNotes?: InternalNote[] | string; // TODO: Migrate to InternalNote[] format after UI update
  approvalStatus: string;
  approvalDetails?: ApprovalDetail[];
  pendingChangesPreview?: any;
  pendingChanges?: LeasePendingChanges | null;
  createdBy: LeaseUser;
  lastModifiedBy?: LastModifiedBy[];
  eSignature?: ESignature;
  tenant?: LeaseTenantDetail;
  signatures?: Signature[];
  renewalMetadata?: RenewalMetadata;
}

export type LeasePendingChanges = {
  changes: Partial<Omit<LeaseDetailData, "_id" | "createdAt" | "createdBy">>;
  updatedAt: string;
  updatedBy: string;
  displayName?: string;
};

export interface ApprovalDetail {
  action: string;
  actor: string;
  timestamp: string;
  notes?: string;
}

export interface LastModifiedBy {
  userId: string;
  date: string;
}

export interface ESignature {
  provider: string;
  status: string;
  documentId?: string;
}

export interface Signature {
  signerId: string;
  signerEmail: string;
  signedAt?: string;
  status: string;
}

export interface LeasePropertyDetail {
  _id: string;
  address: {
    street: string;
    streetNumber: string;
    city: string;
    state: string;
    country: string;
    postCode: string;
    fullAddress: string;
  };
  name: string;
  propertyType: string;
  specifications: {
    totalArea: number;
    lotSize: number;
    bedrooms: number;
    bathrooms: number;
    floors: number;
    garageSpaces: number;
    maxOccupants: number;
  };
  maxAllowedUnits: number;
  pid: string;
  owner: {
    type: string;
  };
  id: string;
}

export interface LeaseTenantDetail {
  id: string;
  avatar?: string;
  email: string;
  phone: string;
  fullname: string;
}

export interface LeaseUser {
  _id: string;
  personalInfo: {
    avatar: {
      url: string;
    };
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  fullname: string;
  id: string;
}

export interface LeaseDocumentItem {
  documentType: string;
  url: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface LeaseActivityEvent {
  type?: string;
  description: string;
  timestamp: string;
  user: string;
  notes?: string;
}

export interface LeaseTimeline {
  created: string;
  startDate: string;
  endDate: string;
  moveInDate: string;
  daysRemaining: number;
  daysElapsed: number;
  isActive: boolean;
  isExpiringSoon: boolean;
  progress: number;
}

export interface LeaseUserPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canTerminate: boolean;
  canActivate: boolean;
  canDownload: boolean;
  canViewDocuments: boolean;
  canUploadDocuments: boolean;
  canViewActivity: boolean;
  canViewFinancials: boolean;
  canManageSignatures: boolean;
  canGeneratePDF: boolean;
}

export interface LeaseFinancialSummary {
  monthlyRent: string;
  monthlyRentRaw: number;
  securityDeposit: string;
  securityDepositRaw: number;
  currency: string;
  rentDueDay: number;
  lateFeeAmount?: number;
  lateFeeDays?: number;
  lateFeeType?: "fixed" | "percentage";
  acceptedPaymentMethod?: string;
  totalExpected: number;
  totalPaid: number;
  totalOwed: number;
  lastPaymentDate: string | null;
  nextPaymentDate: string;
}

// Lease Renewal Interfaces
export interface LeaseRenewalFormValues {
  duration: LeaseDuration;
  fees: LeaseFees;
  renewalOptions?: RenewalOptions & {
    enableAutoSendForSignature?: boolean;
    daysBeforeExpiryToAutoSendSignature?: number;
    daysBeforeExpiryToGenerateRenewal?: number;
  };
  petPolicy?: PetPolicy;
  coTenants?: CoTenant[];
  utilitiesIncluded?: UtilityEnum[];
  legalTerms?: string;
  internalNotes?: InternalNote[] | string; // TODO: Migrate to InternalNote[] format after UI update
}

export interface LeaseRenewalRequest extends LeaseRenewalFormValues {
  previousLeaseId: string;
}

export interface LeaseRenewalResponse {
  success: boolean;
  message: string;
  data: {
    luid: string;
    status: LeaseStatusEnum.DRAFT_RENEWAL;
    approvalStatus: string;
    previousLeaseId: string;
    duration: LeaseDuration;
    fees: LeaseFees;
  };
}

/**
 * Renewal Metadata Interface
 * Pre-calculated renewal information for active/draft_renewal leases
 * Only included in lease response when status is 'active' or 'draft_renewal'
 */
export interface RenewalMetadata {
  daysUntilExpiry: number;
  renewalWindowDays: number;
  isEligible: boolean;
  canRenew: boolean;
  ineligibilityReason: string | null;
  renewalDates: {
    startDate: string;
    endDate: string;
    moveInDate: string;
  };
  renewalFormData: {
    property: {
      id: string;
      unitId: string;
    };
    tenant: {
      id: string;
    };
    duration: {
      startDate: string;
      endDate: string;
      moveInDate: string;
    };
    fees: LeaseFees;
    type: LeaseTypeEnum;
    signingMethod: SigningMethodEnum;
    renewalOptions: RenewalOptions;
    petPolicy: PetPolicy;
    utilitiesIncluded: string[];
    legalTerms: string;
    coTenants: CoTenant[];
  };
}
