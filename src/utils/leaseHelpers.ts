import {
  defaultLeaseFormValues,
  LeaseDetailData,
  LeaseFormValues,
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
      address: rawLeaseData.property.address,
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
