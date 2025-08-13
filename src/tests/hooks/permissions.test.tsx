import { renderHook } from "@testing-library/react";
import { usePermissions } from "@hooks/usePermissions";
import { NavigationItem, UserRole } from "@utils/navigationPermissions";

// Mock the useCurrentUser hook
jest.mock("@hooks/useCurrentUser", () => ({
  useCurrentUser: jest.fn(),
}));

import { useCurrentUser } from "@hooks/useCurrentUser";
const mockUseCurrentUser = useCurrentUser as jest.MockedFunction<typeof useCurrentUser>;

describe("usePermissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockUser = {
    sub: 'user123',
    client: { cuid: 'client123', displayName: 'Test Client', role: 'admin' },
    permissions: ['property:read', 'user:read', 'lease:read'],
    fullname: 'Test User',
    displayName: 'Test User',
    email: 'test@example.com',
    isActive: true,
    avatarUrl: '',
    preferences: {},
    clients: [],
  };

  describe("Navigation Access", () => {
    it("should allow admin to access all navigation items", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          client: { ...mockUser.client, role: "admin" },
          permissions: ["property:read", "user:read", "lease:read"],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      expect(result.current.canAccessNavigation(NavigationItem.DASHBOARD)).toBe(true);
      expect(result.current.canAccessNavigation(NavigationItem.PROPERTIES)).toBe(true);
      expect(result.current.canAccessNavigation(NavigationItem.USERS_TENANTS)).toBe(true);
      expect(result.current.canAccessNavigation(NavigationItem.USERS_ADD)).toBe(true);
    });

    it("should restrict tenant access to limited navigation items", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          client: { ...mockUser.client, role: "tenant" },
          permissions: ["viewing:read"],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      expect(result.current.canAccessNavigation(NavigationItem.DASHBOARD)).toBe(true);
      expect(result.current.canAccessNavigation(NavigationItem.ACCOUNT_SETTINGS)).toBe(true);
      expect(result.current.canAccessNavigation(NavigationItem.VIEWINGS)).toBe(true);
      
      // Tenant should NOT have access to these
      expect(result.current.canAccessNavigation(NavigationItem.PROPERTIES)).toBe(false);
      expect(result.current.canAccessNavigation(NavigationItem.USERS_TENANTS)).toBe(false);
      expect(result.current.canAccessNavigation(NavigationItem.USERS_ADD)).toBe(false);
    });

    it("should restrict vendor access to service-related items", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          client: { ...mockUser.client, role: "vendor" },
          permissions: ["service_request:read"],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      expect(result.current.canAccessNavigation(NavigationItem.DASHBOARD)).toBe(true);
      expect(result.current.canAccessNavigation(NavigationItem.SERVICE_REQUESTS)).toBe(true);
      expect(result.current.canAccessNavigation(NavigationItem.ACCOUNT_SETTINGS)).toBe(true);
      
      // Vendor should NOT have access to these
      expect(result.current.canAccessNavigation(NavigationItem.PROPERTIES)).toBe(false);
      expect(result.current.canAccessNavigation(NavigationItem.USERS_TENANTS)).toBe(false);
      expect(result.current.canAccessNavigation(NavigationItem.LEASES)).toBe(false);
    });
  });

  describe("Role Checks", () => {
    it("should correctly identify user roles", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          client: { ...mockUser.client, role: "manager" },
          permissions: [],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      expect(result.current.hasRole(UserRole.MANAGER)).toBe(true);
      expect(result.current.hasRole(UserRole.ADMIN)).toBe(false);
      expect(result.current.hasRole(UserRole.TENANT)).toBe(false);
      expect(result.current.isManager).toBe(true);
      expect(result.current.isAdmin).toBe(false);
    });
  });

  describe("Field Editing", () => {
    it("should allow admin to edit all fields", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          client: { ...mockUser.client, role: "admin" },
          permissions: [],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      expect(result.current.canEditField("property_name")).toBe(true);
      expect(result.current.canEditField("tenant_phone")).toBe(true);
      expect(result.current.canEditField("service_status")).toBe(true);
    });

    it("should restrict tenant field editing", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          client: { ...mockUser.client, role: "tenant" },
          permissions: [],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      expect(result.current.canEditField("phone")).toBe(true);
      expect(result.current.canEditField("preferences")).toBe(true);
      expect(result.current.canEditField("property_name")).toBe(false);
      expect(result.current.canEditField("rent_amount")).toBe(false);
    });

    it("should allow vendor to edit service-related fields", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          client: { ...mockUser.client, role: "vendor" },
          permissions: [],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      expect(result.current.canEditField("service_status")).toBe(true);
      expect(result.current.canEditField("completion_notes")).toBe(true);
      expect(result.current.canEditField("property_name")).toBe(false);
    });
  });

  describe("Authentication", () => {
    it("should correctly identify authenticated users", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          client: { role: "staff" },
          permissions: [],
        },
      });

      const { result } = renderHook(() => usePermissions());
      expect(result.current.isAuthenticated()).toBe(true);
    });

    it("should identify unauthenticated users", () => {
      mockUseCurrentUser.mockReturnValue({
        user: null,
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });
      expect(result.current.isAuthenticated()).toBe(false);
    });
  });
});