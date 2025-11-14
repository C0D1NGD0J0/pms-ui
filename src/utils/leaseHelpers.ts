import {
  LeaseDetailData,
  LeaseFormValues,
  defaultLeaseFormValues,
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
    templateType: rawLeaseData.templateType || "",
    signingMethod: rawLeaseData.signingMethod,
    utilitiesIncluded: rawLeaseData.utilitiesIncluded || [],
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
