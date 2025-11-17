import { transformLeaseForDuplication } from "@utils/leaseHelpers";
import {
  defaultLeaseFormValues,
  LeaseDetailData,
} from "@interfaces/lease.interface";

describe("transformLeaseForDuplication", () => {
  const mockLeaseData: LeaseDetailData = {
    id: "lease-1",
    luid: "lease-123",
    leaseNumber: "L-001",
    status: "active",
    property: {
      id: "prop-1",
      unitId: "unit-1",
      address: "123 Main St",
      name: "Property 1",
    },
    fees: {
      monthlyRent: 250000,
      currency: "USD",
      rentDueDay: 1,
      securityDeposit: 250000,
      lateFeeAmount: 5000,
      lateFeeDays: 5,
      lateFeeType: "fixed",
      lateFeePercentage: 0,
      acceptedPaymentMethod: ["bank_transfer", "credit_card"],
    },
    type: "fixed_term",
    templateType: "standard",
    signingMethod: "electronic",
    utilitiesIncluded: ["water", "electricity"],
    petPolicy: {
      allowed: true,
      depositRequired: 50000,
      monthlyFee: 2500,
    },
    renewalOptions: {
      autoRenew: false,
      noticePeriodDays: 30,
    },
    tenantInfo: {
      id: "tenant-1",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
    },
    duration: {
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      moveInDate: "2024-01-05",
    },
    coTenants: [
      {
        id: "cotenant-1",
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Doe",
      },
    ],
    leaseDocument: [
      {
        id: "doc-1",
        name: "lease.pdf",
        url: "https://example.com/lease.pdf",
      },
    ],
    internalNotes: "Some internal notes about this lease",
  } as any;

  it("should copy financial terms from original lease", () => {
    const result = transformLeaseForDuplication(mockLeaseData);

    expect(result.fees).toEqual({
      monthlyRent: 250000,
      currency: "USD",
      rentDueDay: 1,
      securityDeposit: 250000,
      lateFeeAmount: 5000,
      lateFeeDays: 5,
      lateFeeType: "fixed",
      lateFeePercentage: 0,
      acceptedPaymentMethod: ["bank_transfer", "credit_card"],
    });
  });

  it("should copy lease settings from original lease", () => {
    const result = transformLeaseForDuplication(mockLeaseData);

    expect(result.type).toBe("fixed_term");
    expect(result.templateType).toBe("standard");
    expect(result.signingMethod).toBe("electronic");
    expect(result.utilitiesIncluded).toEqual(["water", "electricity"]);
    expect(result.petPolicy).toEqual({
      allowed: true,
      depositRequired: 50000,
      monthlyFee: 2500,
    });
    expect(result.renewalOptions).toEqual({
      autoRenew: false,
      noticePeriodDays: 30,
    });
  });

  it("should clear property information", () => {
    const result = transformLeaseForDuplication(mockLeaseData);

    expect(result.property).toEqual({
      id: "",
      unitId: "",
      address: "",
    });
  });

  it("should clear tenant information", () => {
    const result = transformLeaseForDuplication(mockLeaseData);

    expect(result.tenantInfo).toEqual({
      id: "",
      email: "",
      firstName: "",
      lastName: "",
    });
  });

  it("should clear duration dates", () => {
    const result = transformLeaseForDuplication(mockLeaseData);

    expect(result.duration).toEqual({
      startDate: "",
      endDate: "",
      moveInDate: "",
    });
  });

  it("should clear co-tenants", () => {
    const result = transformLeaseForDuplication(mockLeaseData);

    expect(result.coTenants).toEqual([]);
  });

  it("should clear lease documents", () => {
    const result = transformLeaseForDuplication(mockLeaseData);

    expect(result.leaseDocument).toEqual([]);
  });

  it("should clear internal notes", () => {
    const result = transformLeaseForDuplication(mockLeaseData);

    expect(result.internalNotes).toBe("");
  });

  it("should handle lease with missing optional fields", () => {
    const minimalLeaseData = {
      ...mockLeaseData,
      templateType: undefined,
      utilitiesIncluded: undefined,
      petPolicy: undefined,
      renewalOptions: undefined,
    } as any;

    const result = transformLeaseForDuplication(minimalLeaseData);

    expect(result.templateType).toBe("");
    expect(result.utilitiesIncluded).toEqual([]);
    expect(result.petPolicy).toEqual(defaultLeaseFormValues.petPolicy);
    expect(result.renewalOptions).toEqual(
      defaultLeaseFormValues.renewalOptions
    );
  });

  it("should preserve all financial values in cents", () => {
    const result = transformLeaseForDuplication(mockLeaseData);

    // Ensure values remain in cents (not converted)
    expect(result.fees?.monthlyRent).toBe(250000); // $2,500.00
    expect(result.fees?.securityDeposit).toBe(250000); // $2,500.00
    expect(result.fees?.lateFeeAmount).toBe(5000); // $50.00
  });
});
