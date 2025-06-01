import { UnitTypeRule, UnitType } from "@interfaces/unit.interface";

import { unitTypeRules, unitFeatures } from "./constants";

/**
 * UnitTypeManager - Manages unit type rules and field visibility
 * Similar pattern to PropertyTypeManager but for individual units
 */
export class UnitTypeManager {
  /**
   * Determines if a field should be visible based on unit type rules
   *
   * @param unitType The type of unit
   * @param fieldName The name of the field to check
   * @param category The category of the field (specifications, amenities, utilities, fees)
   * @returns Whether the field should be visible
   */
  static isFieldVisible(
    unitType: UnitType | string,
    fieldName: string,
    category?: "specifications" | "amenities" | "utilities" | "fees"
  ): boolean {
    const rules =
      unitTypeRules[unitType as UnitType] || unitTypeRules.residential;

    const allVisibleFields = [
      ...rules.visibleFields.specifications,
      ...rules.visibleFields.amenities,
      ...rules.visibleFields.utilities,
      ...rules.visibleFields.fees,
    ];

    // Check if field is in general visible fields
    if (allVisibleFields.includes(fieldName)) {
      return true;
    }

    // Check specific category if provided
    if (
      category &&
      rules.visibleFields[category as keyof typeof rules.visibleFields]
    ) {
      const categoryFields =
        rules.visibleFields[category as keyof typeof rules.visibleFields];
      return categoryFields.includes(fieldName);
    }

    return false;
  }

  /**
   * Gets all visible fields for a specific category and unit type
   *
   * @param unitType The type of unit
   * @param category The category to get fields for
   * @returns Array of visible field names for the category
   */
  static getVisibleFields(
    unitType: UnitType | string,
    category: "specifications" | "amenities" | "utilities" | "fees"
  ): string[] {
    const rules =
      unitTypeRules[unitType as UnitType] || unitTypeRules.residential;

    if (!rules.visibleFields[category as keyof typeof rules.visibleFields]) {
      return [];
    }

    const categoryFields =
      rules.visibleFields[category as keyof typeof rules.visibleFields];

    return categoryFields;
  }

  /**
   * Gets help text for a specific field and unit type
   *
   * @param unitType The type of unit
   * @param fieldName The field to get help text for
   * @returns Help text string or empty string if none exists
   */
  static getFieldHelpText(
    unitType: UnitType | string,
    fieldName: string
  ): string {
    const rules =
      unitTypeRules[unitType as UnitType] || unitTypeRules.residential;

    // Return specific help text if defined
    if (rules.helpText && rules.helpText[fieldName]) {
      return rules.helpText[fieldName];
    }

    // Generate dynamic help text based on unit type
    if (fieldName === "totalArea") {
      switch (unitType) {
        case "storage":
          return "Total storage area in square feet";
        case "commercial":
          return "Total floor area of this commercial space";
        case "residential":
          return "Total living area of this residential unit";
        default:
          return "Total area of this unit in square feet";
      }
    }

    if (fieldName === "bathrooms" && unitType === "storage") {
      return ""; // No help text for bathrooms in storage units (field should be hidden)
    }

    return "";
  }

  /**
   * Determines if a field is required based on unit type rules
   *
   * @param unitType The type of unit
   * @param fieldName The field to check
   * @returns Whether the field is required
   */
  static isFieldRequired(
    unitType: UnitType | string,
    fieldName: string
  ): boolean {
    const rules =
      unitTypeRules[unitType as UnitType] || unitTypeRules.residential;
    return rules.requiredFields?.includes(fieldName) || false;
  }

  /**
   * Gets the rule object for a specific unit type
   *
   * @param unitType The type of unit
   * @returns The rule object for the unit type
   */
  static getRules(unitType: UnitType | string): UnitTypeRule {
    return unitTypeRules[unitType as UnitType] || unitTypeRules.residential;
  }

  /**
   * Gets all required fields for a unit type
   *
   * @param unitType The type of unit
   * @returns Array of required field names
   */
  static getRequiredFields(unitType: UnitType | string): string[] {
    const rules =
      unitTypeRules[unitType as UnitType] || unitTypeRules.residential;
    return rules.requiredFields || [];
  }

  /**
   * Validates that a unit has all required fields for its type
   *
   * @param unitType The type of unit
   * @param unitData The unit data to validate
   * @returns Object with isValid boolean and missing fields array
   */
  static validateRequiredFields(
    unitType: UnitType | string,
    unitData: any
  ): { isValid: boolean; missingFields: string[] } {
    const requiredFields = this.getRequiredFields(unitType);
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      if (field.includes(".")) {
        // Handle nested fields like "specifications.totalArea"
        const [parent, child] = field.split(".");
        const parentObj = unitData[parent];
        if (
          !parentObj ||
          parentObj[child] === undefined ||
          parentObj[child] === 0 ||
          parentObj[child] === ""
        ) {
          missingFields.push(field);
        }
      } else {
        // Handle top-level fields
        const value = unitData[field];
        if (value === undefined || value === "" || value === 0) {
          missingFields.push(field);
        }
      }
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Gets field visibility for specifications category specifically
   * Useful for hiding bathrooms in storage units
   *
   * @param unitType The type of unit
   * @returns Object with boolean flags for each specification field
   */
  static getSpecificationVisibility(unitType: UnitType | string) {
    const visibleFields = this.getVisibleFields(unitType, "specifications");

    return {
      totalArea: visibleFields.includes("totalArea"),
      rooms: visibleFields.includes("rooms"),
      bathrooms: visibleFields.includes("bathrooms"),
      maxOccupants: visibleFields.includes("maxOccupants"),
    };
  }

  /**
   * Gets the unit features that should be visible for a specific unit type
   * Filters the unitFeatures array based on the unit type's visible amenities
   *
   * @param unitType The type of unit
   * @returns Array of unit features that should be visible for this unit type
   */
  static getVisibleUnitFeatures(unitType: UnitType | string) {
    const visibleAmenities = this.getVisibleFields(unitType, "amenities");

    return unitFeatures.filter((feature) =>
      visibleAmenities.includes(feature.amenityKey)
    );
  }
}
