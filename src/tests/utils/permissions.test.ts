import {
  canAccessNavigation,
  belongsToDepartment,
  canPerformAction,
  parsePermission,
  buildPermission,
  isResourceOwner,
  canAccessRoute,
  canManageRole,
  hasRoleLevel,
  getRoleName,
  UserRole,
} from "@utils/permissions";

describe("permissions", () => {
  describe("hasRoleLevel", () => {
    it("should validate role hierarchy correctly", () => {
      expect(hasRoleLevel(UserRole.ADMIN, UserRole.STAFF)).toBe(true);
      expect(hasRoleLevel(UserRole.MANAGER, UserRole.STAFF)).toBe(true);
      expect(hasRoleLevel(UserRole.STAFF, UserRole.MANAGER)).toBe(false);
      expect(hasRoleLevel(UserRole.VENDOR, UserRole.ADMIN)).toBe(false);
      expect(hasRoleLevel(UserRole.STAFF, UserRole.STAFF)).toBe(true);
    });
  });

  describe("parsePermission & buildPermission", () => {
    it("should parse and build permission strings correctly", () => {
      expect(parsePermission("dashboard")).toEqual({ action: "dashboard" });
      expect(parsePermission("property.read")).toEqual({
        resource: "property",
        action: "read",
      });
      expect(parsePermission("property.update.own")).toEqual({
        resource: "property",
        action: "update",
        scope: "own",
      });

      expect(buildPermission("property", "read")).toBe("property.read");
      expect(buildPermission("property", "update", "own")).toBe(
        "property.update.own"
      );
    });
  });

  describe("canAccessNavigation", () => {
    it("should allow admin access to all navigation items", () => {
      expect(canAccessNavigation(UserRole.ADMIN, "dashboard")).toBe(true);
      expect(canAccessNavigation(UserRole.ADMIN, "users")).toBe(true);
      expect(canAccessNavigation(UserRole.ADMIN, "settings.client")).toBe(true);
    });

    it("should restrict navigation based on role hierarchy", () => {
      expect(canAccessNavigation(UserRole.VENDOR, "dashboard")).toBe(true);
      expect(canAccessNavigation(UserRole.VENDOR, "properties")).toBe(false);
      expect(canAccessNavigation(UserRole.STAFF, "properties")).toBe(true);
      expect(canAccessNavigation(UserRole.STAFF, "users")).toBe(false);
      expect(canAccessNavigation(UserRole.MANAGER, "users")).toBe(true);
      expect(canAccessNavigation(UserRole.MANAGER, "settings.client")).toBe(
        false
      );
    });
  });

  describe("canAccessRoute", () => {
    it("should handle exact and parameterized route matches", () => {
      expect(canAccessRoute(UserRole.STAFF, "/properties")).toBe(true);
      expect(canAccessRoute(UserRole.VENDOR, "/properties")).toBe(false);
      expect(canAccessRoute(UserRole.MANAGER, "/properties/123")).toBe(true);
      expect(
        canAccessRoute(UserRole.MANAGER, "/users/client-123/tenants")
      ).toBe(true);
      expect(canAccessRoute(UserRole.STAFF, "/users/client-123/tenants")).toBe(
        false
      );
    });

    it("should allow access to unprotected routes", () => {
      expect(canAccessRoute(UserRole.VENDOR, "/unknown-route")).toBe(true);
    });
  });

  describe("canPerformAction", () => {
    it("should check resource permissions with role levels", () => {
      expect(canPerformAction(UserRole.MANAGER, "property.create")).toBe(true);
      expect(canPerformAction(UserRole.STAFF, "property.create")).toBe(false);
      expect(canPerformAction(UserRole.STAFF, "property.read")).toBe(true);
      expect(canPerformAction(UserRole.ADMIN, "user.delete")).toBe(true);
      expect(canPerformAction(UserRole.MANAGER, "user.delete")).toBe(false);
    });

    it("should handle context-based permissions", () => {
      const ownContext = { resourceOwner: "user-123", userId: "user-123" };
      const otherContext = { resourceOwner: "user-456", userId: "user-123" };

      expect(
        canPerformAction(UserRole.STAFF, "property.update.own", ownContext)
      ).toBe(true);
      expect(
        canPerformAction(UserRole.STAFF, "property.update.own", otherContext)
      ).toBe(false);
    });

    it("should return false for non-existent permissions", () => {
      expect(canPerformAction(UserRole.ADMIN, "invalid.permission")).toBe(
        false
      );
    });
  });

  describe("isResourceOwner", () => {
    it("should validate resource ownership", () => {
      expect(isResourceOwner("user-123", "user-123")).toBe(true);
      expect(isResourceOwner("user-123", "user-456")).toBe(false);
      expect(isResourceOwner(undefined, "user-123")).toBe(false);
      expect(isResourceOwner("user-123", undefined)).toBe(false);
    });
  });

  describe("belongsToDepartment", () => {
    it("should check department membership", () => {
      expect(belongsToDepartment(["IT", "HR"], ["IT"])).toBe(true);
      expect(belongsToDepartment(["IT"], ["HR"])).toBe(false);
      expect(belongsToDepartment(["IT", "Finance"], ["HR", "Finance"])).toBe(
        true
      );
      expect(belongsToDepartment(undefined, ["IT"])).toBe(false);
      expect(belongsToDepartment(["IT"], undefined)).toBe(false);
    });
  });

  describe("getRoleName", () => {
    it("should return correct role names", () => {
      expect(getRoleName(UserRole.ADMIN)).toBe("Admin");
      expect(getRoleName(UserRole.MANAGER)).toBe("Manager");
      expect(getRoleName(UserRole.STAFF)).toBe("Staff");
      expect(getRoleName(UserRole.TENANT)).toBe("Tenant");
      expect(getRoleName(UserRole.VENDOR)).toBe("Vendor");
      expect(getRoleName(999 as UserRole)).toBe("Unknown");
    });
  });

  describe("canManageRole", () => {
    it("should validate role management permissions", () => {
      expect(canManageRole(UserRole.ADMIN, UserRole.MANAGER)).toBe(true);
      expect(canManageRole(UserRole.ADMIN, UserRole.ADMIN)).toBe(true);
      expect(canManageRole(UserRole.MANAGER, UserRole.STAFF)).toBe(true);
      expect(canManageRole(UserRole.MANAGER, UserRole.ADMIN)).toBe(false);
      expect(canManageRole(UserRole.STAFF, UserRole.VENDOR)).toBe(false);
    });
  });

  describe("Role hierarchy integration", () => {
    it("should maintain consistent hierarchy across all checks", () => {
      const roles = [
        UserRole.VENDOR,
        UserRole.TENANT,
        UserRole.STAFF,
        UserRole.MANAGER,
        UserRole.ADMIN,
      ];

      // Verify numeric hierarchy
      expect(UserRole.ADMIN).toBeGreaterThan(UserRole.MANAGER);
      expect(UserRole.MANAGER).toBeGreaterThan(UserRole.STAFF);
      expect(UserRole.STAFF).toBeGreaterThan(UserRole.TENANT);
      expect(UserRole.TENANT).toBeGreaterThan(UserRole.VENDOR);

      // Verify higher roles can access lower role permissions
      for (let i = 0; i < roles.length; i++) {
        for (let j = 0; j <= i; j++) {
          expect(hasRoleLevel(roles[i], roles[j])).toBe(true);
        }
      }
    });
  });
});
