import { z } from "zod";
import { csvUploadSchema } from "@validations/index";

// Define enums first
export enum PropertyTypesEnum {
  HOUSE = "house",
  CONDO = "condominium",
  APARTMENT = "apartment",
  TOWNHOUSE = "townhouse",
  COMMERCIAL = "commercial",
  INDUSTRIAL = "industrial",
  MIXED_PROPERTY = "mixed",
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

// MongoDB generated fields that should be excluded from form values
type MongoDbGeneratedFields =
  | "_id"
  | "__v"
  | "createdAt"
  | "updatedAt"
  | "createdBy"
  | "deletedAt"
  | "pid"
  | "id";

// Define property interfaces
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
  trash: boolean;
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
  fullAddress?: string;
  streetNumber: string;
  unitNumber?: string;
  coordinates?: number[];
}

// Base property document interface (data only, no methods)
export interface IPropertyDocument {
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
  financialDetails: {
    purchasePrice: number;
    purchaseDate: string;
    marketValue: number;
    propertyTax: number;
    lastAssessmentDate: string;
  };
}

// Business methods interface (no data properties)
export interface IPropertyModelMethods {
  // Occupancy status methods
  isVacant(): boolean;
  isOccupied(): boolean;
  isUnderMaintenance(): boolean;

  // Unit type methods
  isMultiUnit(): boolean;
  isSingleFamily(): boolean;
  getMinUnits(): number;
  getDefaultUnits(): number;
  shouldValidateBedBath(): boolean;
  isValidUnitCount(): boolean;

  // Financial and validation methods
  hasFinancialInfo(): boolean;
  hasAddress(): boolean;
  getMonthlyRental(): number;
  getSecurityDeposit(): number;
  getTotalValue(): number;

  // Property type classification methods
  isCommercialType(): boolean;
  isResidentialType(): boolean;
  isMixedUseType(): boolean;

  // Calculated property methods
  getPropertyAge(): number | null;
  getTotalBedrooms(): number;
  getTotalBathrooms(): number;
  getTotalArea(): number;

  // Utility methods
  hasAmenity(amenityCategory: string, amenityName: string): boolean;
  getRawData(): IPropertyDocument;
  toJSON(): IPropertyDocument;
}

// propertyModel becomes data + methods via intersection
export type IPropertyModel = IPropertyDocument & IPropertyModelMethods;

export type PropertyFormValues = Omit<
  IPropertyDocument,
  MongoDbGeneratedFields
> & {
  propertyType?: PropertyTypesEnum;
  status?: PropertyStatusEnum;
  occupancyStatus?: PropertyOccupancyStatusEnum;
  propertyImages: any[];
};

export type EditPropertyFormValues = PropertyFormValues;

export type CsvUploadValues = z.infer<typeof csvUploadSchema>;

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

export type PropertyTypeRules = Record<string, PropertyTypeRule>;
export interface PropertyTypeRule {
  minUnits: number;
  validateBedBath: boolean;
  isMultiUnit: boolean;
  defaultUnits: number;
  visibleFields: {
    // Core property fields
    core: string[];
    // Property specification fields
    specifications: string[];
    // Financial and fee fields
    financial: string[];
    // Amenity fields
    amenities: string[];
    // Document and media fields
    documents: string[];
    // Unit-level fields (managed per unit)
    unit: string[];
  };
  requiredFields: string[];
  helpText: Record<string, string>;
}
