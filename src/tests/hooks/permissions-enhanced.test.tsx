import { ReactNode } from "react";
import { renderHook, act } from "@testing-library/react";
// import { NavigationItem, UserRole } from "@utils/navigationPermissions";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createPermissionString, parsePermissionString, usePermissions } from "@hooks/usePermissions";

// Mock the useCurrentUser hook
jest.mock("@hooks/useCurrentUser", () => ({
  useCurrentUser: jest.fn(),
}));

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
  },
});

import { useCurrentUser } from "@hooks/useCurrentUser";
const mockUseCurrentUser = useCurrentUser as jest.MockedFunction<typeof useCurrentUser>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

describe("usePermissions - Enhanced Features", () => {
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

  describe("Scoped Permissions", () => {
    it("should handle scoped permission strings correctly", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['property:create:any', 'property:read:mine', 'user:update:assigned'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      // Test scoped permissions
      expect(result.current.hasPermission('property:create:any')).toBe(true);
      expect(result.current.hasPermission('property:read:mine')).toBe(true);
      expect(result.current.hasPermission('user:update:assigned')).toBe(true);
      expect(result.current.hasPermission('property:delete:any')).toBe(false);
    });

    it("should validate resource ownership for 'mine' scope", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['property:update:mine'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      // User owns the resource
      expect(result.current.hasPermission('property:update:mine', {
        ownerId: 'user123', // Same as mockUser.sub
      })).toBe(true);

      // User doesn't own the resource
      expect(result.current.hasPermission('property:update:mine', {
        ownerId: 'other-user',
      })).toBe(false);
    });

    it("should validate assignment for 'assigned' scope", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['property:read:assigned'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      // User is assigned to resource
      expect(result.current.hasPermission('property:read:assigned', {
        assignedUsers: ['user123', 'other-user'],
      })).toBe(true);

      // User is not assigned to resource
      expect(result.current.hasPermission('property:read:assigned', {
        assignedUsers: ['other-user'],
      })).toBe(false);
    });
  });

  describe("Enhanced Action Permissions", () => {
    it("should check resource-specific action permissions", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['property:create:any', 'property:update:mine'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      // Can create any property
      expect(result.current.canPerformActionOnResource(
        'create', 'property', 'prop123'
      )).toBe(true);

      // Can update own property
      expect(result.current.canPerformActionOnResource(
        'update', 'property', 'prop123', 'user123'
      )).toBe(true);

      // Cannot update other's property
      expect(result.current.canPerformActionOnResource(
        'update', 'property', 'prop123', 'other-user'
      )).toBe(false);

      // Cannot delete (no permission)
      expect(result.current.canPerformActionOnResource(
        'delete', 'property', 'prop123'
      )).toBe(false);
    });

    it("should handle batch permission checks", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['property:read', 'user:create', 'lease:read'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      const permissions = [
        { permission: 'property:read' },
        { permission: 'user:create' },
        { permission: 'property:delete' },
        { permission: 'lease:read' },
      ];

      const results = result.current.checkMultiplePermissions(permissions);

      expect(results).toEqual({
        'property:read': true,
        'user:create': true,
        'property:delete': false,
        'lease:read': true,
      });
    });
  });

  describe("Performance & Caching", () => {
    it("should cache permission results", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['property:read'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      // First call
      const result1 = result.current.hasPermission('property:read');
      const metrics1 = result.current.getPerformanceMetrics();

      // Second call (should hit cache)
      const result2 = result.current.hasPermission('property:read');
      const metrics2 = result.current.getPerformanceMetrics();

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(metrics2.cacheHits).toBeGreaterThan(metrics1.cacheHits);
    });

    it("should clear permission cache", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['property:read'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      // Make some permission checks to populate cache
      result.current.hasPermission('property:read');
      result.current.hasPermission('user:create');

      const metricsBeforeClear = result.current.getPerformanceMetrics();
      expect(metricsBeforeClear.cacheSize).toBeGreaterThan(0);

      // Clear cache
      act(() => {
        result.current.clearPermissionCache();
      });

      const metricsAfterClear = result.current.getPerformanceMetrics();
      expect(metricsAfterClear.cacheSize).toBe(0);
      expect(metricsAfterClear.totalChecks).toBe(0);
    });

    it("should invalidate specific permissions", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['property:read', 'user:create'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      // Populate cache
      result.current.hasPermission('property:read');
      result.current.hasPermission('user:create');
      
      const sizeBefore = result.current.getPerformanceMetrics().cacheSize;
      
      // Invalidate specific permission
      act(() => {
        result.current.invalidatePermission('property:read');
      });
      
      const sizeAfter = result.current.getPerformanceMetrics().cacheSize;
      expect(sizeAfter).toBeLessThan(sizeBefore);
    });

    it("should prefetch permissions", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['property:read', 'user:create', 'lease:read'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      const permissionsToPrefetch = ['property:read', 'user:create', 'lease:read'];
      
      act(() => {
        result.current.prefetchPermissions(permissionsToPrefetch);
      });

      const metrics = result.current.getPerformanceMetrics();
      expect(metrics.totalChecks).toBe(permissionsToPrefetch.length);
      expect(metrics.cacheSize).toBe(permissionsToPrefetch.length);
    });
  });

  describe("Audit Logging", () => {
    it("should log permission checks", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['property:read'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      // Make some permission checks
      result.current.hasPermission('property:read');
      result.current.hasPermission('property:delete'); // Should fail

      const auditLog = result.current.getAuditLog();
      expect(auditLog.length).toBeGreaterThan(0);
      
      const successLog = auditLog.find(log => log.permission.includes('property:read'));
      const failLog = auditLog.find(log => log.permission.includes('property:delete'));
      
      expect(successLog?.result).toBe(true);
      expect(failLog?.result).toBe(false);
      expect(successLog?.userId).toBe('user123');
    });

    it("should limit audit log size", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['property:read'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      const auditLog = result.current.getAuditLog(50);
      expect(auditLog.length).toBeLessThanOrEqual(50);
    });
  });

  describe("Enhanced Field Permissions", () => {
    it("should check field permissions with resource context", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          client: { ...mockUser.client, role: 'staff' },
          permissions: ['property:update'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      // Staff should be able to edit basic fields but not sensitive ones
      expect(result.current.canEditField('description', 'property')).toBe(true);
      expect(result.current.canEditField('price', 'property')).toBe(false); // Restricted for staff
    });

    it("should handle different scopes for field editing", () => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['property:update:mine'],
        },
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      // Can edit own property fields
      expect(result.current.canEditField('description', 'property', {
        ownerId: 'user123',
      })).toBe(true);

      // Cannot edit other's property fields
      expect(result.current.canEditField('description', 'property', {
        ownerId: 'other-user',
      })).toBe(false);
    });
  });

  describe("Utility Functions", () => {
    it("should create permission strings correctly", () => {
      expect(createPermissionString('property', 'read')).toBe('property:read:any');
      expect(createPermissionString('user', 'create', 'mine')).toBe('user:create:mine');
      expect(createPermissionString('lease', 'update', 'assigned')).toBe('lease:update:assigned');
    });

    it("should parse permission strings correctly", () => {
      const parsed1 = parsePermissionString('property:read:any');
      expect(parsed1).toEqual({
        resource: 'property',
        action: 'read',
        scope: 'any',
      });

      const parsed2 = parsePermissionString('user:create');
      expect(parsed2).toEqual({
        resource: 'user',
        action: 'create',
        scope: 'any',
      });

      const parsed3 = parsePermissionString('invalid');
      expect(parsed3).toBeNull();
    });
  });

  describe("Error Handling", () => {
    it("should handle fallback values for failed permission checks", () => {
      mockUseCurrentUser.mockReturnValue({
        user: null,
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      // Should return fallback value when no user
      expect(result.current.hasPermission('property:read', { fallback: true })).toBe(true);
      expect(result.current.hasPermission('property:read', { fallback: false })).toBe(false);
      expect(result.current.hasPermission('property:read')).toBe(false); // Default fallback
    });

    it("should handle loading states", () => {
      mockUseCurrentUser.mockReturnValue({
        user: null,
        isLoading: true,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated()).toBe(false);
    });
  });

  describe("Permission Context", () => {
    it("should provide permission context for debugging", () => {
      mockUseCurrentUser.mockReturnValue({
        user: mockUser,
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      const context = result.current.permissionContext;
      expect(context).toEqual({
        userId: 'user123',
        clientId: 'client123',
      });
    });

    it("should return null context when no user", () => {
      mockUseCurrentUser.mockReturnValue({
        user: null,
        isLoading: false,
      });

      const { result } = renderHook(() => usePermissions(), { wrapper: createWrapper() });

      const context = result.current.permissionContext;
      expect(context).toBeNull();
    });
  });
});