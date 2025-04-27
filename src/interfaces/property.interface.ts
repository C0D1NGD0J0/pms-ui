import { z } from "zod";
import { csvUploadSchema, propertySchema } from "@validations/index";

export type PropertyFormValues = z.infer<typeof propertySchema>;
export type CsvUploadValues = z.infer<typeof csvUploadSchema>;

export const defaultPropertyValues: PropertyFormValues = {
  name: "",
  cid: "",
  status: undefined,
  managedBy: "",
  yearBuilt: 1800,
  propertyType: undefined,
  address: {
    fullAddress: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "",
    unitApartment: "",
  },
  financialDetails: {
    purchasePrice: 0,
    purchaseDate: "",
    marketValue: 0,
    propertyTax: 0,
    lastAssessmentDate: "",
  },
  specifications: {
    totalArea: 0,
    lotSize: 0,
    bedrooms: 0,
    bathrooms: 0,
    floors: 1,
    garageSpaces: 0,
    maxOccupants: 1,
  },
  utilities: {
    water: false,
    gas: false,
    electricity: false,
    internet: false,
    trash: false,
    cableTV: false,
  },
  description: {
    text: "",
    html: "",
  },
  occupancyStatus: undefined,
  interiorAmenities: {
    airConditioning: false,
    heating: false,
    washerDryer: false,
    dishwasher: false,
    fridge: false,
    furnished: false,
    storageSpace: false,
  },
  communityAmenities: {
    swimmingPool: false,
    fitnessCenter: false,
    elevator: false,
    parking: false,
    securitySystem: false,
    petFriendly: false,
    laundryFacility: false,
    doorman: false,
  },
  totalUnits: 0,
  documents: [],
  propertyImages: [],
};

export const formFieldVisibilityMap = {
  house: [
    "totalArea",
    "lotSize",
    "bedrooms",
    "bathrooms",
    "floors",
    "garageSpaces",
    "maxOccupants",
  ],
  townhouse: [
    "totalArea",
    "lotSize",
    "bedrooms",
    "bathrooms",
    "floors",
    "garageSpaces",
    "maxOccupants",
  ],
  apartment: [
    "totalArea",
    "bedrooms",
    "bathrooms",
    "floors",
    "maxOccupants",
    "totalUnits",
  ],
  condominium: [
    "totalArea",
    "bedrooms",
    "bathrooms",
    "floors",
    "maxOccupants",
    "totalUnits",
  ],
  commercial: ["totalArea", "floors", "totalUnits", "maxOccupants"],
  industrial: ["totalArea", "loadingDocks", "ceilingHeight"],
};

export type StaticPropertyFormConfig = {
  propertyTypes: string[];
  propertyStatuses: string[];
  occupancyStatuses: string[];
  documentTypes: string[];
  currencies: string[];
  specifications: {
    [key: string]: {
      type: string;
      isRequired: boolean;
      min: number;
    };
  };
};

export enum PropertyTypesEnum {
  HOUSE = "house",
  CONDO = "condominium",
  APARTMENT = "apartment",
  TOWNHOUSE = "townhouse",
  COMMERCIAL = "commercial",
  INDUSTRIAL = "industrial",
}

export enum PropertyStatusEnum {
  OCCUPIED = "occupied",
  INACTIVE = "inactive",
  AVAILABLE = "available",
  UNDER_MAINTENANCE = "maintenance",
  UNDER_CONSTRUCTION = "construction",
}

export enum PropertyOccupancyStatusEnum {
  VACANT = "vacant",
  OCCUPIED = "occupied",
  PARTIALLY_OCCUPIED = "partially_occupied",
}
