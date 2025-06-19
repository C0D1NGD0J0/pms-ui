import { useState } from "react";
import { UnitFormValues } from "@interfaces/unit.interface";

interface UseUnitNumberingProps {
  currentUnit: UnitFormValues | null;
  existingUnits: UnitFormValues[];
  suggestedNumber?: string;
}

export function useUnitNumbering({
  currentUnit,
  existingUnits,
  suggestedNumber,
}: UseUnitNumberingProps) {
  const [customPrefix, setCustomPrefixState] = useState("");
  const [unitNumberingScheme, setUnitNumberingScheme] =
    useState<string>("numeric");

  const setCustomPrefix = (prefix: string) => {
    const capitalizedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    setCustomPrefixState(capitalizedPrefix);
  };

  const detectNumberingPattern = (unitNumber: string): string => {
    if (!unitNumber) return "numeric";
    if (/^\d{4}$/.test(unitNumber)) return "floor";
    if (/^Suite-\d+/i.test(unitNumber)) return "suite";
    if (/^[A-Z]-\d+/.test(unitNumber)) return "alpha";
    if (/^[A-Za-z]+-\d+/.test(unitNumber)) return "custom";
    if (/^\d+$/.test(unitNumber)) return "numeric";
    return "custom";
  };

  const extractExpectedFloorFromUnitNumber = (
    unitNumber: string
  ): number | null => {
    if (!unitNumber) return null;

    // Alpha: A-1001 -> 1, B-2005 -> 2 (letter determines floor)
    const alphaMatch = unitNumber.match(/^([A-Z])-(\d+)$/);
    if (alphaMatch) {
      return alphaMatch[1].charCodeAt(0) - 64; // A=1, B=2, etc.
    }

    // 3-digit: 101 -> 1, 205 -> 2
    const threeDigitMatch = unitNumber.match(/^(\d{3})$/);
    if (threeDigitMatch) {
      return Math.floor(parseInt(threeDigitMatch[1]) / 100);
    }

    // 4-digit: 1001 -> 1, 2005 -> 2
    const fourDigitMatch = unitNumber.match(/^(\d{4})$/);
    if (fourDigitMatch) {
      return Math.floor(parseInt(fourDigitMatch[1]) / 1000);
    }

    // Suite: Suite-105 -> 1, Suite-205 -> 2
    const suiteMatch = unitNumber.match(/^Suite-(\d+)$/i);
    if (suiteMatch) {
      const number = parseInt(suiteMatch[1]);
      return number >= 100 ? Math.floor(number / 100) : null;
    }

    return null;
  };

  // Validate unit number against floor
  const validateUnitNumberFloorCorrelation = (
    unitNumber: string,
    floor: number
  ): { isValid: boolean; suggestedFloor: number | null; message: string } => {
    const expectedFloor = extractExpectedFloorFromUnitNumber(unitNumber);

    if (expectedFloor === null || expectedFloor === Number(floor)) {
      return { isValid: true, suggestedFloor: null, message: "" };
    }

    const pattern = detectNumberingPattern(unitNumber);
    const patternNames: Record<string, string> = {
      alpha: "alphabetic pattern",
      numeric: "numeric pattern",
      floor: "floor-based pattern",
      suite: "suite format",
      custom: "custom pattern",
    };

    const message = `Unit number "${unitNumber}" suggests Floor ${expectedFloor} (${
      patternNames[pattern] || "numbering pattern"
    }), but Floor ${floor} is selected.`;

    return {
      isValid: false,
      suggestedFloor: expectedFloor,
      message,
    };
  };

  // Get last number from existing units of same pattern
  const getLastNumber = (units: UnitFormValues[], pattern: string): number => {
    let filteredUnits: number[] = [];

    switch (pattern) {
      case "alpha":
        filteredUnits = units
          .filter((unit) => /^[A-Z]-\d+$/.test(unit.unitNumber))
          .map((unit) => parseInt(unit.unitNumber.split("-")[1]))
          .sort((a, b) => a - b);
        break;

      case "custom":
        const prefix = customPrefix || "Unit";
        filteredUnits = units
          .filter((unit) => unit.unitNumber.startsWith(`${prefix}-`))
          .map((unit) => parseInt(unit.unitNumber.split("-")[1]) || 0)
          .sort((a, b) => a - b);
        break;

      case "suite":
        filteredUnits = units
          .filter((unit) => /^Suite-\d+/i.test(unit.unitNumber))
          .map((unit) => parseInt(unit.unitNumber.split("-")[1]) || 0)
          .sort((a, b) => a - b);
        break;

      case "floor":
        filteredUnits = units
          .filter((unit) => /^\d{4}$/.test(unit.unitNumber))
          .map((unit) => parseInt(unit.unitNumber))
          .sort((a, b) => a - b);
        break;

      case "numeric":
      default:
        filteredUnits = units
          .filter((unit) => /^\d+$/.test(unit.unitNumber))
          .map((unit) => parseInt(unit.unitNumber))
          .sort((a, b) => a - b);
        break;
    }

    return filteredUnits.length > 0
      ? filteredUnits[filteredUnits.length - 1]
      : 0;
  };

  // Generate next unit number
  const generateNextUnitNumber = (): string => {
    // Use suggested number for first unit
    if (existingUnits.length === 0) {
      if (suggestedNumber) {
        const detectedPattern = detectNumberingPattern(suggestedNumber);
        setUnitNumberingScheme(detectedPattern);
        return suggestedNumber;
      }
      return "101"; // Default first unit
    }

    const lastNumber = getLastNumber(existingUnits, unitNumberingScheme);
    const currentFloor = currentUnit?.floor || 1;

    switch (unitNumberingScheme) {
      case "alpha":
        const letter = String.fromCharCode(64 + currentFloor); // A, B, C...
        const nextAlpha =
          lastNumber > 0 ? lastNumber + 1 : currentFloor * 1000 + 1;
        return `${letter}-${nextAlpha}`;

      case "custom":
        const prefix = customPrefix || "Unit";
        const nextCustom = lastNumber + 1;
        return `${prefix}-${nextCustom.toString().padStart(3, "0")}`;

      case "suite":
        const nextSuite = lastNumber + 1;
        return `Suite-${nextSuite.toString().padStart(3, "0")}`;

      case "floor":
        const nextFloor =
          lastNumber > 0 ? lastNumber + 1 : currentFloor * 1000 + 1;
        return nextFloor.toString();

      case "numeric":
      default:
        return (lastNumber + 1).toString();
    }
  };

  const parseCustomUnit = (
    unitNumber: string
  ): { prefix: string; number: number } | null => {
    const match = unitNumber.match(/^([A-Za-z]+)-(\d+)$/);
    return match ? { prefix: match[1], number: parseInt(match[2]) } : null;
  };

  return {
    customPrefix,
    setCustomPrefix,
    parseCustomUnit,
    unitNumberingScheme,
    setUnitNumberingScheme,
    detectNumberingPattern,
    generateNextUnitNumber,
    validateUnitNumberFloorCorrelation,
  };
}
