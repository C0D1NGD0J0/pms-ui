import { PropertyTypeRule } from "@interfaces/property.interface";

import { propertyTypeRules } from "./constants";

export class PropertyTypeManager {
  /**
   * Determines if a field should be visible based on property type and other factors
   *
   * @param propertyType The type of property (e.g., 'house', 'apartment')
   * @param fieldName The name of the field to check visibility for
   * @param totalUnits The number of units in the property
   * @param category Optional category to check (core, specifications, financial, amenities, documents)
   * @returns Boolean indicating if the field should be visible
   */
  static isFieldVisible(
    propertyType: string,
    fieldName: string,
    totalUnits: number,
    category?: string
  ): boolean {
    const rules = propertyTypeRules[propertyType] || propertyTypeRules.house;
    const allVisibleFields = [
      ...rules.visibleFields.core,
      ...rules.visibleFields.specifications,
      ...rules.visibleFields.financial,
      ...rules.visibleFields.amenities,
      ...rules.visibleFields.documents,
    ];

    if (
      category &&
      rules.visibleFields[category as keyof typeof rules.visibleFields]
    ) {
      const categoryFields =
        rules.visibleFields[category as keyof typeof rules.visibleFields];
      if (!categoryFields.includes(fieldName)) {
        return false;
      }
    } else {
      if (!allVisibleFields.includes(fieldName)) {
        return false;
      }
    }

    // for multi-unit properties or properties with multiple units,
    // hide unit-level fields (they should be managed per unit)
    if (
      (rules.isMultiUnit || totalUnits > 1) &&
      rules.visibleFields.unit.includes(fieldName)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Gets all visible fields for a specific category
   *
   * @param propertyType The type of property
   * @param category The category of fields (core, specifications, financial, amenities, documents, unit)
   * @param totalUnits The number of units in the property
   * @returns Array of visible field names for the category
   */
  static getVisibleFieldsForCategory(
    propertyType: string,
    category: string,
    totalUnits: number
  ): string[] {
    const rules = propertyTypeRules[propertyType] || propertyTypeRules.house;

    if (!rules.visibleFields[category as keyof typeof rules.visibleFields]) {
      return [];
    }

    const categoryFields =
      rules.visibleFields[category as keyof typeof rules.visibleFields];

    // for unit-level fields, only show them if it's not a multi-unit property
    if (category === "unit") {
      return rules.isMultiUnit || totalUnits > 1 ? [] : categoryFields;
    }

    return categoryFields;
  }

  /**
   * Determines if a specific category should be visible
   *
   * @param propertyType The type of property
   * @param category The category to check
   * @param totalUnits The number of units in the property
   * @returns Boolean indicating if the category should be visible
   */
  static isCategoryVisible(
    propertyType: string,
    category: string,
    totalUnits: number
  ): boolean {
    const visibleFields = this.getVisibleFieldsForCategory(
      propertyType,
      category,
      totalUnits
    );
    return visibleFields.length > 0;
  }

  /**
   * Gets context-specific help text for a field based on property type
   *
   * @param propertyType The type of property
   * @param fieldName The field to get help text for
   * @param totalUnits The number of units in the property
   * @returns Help text string
   */
  static getHelpText(
    propertyType: string,
    fieldName: string,
    totalUnits: number
  ): string {
    const rules = propertyTypeRules[propertyType] || propertyTypeRules.house;

    // return specific help text if defined
    if (rules.helpText && rules.helpText[fieldName]) {
      return rules.helpText[fieldName];
    }

    // generate dynamic help text based on rules
    if (fieldName === "totalUnits") {
      if (rules.isMultiUnit) {
        return `For ${propertyType} properties, each unit's details will be managed separately`;
      } else if (totalUnits > 1) {
        return `When a ${propertyType} has multiple units, details should be specified per unit`;
      } else {
        return `For single-family ${propertyType}s, this is typically 1`;
      }
    }

    return "";
  }

  /**
   * Determines if a field is required based on property type rules
   *
   * @param propertyType The type of property
   * @param fieldName The field to check if required
   * @returns Boolean indicating if the field is required
   */
  static isFieldRequired(propertyType: string, fieldName: string): boolean {
    const rules = propertyTypeRules[propertyType] || propertyTypeRules.house;
    return rules.requiredFields?.includes(fieldName) || false;
  }

  /**
   * Gets the rule object for a specific property type
   *
   * @param propertyType The type of property
   * @returns The rule object for the property type
   */
  static getRules(propertyType: string): PropertyTypeRule {
    return propertyTypeRules[propertyType] || propertyTypeRules.house;
  }

  /**
   * Determines if a property type supports multiple units
   *
   * @param propertyType The type of property
   * @returns Boolean indicating if the property type supports multiple units
   */
  static supportsMultipleUnits(propertyType: string): boolean {
    const rules = propertyTypeRules[propertyType] || propertyTypeRules.house;
    return rules.isMultiUnit;
  }

  /**
   * Determines if a property should validate bedroom/bathroom at property level
   *
   * @param propertyType The type of property
   * @param totalUnits The number of units in the property
   * @returns Boolean indicating if bedroom/bathroom fields should be validated
   */
  static shouldValidateBedBath(
    propertyType: string,
    totalUnits: number
  ): boolean {
    const rules = propertyTypeRules[propertyType] || propertyTypeRules.house;

    // Don't validate bed/bath at property level for:
    // 1. Multi-unit property types (like apartments)
    // 2. Single-family homes that have been converted to multiple units
    if ((rules.isMultiUnit || totalUnits > 1) && !rules.validateBedBath) {
      return false;
    }

    return true;
  }

  /**
   * Gets all required fields for a property type
   *
   * @param propertyType The type of property
   * @returns Array of required field names
   */
  static getRequiredFields(propertyType: string): string[] {
    const rules = propertyTypeRules[propertyType] || propertyTypeRules.house;
    return rules.requiredFields || [];
  }

  /**
   * Gets the default number of units for a property type
   *
   * @param propertyType The type of property
   * @returns Default number of units
   */
  static getDefaultUnits(propertyType: string): number {
    const rules = propertyTypeRules[propertyType] || propertyTypeRules.house;
    return rules.defaultUnits;
  }

  /**
   * Gets the minimum number of units for a property type
   *
   * @param propertyType The type of property
   * @returns Minimum number of units
   */
  static getMinUnits(propertyType: string): number {
    const rules = propertyTypeRules[propertyType] || propertyTypeRules.house;
    return rules.minUnits;
  }

  /**
   * Gets the allowed unit types for a property type
   *
   * @param propertyType The type of property
   * @returns Array of allowed unit type strings
   */
  static getAllowedUnitTypes(propertyType: string): string[] {
    const rules = propertyTypeRules[propertyType] || propertyTypeRules.house;
    return rules.allowedUnitTypes || ["residential"];
  }

  /**
   * Filters unit types based on what's allowed for a property type
   *
   * @param propertyType The type of property
   * @param availableUnitTypes Array of all available unit types
   * @returns Array of unit types filtered for this property type
   */
  static getFilteredUnitTypes(
    propertyType: string,
    availableUnitTypes: Array<{ value: string; label: string }>
  ): Array<{ value: string; label: string }> {
    const allowedTypes = this.getAllowedUnitTypes(propertyType);
    return availableUnitTypes.filter((unitType) =>
      allowedTypes.includes(unitType.value)
    );
  }
}
