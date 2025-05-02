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

export interface IPropertyFees {
  currency: string;
  taxAmount: string;
  rentalAmount: string;
  managementFees: string;
  securityDeposit: string;
}

export interface IPropertySpecifications {
  totalArea: number;
  lotSize: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  garageSpaces: number;
  maxOccupants: number;
}

export interface IPropertyUtilities {
  water: boolean;
  gas: boolean;
  electricity: boolean;
  internet: boolean;
  cableTV: boolean;
}

export interface IPropertyDescription {
  text: string;
  html: string;
}

export interface IPropertyInteriorAmenities {
  airConditioning: boolean;
  heating: boolean;
  washerDryer: boolean;
  dishwasher: boolean;
  fridge: boolean;
  furnished: boolean;
  storageSpace: boolean;
}

export interface IPropertyCommunityAmenities {
  swimmingPool: boolean;
  fitnessCenter: boolean;
  elevator: boolean;
  parking: boolean;
  securitySystem: boolean;
  laundryFacility: boolean;
  petFriendly: boolean;
  doorman: boolean;
}

export interface IPropertyAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postCode: string;
  streetNumber: string;
}

export interface IProperty {
  fees: IPropertyFees;
  specifications: IPropertySpecifications;
  utilities: IPropertyUtilities;
  description: IPropertyDescription;
  interiorAmenities: IPropertyInteriorAmenities;
  communityAmenities: IPropertyCommunityAmenities;
  address: IPropertyAddress;
  _id: string;
  cid: string;
  name: string;
  propertyType: string;
  status: string;
  managedBy: string;
  yearBuilt: number;
  occupancyStatus: string;
  totalUnits: number;
  createdBy: string;
  deletedAt: string | null;
  pid: string;
  documents: any[];
  __v: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface IPropertyFilterParams {
  status: string;
  address: string;
  propertyType: string;
  occupancyStatus: string;
  minPrice: number | "";
  maxPrice: number | "";
  searchTerm: string;
  minArea: number | "";
  maxArea: number | "";
  minYear: number | "";
  maxYear: number | "";
}
