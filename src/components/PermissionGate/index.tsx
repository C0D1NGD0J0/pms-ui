import { ReactNode } from "react";
import { PermissionCheckOptions, usePermissions } from "@hooks/usePermissions";

export interface PermissionGateProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  context?: PermissionCheckOptions;
}

export const PermissionGate = ({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  context = {},
}: PermissionGateProps) => {
  const { hasPermission, hasPermissions } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission, context);
  } else if (permissions && permissions.length > 0) {
    hasAccess = hasPermissions(permissions, { ...context, requireAll });
  } else {
    // No permissions specified, allow access
    hasAccess = true;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export interface PermissionFieldProps {
  children: ReactNode;
  fieldName: string;
  resource?: string;
  context?: PermissionCheckOptions;
  mode?: "hide" | "disable";
  fallback?: ReactNode;
}

export const PermissionField = ({
  children,
  fieldName,
  resource,
  context = {},
  mode = "hide",
  fallback = null,
}: PermissionFieldProps) => {
  const { canEditField, isFieldDisabled } = usePermissions();

  if (mode === "disable") {
    const disabled = isFieldDisabled(fieldName, resource);
    if (typeof children === "function") {
      return <>{(children as any)({ disabled })}</>;
    }
    return <>{children}</>;
  }

  // Hide mode
  const canEdit = canEditField(fieldName, resource, context);
  return canEdit ? <>{children}</> : <>{fallback}</>;
};

export interface PermissionActionProps {
  children: ReactNode;
  action: string;
  resource?: string;
  resourceId?: string;
  ownerId?: string;
  assignedUsers?: string[];
  fallback?: ReactNode;
}

export const PermissionAction = ({
  children,
  action,
  resource,
  resourceId,
  ownerId,
  assignedUsers,
  fallback = null,
}: PermissionActionProps) => {
  const { canPerformActionOnResource, canPerformAction } = usePermissions();

  const hasAccess = resourceId
    ? canPerformActionOnResource(action, resource || "unknown", resourceId, {
        ownerId,
        assignedUsers,
      })
    : canPerformAction(action, resource);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
