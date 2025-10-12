import { useMemo } from "react";
import { ITenantDetailInfo } from "@interfaces/user.interface";

// Mock tenant detail data generator
const generateMockTenantDetail = (
  uid: string
): ITenantDetailInfo & {
  profile: {
    uid: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    displayName: string;
    avatar: any;
    about: string;
    contact: {
      phone: string;
      email: string;
    };
    roles: string[];
    isActive: boolean;
    userType: "tenant";
  };
  properties: any[];
  documents: any[];
  status: string;
  tasks: any[];
} => {
  // Parse tenant number from uid (e.g., TEN-2023-0001 -> 1)
  const tenantNum = parseInt(uid.split("-").pop() || "1");

  const firstNames = [
    "James",
    "Sarah",
    "Michael",
    "Emily",
    "Robert",
    "Jennifer",
  ];
  const lastNames = ["Wilson", "Williams", "Chen", "Johnson", "Davis", "Lopez"];
  const firstName = firstNames[tenantNum % firstNames.length];
  const lastName = lastNames[tenantNum % lastNames.length];
  const fullName = `${firstName} ${lastName}`;

  const properties = [
    "Wellington Ave",
    "Central Park",
    "Broadway St",
    "Madison Ave",
    "Hudson St",
    "Thompson St",
  ];
  const propertyName = properties[tenantNum % properties.length];
  const unitNumber = `${Math.floor(tenantNum / 4) + 1}${String.fromCharCode(
    65 + (tenantNum % 4)
  )}`;

  const leaseStart = new Date(
    2023,
    Math.floor(tenantNum / 4),
    1 + (tenantNum % 28)
  );
  const leaseDurationMonths = [12, 12, 12, 24, 18, 12][tenantNum % 6];
  const leaseEnd = new Date(leaseStart);
  leaseEnd.setMonth(leaseEnd.getMonth() + leaseDurationMonths);

  const monthlyRent = 1500 + Math.floor(tenantNum / 2) * 250;
  console.log(
    firstName,
    lastName,
    propertyName,
    unitNumber,
    leaseStart,
    leaseEnd,
    monthlyRent
  );
  return {
    profile: {
      uid,
      firstName,
      lastName,
      fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phoneNumber: `(212) 555-${String(1000 + tenantNum).padStart(4, "0")}`,
      displayName: fullName,
      avatar: null,
      about: `Tenant at ${propertyName}, Unit ${unitNumber}. Responsible and reliable resident.`,
      contact: {
        phone: `(212) 555-${String(1000 + tenantNum).padStart(4, "0")}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      },
      roles: ["tenant"],
      isActive: true,
      userType: "tenant",
    },
    leaseInfo: {
      status: "active",
      startDate: leaseStart.toISOString(),
      endDate: leaseEnd.toISOString(),
      monthlyRent,
    },
    unit: {
      propertyName: `${propertyName}, New York`,
      unitNumber,
      address: `${26 + tenantNum} ${propertyName}, New York, NY 10001`,
    },
    maintenanceRequests: [
      {
        id: "MR-001",
        title: "Kitchen Faucet Leak",
        status: "completed",
        priority: "medium",
        createdAt: new Date(2024, 0, 15).toISOString(),
        completedAt: new Date(2024, 0, 18).toISOString(),
        description: "Leaking faucet in kitchen sink",
      },
      {
        id: "MR-002",
        title: "AC Not Cooling",
        status: "in_progress",
        priority: "high",
        createdAt: new Date(2024, 6, 1).toISOString(),
        description: "Air conditioning unit not cooling properly",
      },
    ],
    paymentHistory: [
      {
        id: "PMT-001",
        month: "January 2024",
        amount: monthlyRent,
        status: "paid",
        paidDate: new Date(2024, 0, 1).toISOString(),
        dueDate: new Date(2024, 0, 1).toISOString(),
      },
      {
        id: "PMT-002",
        month: "February 2024",
        amount: monthlyRent,
        status: "paid",
        paidDate: new Date(2024, 1, 1).toISOString(),
        dueDate: new Date(2024, 1, 1).toISOString(),
      },
      {
        id: "PMT-003",
        month: "March 2024",
        amount: monthlyRent,
        status: "paid",
        paidDate: new Date(2024, 2, 5).toISOString(),
        dueDate: new Date(2024, 2, 1).toISOString(),
      },
    ],
    rentStatus: "current",
    documents: [
      {
        id: "DOC-001",
        name: "Lease Agreement",
        type: "lease",
        uploadedAt: leaseStart.toISOString(),
        size: "2.4 MB",
      },
      {
        id: "DOC-002",
        name: "ID Verification",
        type: "identification",
        uploadedAt: leaseStart.toISOString(),
        size: "1.2 MB",
      },
    ],
    properties: [],
    status: "active",
    tasks: [],
  };
};

export const useGetTenant = (cuid: string, uid: string) => {
  const tenant = useMemo(() => {
    if (!uid || !cuid) return null;
    return generateMockTenantDetail(uid);
  }, [uid, cuid]);

  return {
    tenant,
    isLoading: false,
    error: null,
    isError: false,
    isSuccess: true,
    refetch: () => {},
  };
};
