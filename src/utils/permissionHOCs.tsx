import { ComponentType, ReactElement, forwardRef, ReactNode } from "react";
import {
  useUnifiedPermissions,
  PermissionContext,
} from "@hooks/useUnifiedPermissions";

export interface WithPermissionOptions {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ComponentType | (() => ReactElement | null);
  context?: PermissionContext;
}

/**
 * Higher-Order Component that wraps a component with permission checking
 */
export const withPermission = <P extends object>(
  Component: ComponentType<P>,
  options: WithPermissionOptions
) => {
  const WrappedComponent = forwardRef<unknown, P>((props, ref) => {
    const { can, canAll, canAny } = useUnifiedPermissions();
    const {
      permission,
      permissions,
      requireAll = false,
      fallback: Fallback = null,
      context = {},
    } = options;

    let hasAccess = false;

    if (permission) {
      hasAccess = can(permission, context);
    } else if (permissions && permissions.length > 0) {
      hasAccess = requireAll
        ? canAll(permissions, context)
        : canAny(permissions, context);
    } else {
      hasAccess = true;
    }

    if (!hasAccess) {
      return Fallback ? <Fallback /> : null;
    }

    // Use type assertion to ensure compatibility
    return <Component {...(props as any)} ref={ref} />;
  });

  WrappedComponent.displayName = `withPermission(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};

/**
 * HOC that adds permission checking to form fields
 */
export const withFieldPermission = <P extends object>(
  Component: ComponentType<P & { disabled?: boolean }>,
  fieldName: string,
  resource?: string
) => {
  const WrappedComponent = forwardRef<unknown, P & { disabled?: boolean }>(
    (props, ref) => {
      const { isFieldDisabled } = useUnifiedPermissions();

      // Extract disabled prop and rest props separately
      const { disabled: propDisabled, ...restProps } = props;
      const isDisabled =
        propDisabled ||
        (resource ? isFieldDisabled(resource, fieldName) : false);

      // Pass restProps and disabled separately to avoid type conflicts
      return (
        <Component
          {...(restProps as any)}
          disabled={isDisabled}
          ref={ref as any}
        />
      );
    }
  );

  WrappedComponent.displayName = `withFieldPermission(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};

/**
 * HOC that adds permission checking to action buttons
 */
export const withActionPermission = <P extends object>(
  Component: ComponentType<P & { disabled?: boolean }>,
  action: string,
  resource?: string
) => {
  const WrappedComponent = forwardRef<
    unknown,
    P & {
      disabled?: boolean;
      resourceId?: string;
      ownerId?: string;
      assignedUsers?: string[];
    }
  >((props, ref) => {
    const { can } = useUnifiedPermissions();
    const { resourceId, ownerId, assignedUsers, disabled, ...restProps } =
      props;

    const permission = resource ? `${resource}.${action}` : action;
    const context: PermissionContext = {
      resourceOwner: ownerId,
      resourceId,
      assignedTo: assignedUsers,
    };

    const hasPermission = can(permission, context);
    const isDisabled = disabled || !hasPermission;

    return (
      <Component
        {...(restProps as any)}
        disabled={isDisabled}
        ref={ref as any}
      />
    );
  });

  WrappedComponent.displayName = `withActionPermission(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};

/**
 * HOC for role-based component rendering
 */
export const withRole = <P extends object>(
  Component: ComponentType<P>,
  allowedRoles: string[],
  fallback?: ComponentType | (() => ReactNode)
) => {
  const WrappedComponent = forwardRef<unknown, P>((props, ref) => {
    const { getRoleTitle } = useUnifiedPermissions();
    const currentRole = getRoleTitle();

    if (!currentRole || !allowedRoles.includes(currentRole)) {
      const Fallback = fallback;
      return Fallback ? <Fallback /> : null;
    }

    return <Component {...(props as any)} ref={ref as any} />;
  });

  WrappedComponent.displayName = `withRole(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};
