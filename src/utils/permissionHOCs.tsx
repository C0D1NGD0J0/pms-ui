import { ComponentType, ReactElement, forwardRef, ReactNode } from "react";
import { PermissionCheckOptions, usePermissions } from "@hooks/usePermissions";

export interface WithPermissionOptions {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ComponentType | (() => ReactElement | null);
  context?: PermissionCheckOptions;
}

/**
 * Higher-Order Component that wraps a component with permission checking
 */
export const withPermission = <P extends object>(
  Component: ComponentType<P>,
  options: WithPermissionOptions
) => {
  const WrappedComponent = forwardRef<unknown, P>((props, ref) => {
    const { hasPermission, hasPermissions } = usePermissions(undefined);
    const {
      permission,
      permissions,
      requireAll = false,
      fallback: Fallback = null,
      context = {},
    } = options;

    let hasAccess = false;

    if (permission) {
      hasAccess = hasPermission(permission, context);
    } else if (permissions && permissions.length > 0) {
      hasAccess = hasPermissions(permissions, { ...context, requireAll });
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
      const { isFieldDisabled } = usePermissions(undefined);

      // Extract disabled prop and rest props separately
      const { disabled: propDisabled, ...restProps } = props;
      const isDisabled = propDisabled || isFieldDisabled(fieldName, resource);

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
    const { canPerformActionOnResource, canPerformAction } =
      usePermissions(undefined);
    const { resourceId, ownerId, assignedUsers, disabled, ...restProps } =
      props;

    const hasPermission =
      resourceId && resource
        ? canPerformActionOnResource(action, resource, resourceId, {
            ownerId,
            assignedUsers,
          })
        : canPerformAction(action, resource);

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
    const { getUserRole } = usePermissions(undefined);
    const currentRole = getUserRole();

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
