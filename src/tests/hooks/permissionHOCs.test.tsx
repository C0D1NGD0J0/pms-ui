import React from "react";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { useAuth } from "@store/auth.store";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import {
  withPermissionCheck,
  withClientAccess,
} from "@hooks/permissionHOCs";
import { UserRole } from "@utils/permissions";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  redirect: jest.fn(),
}));

// Mock auth store
jest.mock("@store/auth.store", () => ({
  useAuth: jest.fn(),
}));

// Mock unified permissions
jest.mock("@hooks/useUnifiedPermissions", () => ({
  useUnifiedPermissions: jest.fn(),
}));

// Mock React.use for async params
jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    use: jest.fn((promise) => {
      // For testing, immediately resolve the promise
      if (promise && typeof promise.then === "function") {
        throw new Error("use() in tests should receive resolved values");
      }
      return promise;
    }),
  };
});

describe("permissionHOCs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("withPermissionCheck", () => {
    const TestButton = (props: { disabled?: boolean; label: string }) => (
      <button disabled={props.disabled}>{props.label}</button>
    );

    const mockPermissions = {
      can: jest.fn(),
      canAll: jest.fn(),
      canAny: jest.fn(),
      getRoleTitle: jest.fn(),
      hasRoleLevel: jest.fn(),
      isFieldDisabled: jest.fn(),
      canPerformAction: jest.fn(),
    };

    beforeEach(() => {
      (useUnifiedPermissions as jest.Mock).mockReturnValue(mockPermissions);
    });

    it("should render component when permission check passes", () => {
      mockPermissions.can.mockReturnValue(true);
      const WrappedButton = withPermissionCheck(TestButton, {
        permission: "property.update",
      });

      render(<WrappedButton label="Edit" />);

      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("should hide component when permission check fails with hideIfUnauthorized", () => {
      mockPermissions.can.mockReturnValue(false);
      const WrappedButton = withPermissionCheck(TestButton, {
        permission: "property.delete",
        hideIfUnauthorized: true,
      });

      const { container } = render(<WrappedButton label="Delete" />);

      expect(container.firstChild).toBeNull();
    });

    it("should disable component when permission check fails with disableIfUnauthorized", () => {
      mockPermissions.can.mockReturnValue(false);
      const WrappedButton = withPermissionCheck(TestButton, {
        permission: "property.update",
        disableIfUnauthorized: true,
      });

      render(<WrappedButton label="Edit" />);

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should check minimum role level", () => {
      mockPermissions.hasRoleLevel.mockReturnValue(true);
      const WrappedButton = withPermissionCheck(TestButton, {
        minRole: UserRole.MANAGER,
      });

      render(<WrappedButton label="Manager Action" />);

      expect(mockPermissions.hasRoleLevel).toHaveBeenCalledWith(
        UserRole.MANAGER
      );
      expect(screen.getByText("Manager Action")).toBeInTheDocument();
    });

    it("should check field-level permissions", () => {
      mockPermissions.isFieldDisabled.mockReturnValue(true);
      const WrappedButton = withPermissionCheck(TestButton, {
        field: "email",
        resource: "user",
      });

      render(<WrappedButton label="Email Field" />);

      expect(mockPermissions.isFieldDisabled).toHaveBeenCalledWith(
        "email",
        "user"
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should check action-level permissions", () => {
      mockPermissions.canPerformAction.mockReturnValue(true);
      const WrappedButton = withPermissionCheck(TestButton, {
        action: "delete",
        resource: "property",
      });

      render(<WrappedButton label="Delete" />);

      expect(mockPermissions.canPerformAction).toHaveBeenCalledWith(
        "delete",
        "property"
      );
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("should render fallback component when unauthorized", () => {
      mockPermissions.can.mockReturnValue(false);
      const Fallback = () => <div>Access Denied</div>;
      const WrappedButton = withPermissionCheck(TestButton, {
        permission: "admin.access",
        fallback: Fallback,
      });

      render(<WrappedButton label="Admin Panel" />);

      expect(screen.getByText("Access Denied")).toBeInTheDocument();
      expect(screen.queryByText("Admin Panel")).not.toBeInTheDocument();
    });

    it("should check multiple permissions with canAll", () => {
      mockPermissions.canAll.mockReturnValue(true);
      const WrappedButton = withPermissionCheck(TestButton, {
        permissions: {
          canAll: ["property.read", "property.update"],
        },
      });

      render(<WrappedButton label="Edit Property" />);

      expect(mockPermissions.canAll).toHaveBeenCalledWith([
        "property.read",
        "property.update",
      ]);
    });

    it("should check multiple permissions with canAny", () => {
      mockPermissions.canAny.mockReturnValue(true);
      const WrappedButton = withPermissionCheck(TestButton, {
        permissions: {
          canAny: ["property.read", "property.update"],
        },
      });

      render(<WrappedButton label="View or Edit" />);

      expect(mockPermissions.canAny).toHaveBeenCalledWith([
        "property.read",
        "property.update",
      ]);
    });
  });

  describe("withClientAccess", () => {
    const TestPage = (props: {
      params: Promise<{ cuid: string }>;
      children?: React.ReactNode;
    }) => <div data-testid="page-content">Page Content</div>;

    const mockAuth = useAuth as jest.Mock;
    const mockRedirect = redirect as jest.Mock;
    const mockReactUse = React.use as jest.Mock;

    beforeEach(() => {
      mockRedirect.mockImplementation(() => {
        throw new Error("REDIRECT"); // Simulate redirect behavior
      });
    });

    it("should render component when user belongs to client", () => {
      mockAuth.mockReturnValue({
        client: { cuid: "client-123" },
      });
      mockReactUse.mockReturnValue({ cuid: "client-123" });

      const WrappedPage = withClientAccess(TestPage);
      const params = Promise.resolve({ cuid: "client-123" });

      render(<WrappedPage params={params} />);

      expect(screen.getByTestId("page-content")).toBeInTheDocument();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("should redirect when user does not belong to client", () => {
      mockAuth.mockReturnValue({
        client: { cuid: "client-123" },
      });
      mockReactUse.mockReturnValue({ cuid: "client-456" });

      const WrappedPage = withClientAccess(TestPage);
      const params = Promise.resolve({ cuid: "client-456" });

      expect(() => {
        render(<WrappedPage params={params} />);
      }).toThrow("REDIRECT");

      expect(mockRedirect).toHaveBeenCalledWith("/dashboard");
    });

    it("should redirect to custom path when specified", () => {
      mockAuth.mockReturnValue({
        client: { cuid: "client-123" },
      });
      mockReactUse.mockReturnValue({ cuid: "client-456" });

      const WrappedPage = withClientAccess(TestPage, {
        redirectTo: "/unauthorized",
      });
      const params = Promise.resolve({ cuid: "client-456" });

      expect(() => {
        render(<WrappedPage params={params} />);
      }).toThrow("REDIRECT");

      expect(mockRedirect).toHaveBeenCalledWith("/unauthorized");
    });

    it("should redirect when client is missing", () => {
      mockAuth.mockReturnValue({
        client: null,
      });
      mockReactUse.mockReturnValue({ cuid: "client-456" });

      const WrappedPage = withClientAccess(TestPage);
      const params = Promise.resolve({ cuid: "client-456" });

      expect(() => {
        render(<WrappedPage params={params} />);
      }).toThrow("REDIRECT");

      expect(mockRedirect).toHaveBeenCalledWith("/dashboard");
    });

    it("should log warning on unauthorized access attempt", () => {
      const consoleWarnSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      mockAuth.mockReturnValue({
        client: { cuid: "client-123" },
      });
      mockReactUse.mockReturnValue({ cuid: "client-456" });

      const WrappedPage = withClientAccess(TestPage);
      const params = Promise.resolve({ cuid: "client-456" });

      expect(() => {
        render(<WrappedPage params={params} />);
      }).toThrow("REDIRECT");

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Unauthorized access attempt")
      );

      consoleWarnSpy.mockRestore();
    });
  });
});
