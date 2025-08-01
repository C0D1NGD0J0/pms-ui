export interface MockInvitationData {
  token: string;
  inviteeEmail: string;
  inviterName: string;
  organizationName: string;
  role: string;
  roleName: string;
  startDate?: string;
  personalMessage?: string;
  status: "pending" | "expired" | "invalid" | "accepted";
}

export interface MockRolePermissions {
  [key: string]: string[];
}

export const mockInvitationData: MockInvitationData = {
  token: "abc123",
  inviteeEmail: "john.doe@example.com",
  inviterName: "Sarah Johnson",
  organizationName: "Property Management Co.",
  role: "staff",
  roleName: "Staff Member",
  startDate: "2025-01-15",
  personalMessage:
    "Welcome to our team! We're excited to have you join us as a staff member.",
  status: "pending", // Change this to test different states
};

export const mockRolePermissions: MockRolePermissions = {
  admin: [
    "Full system access and configuration",
    "User management and invitations",
    "Financial reporting and analytics",
    "System settings and customization",
  ],
  manager: [
    "Property management and oversight",
    "Tenant and lease management",
    "Maintenance request handling",
    "Team coordination and reporting",
  ],
  staff: [
    "Task management and completion",
    "Basic property access",
    "Communication with tenants",
    "Status reporting and updates",
  ],
  vendor: [
    "Work order management",
    "Service request handling",
    "Invoice and payment processing",
    "Communication with property managers",
  ],
  tenant: [
    "Lease and payment management",
    "Maintenance request submission",
    "Communication with management",
    "Property amenities access",
  ],
};

// Mock different invitation states for testing
export const mockInvitationStates = {
  loading: { ...mockInvitationData, status: "pending" as const },
  valid: { ...mockInvitationData, status: "pending" as const },
  expired: { ...mockInvitationData, status: "expired" as const },
  invalid: { ...mockInvitationData, status: "invalid" as const },
  accepted: { ...mockInvitationData, status: "accepted" as const },
};
