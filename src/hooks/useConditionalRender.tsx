import { useCallback } from "react";
import { UnitTypeManager } from "@utils/unitTypeManager";
import { NavigationItem } from "@utils/navigationPermissions";
import { PropertyTypeManager } from "@utils/propertyTypeManager";

import { PermissionCheckOptions, usePermissions } from "./usePermissions";

interface UseConditionalRenderProps {
  // Unit-specific props
  unitType?: string;

  // Property-specific props
  propertyType?: string;
  maxAllowedUnits?: number;
}

// Union type for categories that works for both units and properties
type UnitCategory = "specifications" | "amenities" | "utilities" | "fees";
type PropertyCategory =
  | "core"
  | "specifications"
  | "financial"
  | "amenities"
  | "documents"
  | "unit";
type Category = UnitCategory | PropertyCategory;

export const useConditionalRender = ({
  unitType,
  propertyType,
  maxAllowedUnits = 1,
}: UseConditionalRenderProps) => {
  const permissions = usePermissions();
  const isFieldVisible = useCallback(
    (fieldName: string, category?: Category) => {
      // If both unitType and propertyType are provided, prioritize unitType
      if (unitType) {
        return UnitTypeManager.isFieldVisible(
          unitType,
          fieldName,
          category as UnitCategory
        );
      }

      // If propertyType is provided, use PropertyTypeManager
      if (propertyType) {
        return PropertyTypeManager.isFieldVisible(
          propertyType,
          fieldName,
          maxAllowedUnits,
          category as string
        );
      }

      // If neither is specified, show all fields (backwards compatibility)
      return true;
    },
    [unitType, propertyType, maxAllowedUnits]
  );

  const isRequired = useCallback(
    (fieldName: string) => {
      if (unitType) {
        return UnitTypeManager.isFieldRequired(unitType, fieldName);
      }

      if (propertyType) {
        return PropertyTypeManager.isFieldRequired(propertyType, fieldName);
      }

      return false;
    },
    [unitType, propertyType]
  );

  const getVisibleFields = useCallback(
    (category: Category) => {
      if (unitType) {
        return UnitTypeManager.getVisibleFields(
          unitType,
          category as UnitCategory
        );
      }

      if (propertyType) {
        return PropertyTypeManager.getVisibleFieldsForCategory(
          propertyType,
          category as string,
          maxAllowedUnits
        );
      }

      return [];
    },
    [unitType, propertyType, maxAllowedUnits]
  );

  const isCategoryVisible = useCallback(
    (category: Category) => {
      if (unitType) {
        const fields = UnitTypeManager.getVisibleFields(
          unitType,
          category as UnitCategory
        );
        return fields.length > 0;
      }

      if (propertyType) {
        return PropertyTypeManager.isCategoryVisible(
          propertyType,
          category as string,
          maxAllowedUnits
        );
      }

      return true;
    },
    [unitType, propertyType, maxAllowedUnits]
  );

  const getHelpText = useCallback(
    (fieldName: string) => {
      if (unitType) {
        return UnitTypeManager.getFieldHelpText(unitType, fieldName);
      }

      if (propertyType) {
        return PropertyTypeManager.getHelpText(
          propertyType,
          fieldName,
          maxAllowedUnits
        );
      }

      return "";
    },
    [unitType, propertyType, maxAllowedUnits]
  );

  const canEdit = useCallback(
    (fieldName: string, resource?: string, context?: PermissionCheckOptions) => {
      return permissions.canEditField(fieldName, resource, context);
    },
    [permissions]
  );

  const isDisabled = useCallback(
    (fieldName: string, resource?: string) => {
      return permissions.isFieldDisabled(fieldName, resource);
    },
    [permissions]
  );

  const canAccessNavigation = useCallback(
    (navItem: NavigationItem) => {
      return permissions.canAccessNavigation(navItem);
    },
    [permissions]
  );

  const canAccessRoute = useCallback(
    (route: string) => {
      return permissions.canAccessRoute(route);
    },
    [permissions]
  );

  const canPerformAction = useCallback(
    (action: string, resource?: string) => {
      return permissions.canPerformAction(action, resource);
    },
    [permissions]
  );

  return {
    // Field visibility and requirements (existing functionality)
    isVisible: isFieldVisible,
    isRequired,
    getVisibleFields,
    isCategoryVisible,
    getHelpText,
    
    // Role-based access control
    canEdit,
    isDisabled,
    canAccessNavigation,
    canAccessRoute, 
    canPerformAction,
    
    // Permission utilities
    hasRole: permissions.hasRole,
    hasPermission: permissions.hasPermission,
    isAuthenticated: permissions.isAuthenticated,
    
    // Convenience flags
    isAdmin: permissions.isAdmin,
    isManager: permissions.isManager,
    isStaff: permissions.isStaff,
    isTenant: permissions.isTenant,
    isVendor: permissions.isVendor,
  };
};
