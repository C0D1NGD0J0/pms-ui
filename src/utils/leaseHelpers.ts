import { UserRole } from "@utils/permissions";
import {
  defaultLeaseFormValues,
  LeaseDetailData,
  LeaseFormValues,
  LeaseStatusEnum,
} from "@interfaces/lease.interface";

export function transformLeaseForDuplication(
  rawLeaseData: LeaseDetailData
): Partial<LeaseFormValues> {
  return {
    property: {
      id: "",
      unitId: "",
      address: "",
    },
    fees: {
      monthlyRent: rawLeaseData.fees.monthlyRent,
      currency: rawLeaseData.fees.currency,
      rentDueDay: rawLeaseData.fees.rentDueDay,
      securityDeposit: rawLeaseData.fees.securityDeposit,
      lateFeeAmount: rawLeaseData.fees.lateFeeAmount,
      lateFeeDays: rawLeaseData.fees.lateFeeDays,
      lateFeeType: rawLeaseData.fees.lateFeeType,
      lateFeePercentage: rawLeaseData.fees.lateFeePercentage,
      acceptedPaymentMethod: rawLeaseData.fees.acceptedPaymentMethod,
    },
    type: rawLeaseData.type,
    templateType: (rawLeaseData as any).templateType || "",
    signingMethod: rawLeaseData.signingMethod,
    utilitiesIncluded: (rawLeaseData.utilitiesIncluded || []) as any,
    petPolicy: rawLeaseData.petPolicy || defaultLeaseFormValues.petPolicy,
    renewalOptions:
      rawLeaseData.renewalOptions || defaultLeaseFormValues.renewalOptions,
    tenantInfo: {
      id: "",
      email: "",
      firstName: "",
      lastName: "",
    },
    duration: {
      startDate: "",
      endDate: "",
      moveInDate: "",
    },
    coTenants: [],
    leaseDocument: [],
    internalNotes: "",
  };
}

export function transformLeaseForEdit(
  rawLeaseData: LeaseDetailData
): Partial<LeaseFormValues> {
  // When includeFormattedData is false, we get tenantId instead of tenant object
  const tenant = rawLeaseData.tenant;
  const tenantId = (rawLeaseData as any).tenantId;

  return {
    property: {
      id: rawLeaseData.property.id,
      unitId: rawLeaseData.property.unitId || "",
      address: rawLeaseData.property.address.fullAddress || "",
      propertyType: (rawLeaseData as any).metadata?.propertyType || "",
    },
    fees: {
      monthlyRent: rawLeaseData.fees.monthlyRent,
      currency: rawLeaseData.fees.currency,
      rentDueDay: rawLeaseData.fees.rentDueDay,
      securityDeposit: rawLeaseData.fees.securityDeposit,
      lateFeeAmount: rawLeaseData.fees.lateFeeAmount,
      lateFeeDays: rawLeaseData.fees.lateFeeDays,
      lateFeeType: rawLeaseData.fees.lateFeeType,
      lateFeePercentage: rawLeaseData.fees.lateFeePercentage,
      acceptedPaymentMethod: rawLeaseData.fees.acceptedPaymentMethod,
    },
    type: rawLeaseData.type,
    templateType: (rawLeaseData as any).templateType || "",
    signingMethod: rawLeaseData.signingMethod,
    utilitiesIncluded: (rawLeaseData.utilitiesIncluded || []) as any,
    petPolicy: rawLeaseData.petPolicy || defaultLeaseFormValues.petPolicy,
    renewalOptions:
      rawLeaseData.renewalOptions || defaultLeaseFormValues.renewalOptions,
    tenantInfo: tenant
      ? {
          id: tenant.id || "",
          email: tenant.email || "",
          firstName: (tenant as any).firstName || "",
          lastName: (tenant as any).lastName || "",
        }
      : tenantId
      ? {
          id: tenantId,
          email: undefined,
          firstName: undefined,
          lastName: undefined,
        }
      : defaultLeaseFormValues.tenantInfo,
    duration: {
      startDate: rawLeaseData.duration.startDate || "",
      endDate: rawLeaseData.duration.endDate || "",
      moveInDate: rawLeaseData.duration.moveInDate || "",
    },
    coTenants: rawLeaseData.coTenants || [],
    leaseDocument: [],
    internalNotes: rawLeaseData.internalNotes || "",
  };
}

/**
 * Validation result interface
 */
export interface LeaseValidationResult {
  canProceed: boolean;
  reason?: string;
  action?: "redirect" | "error";
}

/**
 * Check if a lease can be renewed
 */
export function canRenewLease(
  lease: LeaseDetailData,
  userRole: UserRole | null
): LeaseValidationResult {
  console.log("Validating lease renewal with:", {
    lease,
    userRole,
  });
  // Must be logged in
  if (!userRole) {
    return {
      canProceed: false,
      reason: "You must be logged in to renew a lease",
      action: "redirect",
    };
  }

  // Only managers and admins can create renewals
  if (
    userRole !== UserRole.MANAGER &&
    userRole !== UserRole.ADMIN &&
    lease.status !== LeaseStatusEnum.DRAFT
  ) {
    return {
      canProceed: false,
      reason: "Only managers and administrators can modify lease renewals",
      action: "error",
    };
  }

  // Lease must be active/draft_renewal to be eligible for renewal
  if (
    ![LeaseStatusEnum.ACTIVE, LeaseStatusEnum.DRAFT_RENEWAL].includes(
      lease.status as LeaseStatusEnum
    )
  ) {
    return {
      canProceed: false,
      reason: `Cannot renew a ${lease.status} lease. Only active leases can be renewed.`,
      action: "error",
    };
  }

  return { canProceed: true };
}

/**
 * Check if a lease can be edited
 */
export function canEditLease(
  lease: LeaseDetailData,
  userRole: UserRole | null
): LeaseValidationResult {
  // Must be logged in
  if (!userRole) {
    return {
      canProceed: false,
      reason: "You must be logged in to edit a lease",
      action: "redirect",
    };
  }

  // Only draft and draft_renewal leases can be edited
  const editableStatuses = [
    LeaseStatusEnum.DRAFT,
    LeaseStatusEnum.DRAFT_RENEWAL,
  ];

  if (!editableStatuses.includes(lease.status as LeaseStatusEnum)) {
    // Provide specific error messages based on status
    if (lease.status === LeaseStatusEnum.PENDING_SIGNATURE) {
      return {
        canProceed: false,
        reason:
          "Cannot edit lease that is pending signatures. Cancel the signature request first to make changes.",
        action: "error",
      };
    }

    if (lease.status === LeaseStatusEnum.ACTIVE) {
      return {
        canProceed: false,
        reason:
          "Cannot edit active lease. To make changes, you can create a lease amendment or renewal.",
        action: "error",
      };
    }

    return {
      canProceed: false,
      reason: `Cannot edit ${lease.status} lease. Only draft and draft_renewal leases can be edited.`,
      action: "error",
    };
  }

  return { canProceed: true };
}
