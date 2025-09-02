import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PermissionAction, PermissionField, PermissionGate } from "@components/PermissionGate";

// Mock the usePermissions hook
jest.mock("@hooks/useUnifiedPermissions", () => ({
  useUnifiedPermissions: jest.fn(),
}));

import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
const mockUseUnifiedPermissions = useUnifiedPermissions as jest.MockedFunction<typeof useUnifiedPermissions>;

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

describe("Permission Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("PermissionGate", () => {
    it("should render children when permission is granted", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        can: jest.fn().mockReturnValue(true),
        canAll: jest.fn(),
        canAny: jest.fn(),
      } as any);

      render(
        <PermissionGate permission="property:read">
          <div>Protected Content</div>
        </PermissionGate>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("should not render children when permission is denied", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        can: jest.fn().mockReturnValue(false),
        canAll: jest.fn(),
        canAny: jest.fn(),
      } as any);

      render(
        <PermissionGate permission="property:delete">
          <div>Protected Content</div>
        </PermissionGate>,
        { wrapper: createWrapper() }
      );

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("should render fallback when permission is denied", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        can: jest.fn().mockReturnValue(false),
        canAll: jest.fn(),
        canAny: jest.fn(),
      } as any);

      render(
        <PermissionGate 
          permission="property:delete"
          fallback={<div>Access Denied</div>}
        >
          <div>Protected Content</div>
        </PermissionGate>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText("Access Denied")).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("should handle multiple permissions with requireAll", () => {
      const mockCanAll = jest.fn().mockReturnValue(true);
      mockUseUnifiedPermissions.mockReturnValue({
        can: jest.fn(),
        canAll: mockCanAll,
        canAny: jest.fn(),
      } as any);

      render(
        <PermissionGate 
          permissions={["property:read", "property:update"]}
          requireAll={true}
        >
          <div>Protected Content</div>
        </PermissionGate>,
        { wrapper: createWrapper() }
      );

      expect(mockCanAll).toHaveBeenCalledWith(
        ["property:read", "property:update"],
        {}
      );
      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("should pass context to permission checks", () => {
      const mockCan = jest.fn().mockReturnValue(true);
      mockUseUnifiedPermissions.mockReturnValue({
        can: mockCan,
        canAll: jest.fn(),
        canAny: jest.fn(),
      } as any);

      const context = { resourceId: "prop123", ownerId: "user123" };

      render(
        <PermissionGate 
          permission="property:update"
          context={context}
        >
          <div>Protected Content</div>
        </PermissionGate>,
        { wrapper: createWrapper() }
      );

      expect(mockCan).toHaveBeenCalledWith("property:update", context);
    });
  });

  describe("PermissionField", () => {
    it("should render field when edit permission is granted", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        canEditField: jest.fn().mockReturnValue(true),
        isFieldDisabled: jest.fn(),
      } as any);

      render(
        <PermissionField fieldName="description" resource="property">
          <input data-testid="field-input" />
        </PermissionField>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId("field-input")).toBeInTheDocument();
    });

    it("should hide field when edit permission is denied in hide mode", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        canEditField: jest.fn().mockReturnValue(false),
        isFieldDisabled: jest.fn(),
      } as any);

      render(
        <PermissionField fieldName="price" resource="property" mode="hide">
          <input data-testid="field-input" />
        </PermissionField>,
        { wrapper: createWrapper() }
      );

      expect(screen.queryByTestId("field-input")).not.toBeInTheDocument();
    });

    it("should provide disabled state in disable mode", () => {
      const mockIsFieldDisabled = jest.fn().mockReturnValue(true);
      mockUseUnifiedPermissions.mockReturnValue({
        canEditField: jest.fn(),
        isFieldDisabled: mockIsFieldDisabled,
      } as any);

      const TestComponent = ({ disabled }: { disabled: boolean }) => (
        <input data-testid="field-input" disabled={disabled} />
      );

      render(
        <PermissionField fieldName="price" resource="property" mode="disable">
          {({ disabled }: { disabled: boolean }) => <TestComponent disabled={disabled} />}
        </PermissionField>,
        { wrapper: createWrapper() }
      );

      expect(mockIsFieldDisabled).toHaveBeenCalledWith("property", "price", {});
      expect(screen.getByTestId("field-input")).toBeDisabled();
    });

    it("should render fallback when field is hidden", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        canEditField: jest.fn().mockReturnValue(false),
        isFieldDisabled: jest.fn(),
      } as any);

      render(
        <PermissionField 
          fieldName="price" 
          resource="property" 
          mode="hide"
          fallback={<div>Field Hidden</div>}
        >
          <input data-testid="field-input" />
        </PermissionField>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText("Field Hidden")).toBeInTheDocument();
      expect(screen.queryByTestId("field-input")).not.toBeInTheDocument();
    });
  });

  describe("PermissionAction", () => {
    it("should render action when permission is granted", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        can: jest.fn().mockReturnValue(true),
      } as any);

      render(
        <PermissionAction action="create" resource="property">
          <button data-testid="action-button">Create Property</button>
        </PermissionAction>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId("action-button")).toBeInTheDocument();
    });

    it("should not render action when permission is denied", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        can: jest.fn().mockReturnValue(false),
      } as any);

      render(
        <PermissionAction action="delete" resource="property">
          <button data-testid="action-button">Delete Property</button>
        </PermissionAction>,
        { wrapper: createWrapper() }
      );

      expect(screen.queryByTestId("action-button")).not.toBeInTheDocument();
    });

    it("should use resource-specific action check when resourceId is provided", () => {
      const mockCan = jest.fn().mockReturnValue(true);
      mockUseUnifiedPermissions.mockReturnValue({
        can: mockCan,
      } as any);

      render(
        <PermissionAction 
          action="update" 
          resource="property"
          resourceId="prop123"
          ownerId="user123"
          assignedUsers={["user123", "user456"]}
        >
          <button data-testid="action-button">Update Property</button>
        </PermissionAction>,
        { wrapper: createWrapper() }
      );

      expect(mockCan).toHaveBeenCalledWith(
        "property.update",
        {
          resourceOwner: "user123",
          resourceId: "prop123",
          assignedTo: ["user123", "user456"]
        }
      );
      expect(screen.getByTestId("action-button")).toBeInTheDocument();
    });

    it("should render fallback when action is not permitted", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        can: jest.fn().mockReturnValue(false),
      } as any);

      render(
        <PermissionAction 
          action="delete" 
          resource="property"
          fallback={<div>Action Not Allowed</div>}
        >
          <button data-testid="action-button">Delete Property</button>
        </PermissionAction>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText("Action Not Allowed")).toBeInTheDocument();
      expect(screen.queryByTestId("action-button")).not.toBeInTheDocument();
    });
  });
});