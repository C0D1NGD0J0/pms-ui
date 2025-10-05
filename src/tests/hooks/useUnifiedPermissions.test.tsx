import { renderHook } from "@testing-library/react";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";

const mockCurrentUser = {
  sub: "user-123",
  uid: "user-123",
  email: "test@example.com",
  client: {
    cuid: "client-123",
    role: "admin",
  },
};

const mockUseCurrentUser = jest.fn(() => ({
  user: mockCurrentUser,
}));

jest.mock("@hooks/useCurrentUser", () => ({
  useCurrentUser: () => mockUseCurrentUser(),
}));

// Mock permission utilities
jest.mock("@utils/permissions", () => ({
  UserRole: {
    ADMIN: "ADMIN",
    MANAGER: "MANAGER",
    STAFF: "STAFF",
    TENANT: "TENANT",
    VENDOR: "VENDOR",
  },
  canPerformAction: jest.fn((role, permission) => {
    if (role === "ADMIN") return true;
    if (role === "MANAGER") {
      if (permission.includes("delete")) return false;
      return true;
    }
    if (role === "STAFF" && permission.includes("read")) return true;
    return false;
  }),
  canAccessNavigation: jest.fn(() => true),
  canAccessRoute: jest.fn(() => true),
  isResourceOwner: jest.fn(() => true),
  belongsToDepartment: jest.fn(() => false),
  hasRoleLevel: jest.fn(() => true),
  canManageRole: jest.fn(() => true),
  buildPermission: jest.fn((resource, action) => `${resource}.${action}`),
  getRoleName: jest.fn((role) => role),
  getAccessibleNavigation: jest.fn(() => ["dashboard", "properties"]),
}));

describe("useUnifiedPermissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentUser.client.role = "admin";
  });

  describe("Role Determination", () => {
    it("should correctly map admin role", () => {
      mockCurrentUser.client.role = "admin";
      const { result } = renderHook(() => useUnifiedPermissions());

      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isManager).toBe(false);
      expect(result.current.isStaff).toBe(false);
    });

    it("should correctly map manager role", () => {
      mockCurrentUser.client.role = "manager";
      const { result } = renderHook(() => useUnifiedPermissions());

      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isManager).toBe(true);
      expect(result.current.isStaff).toBe(false);
    });

    it("should correctly map staff role", () => {
      mockCurrentUser.client.role = "staff";
      const { result } = renderHook(() => useUnifiedPermissions());

      expect(result.current.isStaff).toBe(true);
      expect(result.current.isManager).toBe(false);
    });

    it("should handle tenant role", () => {
      mockCurrentUser.client.role = "tenant";
      const { result } = renderHook(() => useUnifiedPermissions());

      expect(result.current.isTenant).toBe(true);
      expect(result.current.isAdmin).toBe(false);
    });

    it("should handle vendor role", () => {
      mockCurrentUser.client.role = "vendor";
      const { result } = renderHook(() => useUnifiedPermissions());

      expect(result.current.isVendor).toBe(true);
      expect(result.current.isAdmin).toBe(false);
    });

    it("should handle alternative naming (employee -> staff)", () => {
      mockCurrentUser.client.role = "employee";
      const { result } = renderHook(() => useUnifiedPermissions());

      expect(result.current.isStaff).toBe(true);
    });
  });

  describe("Core Permission Checking", () => {
    it("should check single permission with can()", () => {
      mockCurrentUser.client.role = "admin";
      const { result } = renderHook(() => useUnifiedPermissions());

      const canCreate = result.current.can("property.create");
      expect(canCreate).toBe(true);
    });

    it("should deny permission for insufficient role", () => {
      mockCurrentUser.client.role = "staff";
      const { result } = renderHook(() => useUnifiedPermissions());

      const canDelete = result.current.can("property.delete");
      expect(canDelete).toBe(false);
    });

    it("should check multiple permissions with canAll()", () => {
      mockCurrentUser.client.role = "admin";
      const { result } = renderHook(() => useUnifiedPermissions());

      const hasAll = result.current.canAll([
        "property.create",
        "property.read",
        "property.update",
      ]);
      expect(hasAll).toBe(true);
    });

    it("should check any permission with canAny()", () => {
      mockCurrentUser.client.role = "staff";
      const { result } = renderHook(() => useUnifiedPermissions());

      const hasAny = result.current.canAny([
        "property.delete",
        "property.read",
      ]);
      expect(hasAny).toBe(true);
    });

    it("should return false for null role", () => {
      mockUseCurrentUser.mockReturnValue({ user: null });
      const { result } = renderHook(() => useUnifiedPermissions());

      expect(result.current.can("property.read")).toBe(false);
    });
  });

  describe("Convenience Role Checkers", () => {
    it("should provide role convenience checkers", () => {
      mockCurrentUser.client.role = "admin";
      const { result } = renderHook(() => useUnifiedPermissions());

      expect(typeof result.current.isAdmin).toBe("boolean");
      expect(typeof result.current.isManager).toBe("boolean");
      expect(typeof result.current.isStaff).toBe("boolean");
      expect(typeof result.current.isTenant).toBe("boolean");
      expect(typeof result.current.isVendor).toBe("boolean");
    });
  });
});
