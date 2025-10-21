import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { IUnifiedPermissions } from "@interfaces/permission.interface";
import {
  PermissionAction,
  PermissionField,
  PermissionGate,
} from "@components/PermissionGate";

jest.mock("@hooks/useUnifiedPermissions");

const mockUseUnifiedPermissions =
  useUnifiedPermissions as jest.MockedFunction<typeof useUnifiedPermissions>;

describe("PermissionGate", () => {
  const defaultPermissions: Partial<IUnifiedPermissions> = {
    can: jest.fn(() => true),
    canAll: jest.fn(() => true),
    canAny: jest.fn(() => true),
    canEditField: jest.fn(() => true),
    isFieldDisabled: jest.fn(() => false),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUnifiedPermissions.mockReturnValue(
      defaultPermissions as IUnifiedPermissions
    );
  });

  describe("PermissionGate component", () => {
    it("should render children when single permission is granted", () => {
      const canMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      render(
        <PermissionGate permission="user.create">
          <div>Protected Content</div>
        </PermissionGate>
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
      expect(canMock).toHaveBeenCalledWith("user.create", {});
    });

    it("should render fallback when single permission is denied", () => {
      const canMock = jest.fn(() => false);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      render(
        <PermissionGate
          permission="user.create"
          fallback={<div>Access Denied</div>}
        >
          <div>Protected Content</div>
        </PermissionGate>
      );

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
      expect(screen.getByText("Access Denied")).toBeInTheDocument();
    });

    it("should render children when all permissions are granted (requireAll=true)", () => {
      const canAllMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canAll: canAllMock,
      } as IUnifiedPermissions);

      render(
        <PermissionGate
          permissions={["user.create", "user.update", "user.delete"]}
          requireAll={true}
        >
          <div>Protected Content</div>
        </PermissionGate>
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
      expect(canAllMock).toHaveBeenCalledWith(
        ["user.create", "user.update", "user.delete"],
        {}
      );
    });

    it("should render fallback when not all permissions are granted (requireAll=true)", () => {
      const canAllMock = jest.fn(() => false);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canAll: canAllMock,
      } as IUnifiedPermissions);

      render(
        <PermissionGate
          permissions={["user.create", "user.update"]}
          requireAll={true}
          fallback={<div>Insufficient Permissions</div>}
        >
          <div>Protected Content</div>
        </PermissionGate>
      );

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
      expect(screen.getByText("Insufficient Permissions")).toBeInTheDocument();
    });

    it("should render children when any permission is granted (requireAll=false)", () => {
      const canAnyMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canAny: canAnyMock,
      } as IUnifiedPermissions);

      render(
        <PermissionGate
          permissions={["user.create", "user.update"]}
          requireAll={false}
        >
          <div>Protected Content</div>
        </PermissionGate>
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
      expect(canAnyMock).toHaveBeenCalledWith(
        ["user.create", "user.update"],
        {}
      );
    });

    it("should render fallback when no permissions are granted (requireAll=false)", () => {
      const canAnyMock = jest.fn(() => false);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canAny: canAnyMock,
      } as IUnifiedPermissions);

      render(
        <PermissionGate
          permissions={["user.create", "user.update"]}
          requireAll={false}
          fallback={<div>No Permissions</div>}
        >
          <div>Protected Content</div>
        </PermissionGate>
      );

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
      expect(screen.getByText("No Permissions")).toBeInTheDocument();
    });

    it("should render children when no permissions are specified", () => {
      render(
        <PermissionGate>
          <div>Public Content</div>
        </PermissionGate>
      );

      expect(screen.getByText("Public Content")).toBeInTheDocument();
    });

    it("should pass context to permission check", () => {
      const canMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      const context = { resourceId: "123", resourceOwner: "user-456" };

      render(
        <PermissionGate permission="ticket.edit" context={context}>
          <div>Edit Ticket</div>
        </PermissionGate>
      );

      expect(canMock).toHaveBeenCalledWith("ticket.edit", context);
    });

    it("should render null fallback by default when access denied", () => {
      const canMock = jest.fn(() => false);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      const { container } = render(
        <PermissionGate permission="user.delete">
          <div>Delete User</div>
        </PermissionGate>
      );

      expect(screen.queryByText("Delete User")).not.toBeInTheDocument();
      expect(container.textContent).toBe("");
    });

    it("should handle empty permissions array", () => {
      render(
        <PermissionGate permissions={[]}>
          <div>Content</div>
        </PermissionGate>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("PermissionField component", () => {
    it("should render children in hide mode when field can be edited", () => {
      const canEditFieldMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canEditField: canEditFieldMock,
      } as IUnifiedPermissions);

      render(
        <PermissionField fieldName="email" resource="user" mode="hide">
          <input type="email" placeholder="Email" />
        </PermissionField>
      );

      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(canEditFieldMock).toHaveBeenCalledWith("user", "email", {});
    });

    it("should render fallback in hide mode when field cannot be edited", () => {
      const canEditFieldMock = jest.fn(() => false);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canEditField: canEditFieldMock,
      } as IUnifiedPermissions);

      render(
        <PermissionField
          fieldName="role"
          resource="user"
          mode="hide"
          fallback={<div>Field Hidden</div>}
        >
          <select>
            <option>Admin</option>
          </select>
        </PermissionField>
      );

      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
      expect(screen.getByText("Field Hidden")).toBeInTheDocument();
    });

    it("should render children with disabled prop in disable mode", () => {
      const isFieldDisabledMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        isFieldDisabled: isFieldDisabledMock,
      } as IUnifiedPermissions);

      render(
        <PermissionField fieldName="status" resource="ticket" mode="disable">
          {({ disabled }: { disabled: boolean }) => (
            <button disabled={disabled}>Update Status</button>
          )}
        </PermissionField>
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(isFieldDisabledMock).toHaveBeenCalledWith(
        "ticket",
        "status",
        {}
      );
    });

    it("should render children with disabled=false in disable mode when field is not disabled", () => {
      const isFieldDisabledMock = jest.fn(() => false);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        isFieldDisabled: isFieldDisabledMock,
      } as IUnifiedPermissions);

      render(
        <PermissionField fieldName="title" resource="ticket" mode="disable">
          {({ disabled }: { disabled: boolean }) => (
            <input type="text" disabled={disabled} placeholder="Title" />
          )}
        </PermissionField>
      );

      const input = screen.getByPlaceholderText("Title");
      expect(input).not.toBeDisabled();
    });

    it("should pass context to field permission check", () => {
      const canEditFieldMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canEditField: canEditFieldMock,
      } as IUnifiedPermissions);

      const context = { resourceId: "ticket-789" };

      render(
        <PermissionField
          fieldName="priority"
          resource="ticket"
          context={context}
        >
          <select>
            <option>High</option>
          </select>
        </PermissionField>
      );

      expect(canEditFieldMock).toHaveBeenCalledWith(
        "ticket",
        "priority",
        context
      );
    });

    it("should render children without resource specified", () => {
      render(
        <PermissionField fieldName="genericField">
          <div>Generic Field Content</div>
        </PermissionField>
      );

      expect(screen.getByText("Generic Field Content")).toBeInTheDocument();
    });

    it("should render non-function children in disable mode", () => {
      const isFieldDisabledMock = jest.fn(() => false);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        isFieldDisabled: isFieldDisabledMock,
      } as IUnifiedPermissions);

      render(
        <PermissionField fieldName="name" resource="user" mode="disable">
          <div>Static Content</div>
        </PermissionField>
      );

      expect(screen.getByText("Static Content")).toBeInTheDocument();
    });

    it("should default to hide mode", () => {
      const canEditFieldMock = jest.fn(() => false);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canEditField: canEditFieldMock,
      } as IUnifiedPermissions);

      render(
        <PermissionField fieldName="ssn" resource="user">
          <div>SSN Field</div>
        </PermissionField>
      );

      expect(screen.queryByText("SSN Field")).not.toBeInTheDocument();
    });

    it("should render null fallback by default in hide mode", () => {
      const canEditFieldMock = jest.fn(() => false);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canEditField: canEditFieldMock,
      } as IUnifiedPermissions);

      const { container } = render(
        <PermissionField fieldName="salary" resource="employee">
          <div>Salary</div>
        </PermissionField>
      );

      expect(container.textContent).toBe("");
    });
  });

  describe("PermissionAction component", () => {
    it("should render children when user has permission for action", () => {
      const canMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      render(
        <PermissionAction action="create" resource="user">
          <button>Create User</button>
        </PermissionAction>
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(canMock).toHaveBeenCalledWith("user.create", {
        resourceOwner: undefined,
        resourceId: undefined,
        assignedTo: undefined,
      });
    });

    it("should render fallback when user lacks permission for action", () => {
      const canMock = jest.fn(() => false);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      render(
        <PermissionAction
          action="delete"
          resource="user"
          fallback={<div>Cannot Delete</div>}
        >
          <button>Delete User</button>
        </PermissionAction>
      );

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.getByText("Cannot Delete")).toBeInTheDocument();
    });

    it("should construct permission string from resource and action", () => {
      const canMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      render(
        <PermissionAction action="edit" resource="ticket">
          <button>Edit Ticket</button>
        </PermissionAction>
      );

      expect(canMock).toHaveBeenCalledWith(
        "ticket.edit",
        expect.any(Object)
      );
    });

    it("should use action directly when resource is not provided", () => {
      const canMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      render(
        <PermissionAction action="admin.panel">
          <div>Admin Panel</div>
        </PermissionAction>
      );

      expect(canMock).toHaveBeenCalledWith("admin.panel", expect.any(Object));
    });

    it("should pass resourceId to context", () => {
      const canMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      render(
        <PermissionAction
          action="edit"
          resource="ticket"
          resourceId="ticket-123"
        >
          <button>Edit</button>
        </PermissionAction>
      );

      expect(canMock).toHaveBeenCalledWith("ticket.edit", {
        resourceOwner: undefined,
        resourceId: "ticket-123",
        assignedTo: undefined,
      });
    });

    it("should pass ownerId to context", () => {
      const canMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      render(
        <PermissionAction
          action="delete"
          resource="comment"
          ownerId="user-456"
        >
          <button>Delete Comment</button>
        </PermissionAction>
      );

      expect(canMock).toHaveBeenCalledWith("comment.delete", {
        resourceOwner: "user-456",
        resourceId: undefined,
        assignedTo: undefined,
      });
    });

    it("should pass assignedUsers to context", () => {
      const canMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      render(
        <PermissionAction
          action="view"
          resource="ticket"
          assignedUsers={["user-1", "user-2"]}
        >
          <div>View Ticket</div>
        </PermissionAction>
      );

      expect(canMock).toHaveBeenCalledWith("ticket.view", {
        resourceOwner: undefined,
        resourceId: undefined,
        assignedTo: ["user-1", "user-2"],
      });
    });

    it("should pass all context properties", () => {
      const canMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      render(
        <PermissionAction
          action="update"
          resource="ticket"
          resourceId="ticket-789"
          ownerId="user-123"
          assignedUsers={["user-456", "user-789"]}
        >
          <button>Update Ticket</button>
        </PermissionAction>
      );

      expect(canMock).toHaveBeenCalledWith("ticket.update", {
        resourceOwner: "user-123",
        resourceId: "ticket-789",
        assignedTo: ["user-456", "user-789"],
      });
    });

    it("should render null fallback by default when access denied", () => {
      const canMock = jest.fn(() => false);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        can: canMock,
      } as IUnifiedPermissions);

      const { container } = render(
        <PermissionAction action="delete" resource="user">
          <button>Delete User</button>
        </PermissionAction>
      );

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(container.textContent).toBe("");
    });
  });
});
