import { z } from "zod";
import { unitSchema } from "@validations/unit.validations";

export const UnitTypeEnum = {
  RESIDENTIAL: "residential",
  COMMERCIAL: "commercial",
  MIXED_USE: "mixed_use",
  STORAGE: "storage",
  OTHER: "other",
} as const;

export const UnitStatusEnum = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  RESERVED: "reserved",
  MAINTENANCE: "maintenance",
  INACTIVE: "inactive",
} as const;

export type UnitType = (typeof UnitTypeEnum)[keyof typeof UnitTypeEnum];
export type UnitStatus = (typeof UnitStatusEnum)[keyof typeof UnitStatusEnum];
export type UnitFormValues = z.infer<typeof unitSchema>;
export type Currency = "USD" | "EUR" | "GBP" | "CAD";

export interface UnitTypeRule {
  requiredFields: string[];
  visibleFields: {
    specifications: string[];
    amenities: string[];
    utilities: string[];
    fees: string[];
  };
  helpText?: Record<string, string>;
}

export type UnitTypeRules = Record<UnitType, UnitTypeRule>;

export interface IUnit {
  id?: string;
  unitNumber: string;
  type: UnitType | "";
  status: UnitStatus | "";
  floor?: number;
  isActive?: boolean;
  specifications: {
    totalArea: number;
    rooms?: number;
    bathrooms?: number;
    maxOccupants?: number;
  };
  amenities: {
    airConditioning: boolean;
    heating: boolean;
    washerDryer: boolean;
    dishwasher: boolean;
    parking: boolean;
    storage: boolean;
    cableTV: boolean;
    internet: boolean;
  };
  utilities: {
    gas: boolean;
    trash: boolean;
    water: boolean;
    heating: boolean;
    centralAC: boolean;
  };
  fees: {
    currency: Currency;
    rentAmount: number;
    securityDeposit?: number;
  };
  description?: string;
}

export const defaultUnitValues: UnitFormValues = {
  unitNumber: "",
  type: UnitTypeEnum.RESIDENTIAL,
  status: UnitStatusEnum.AVAILABLE,
  floor: 1,
  isActive: true,
  specifications: {
    totalArea: 0,
    rooms: 0,
    bathrooms: 0,
    maxOccupants: 0,
  },
  amenities: {
    airConditioning: false,
    heating: false,
    washerDryer: false,
    dishwasher: false,
    parking: false,
    storage: false,
    cableTV: false,
    internet: false,
  },
  utilities: {
    gas: false,
    trash: false,
    water: false,
    heating: false,
    centralAC: false,
  },
  fees: {
    currency: "USD",
    rentAmount: 0,
    securityDeposit: 0,
  },
  description: "",
};
