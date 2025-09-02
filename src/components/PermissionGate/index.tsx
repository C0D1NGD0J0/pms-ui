import { ReactNode } from "react";
import {
  useUnifiedPermissions,
  PermissionContext,
} from "@hooks/useUnifiedPermissions";

export interface PermissionGateProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  context?: PermissionContext;
}

export const PermissionGate = ({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  context = {},
}: PermissionGateProps) => {
  const { can, canAll, canAny } = useUnifiedPermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission, context);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll
      ? canAll(permissions, context)
      : canAny(permissions, context);
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
  context?: PermissionContext;
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
  const { canEditField, isFieldDisabled } = useUnifiedPermissions();

  if (mode === "disable") {
    const disabled = resource
      ? isFieldDisabled(resource, fieldName, context)
      : false;
    if (typeof children === "function") {
      return <>{(children as any)({ disabled })}</>;
    }
    return <>{children}</>;
  }

  // Hide mode
  const canEdit = resource ? canEditField(resource, fieldName, context) : true;
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
  const { can } = useUnifiedPermissions();

  const permission = resource ? `${resource}.${action}` : action;
  const context: PermissionContext = {
    resourceOwner: ownerId,
    resourceId,
    assignedTo: assignedUsers,
  };

  const hasAccess = can(permission, context);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
