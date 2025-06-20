import { useCallback } from "react";
import { UnitTypeManager } from "@utils/unitTypeManager";

interface UseConditionalRenderProps {
  unitType?: string;
  userRole?: string;
  userPermissions?: string[];
}

export const useConditionalRender = ({
  unitType,
  userRole,
  userPermissions,
}: UseConditionalRenderProps) => {
  const isVisible = useCallback(
    (
      fieldName: string,
      category?: "specifications" | "amenities" | "utilities" | "fees"
    ) => {
      if (!unitType) return true; // Show all fields if no unit type specified
      return UnitTypeManager.isFieldVisible(unitType, fieldName, category);
    },
    [unitType]
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
    isVisible,
    canEdit,
    isDisabled,
  };
};
