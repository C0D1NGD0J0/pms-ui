import { useCallback } from "react";
import { UnitTypeManager } from "@utils/unitTypeManager";
import { PropertyTypeManager } from "@utils/propertyTypeManager";

interface UseConditionalRenderProps {
  // Unit-specific props
  unitType?: string;

  // Property-specific props
  propertyType?: string;
  maxAllowedUnits?: number;

  // Shared props
  userRole?: string;
  userPermissions?: string[];
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
  userRole,
  userPermissions,
}: UseConditionalRenderProps) => {
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
    (fieldName: string) => {
      // For now, always return true - role-based logic will be added later
      // Future: Check userRole and userPermissions against field-specific rules
      void fieldName; // Acknowledge parameter to avoid ESLint warning
      return true;
    },
    [userRole, userPermissions]
  );

  const isDisabled = useCallback(
    (fieldName: string) => {
      // For now, always return false - role-based logic will be added later
      // Future: Some roles might have fields disabled but visible
      void fieldName; // Acknowledge parameter to avoid ESLint warning
      return false;
    },
    [userRole, userPermissions]
  );

  return {
    isVisible: isFieldVisible,
    isRequired,
    getVisibleFields,
    isCategoryVisible,
    getHelpText,
    canEdit,
    isDisabled,
  };
};
