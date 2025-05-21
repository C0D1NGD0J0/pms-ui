export const UnitTypeEnum = {
  STUDIO: "studio",
  ONE_BR: "1BR",
  TWO_BR: "2BR",
  THREE_BR: "3BR",
  FOUR_BR_PLUS: "4BR+",
  PENTHOUSE: "penthouse",
  LOFT: "loft",
  COMMERCIAL: "commercial",
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

export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY";

export interface IUnit {
  id?: string;
  unitNumber: string;
  type: UnitType;
  status: UnitStatus;
  floor?: number;
  isActive?: boolean;
  specifications: {
    totalArea: number;
    bedrooms?: number;
    bathrooms?: number;
    maxOccupants?: number;
  };
  amenities: {
    airConditioning: boolean;
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

export const defaultUnitValues: IUnit = {
  unitNumber: "",
  type: UnitTypeEnum.ONE_BR,
  status: UnitStatusEnum.AVAILABLE,
  floor: 1,
  isActive: true,
  specifications: {
    totalArea: 0,
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 2,
  },
  amenities: {
    airConditioning: false,
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
