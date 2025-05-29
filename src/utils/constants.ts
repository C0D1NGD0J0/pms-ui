import {
  PropertyFormValues,
  PropertyTypeRule,
} from "@interfaces/property.interface";

export const SIGNUP_ACCOUNT_TYPE_OPTIONS = [
  { value: "personal", label: "Personal" },
  { value: "business", label: "Business" },
];

export const ACCOUNT_TYPES = {
  PERSONAL: "personal",
  CORPORATE: "business",
};

export const MAX_TOTAL_UNITS = 250;

export type PropertyTypeRules = Record<string, PropertyTypeRule>;

const BASE_FIELDS = {
  core: [
    "name",
    "propertyType",
    "status",
    "managedBy",
    "yearBuilt",
    "address",
    "description",
    "occupancyStatus",
    "totalUnits",
  ],
  financial: [
    "purchasePrice",
    "purchaseDate",
    "marketValue",
    "propertyTax",
    "lastAssessmentDate",
    "taxAmount",
    "rentalAmount",
    "managementFees",
    "securityDeposit",
  ],
  documents: ["propertyImages", "documents"],
  baseSpecifications: ["totalArea", "floors"],
  residentialSpecifications: ["lotSize", "garageSpaces", "maxOccupants"],
  singleFamilySpecifications: ["bedrooms", "bathrooms"],
  allAmenities: ["utilities", "interiorAmenities", "communityAmenities"],
  basicAmenities: ["utilities"],
  commercialAmenities: ["utilities", "communityAmenities"],
  unitFields: {
    residential: ["bedrooms", "bathrooms", "unitSize"],
    commercial: ["unitSize"],
    mixed: ["bedrooms", "bathrooms", "unitSize"], // For mixed-use units
  },
  requiredBase: ["name", "address", "totalArea"],
};

const createRule = (overrides: Partial<PropertyTypeRule>): PropertyTypeRule => {
  const defaults: PropertyTypeRule = {
    minUnits: 1,
    validateBedBath: false,
    isMultiUnit: false,
    defaultUnits: 1,
    visibleFields: {
      core: BASE_FIELDS.core,
      specifications: [...BASE_FIELDS.baseSpecifications],
      financial: BASE_FIELDS.financial,
      amenities: BASE_FIELDS.basicAmenities,
      documents: BASE_FIELDS.documents,
      unit: [],
    },
    requiredFields: BASE_FIELDS.requiredBase,
    helpText: {},
  };

  const mergedVisibleFields = {
    core: overrides.visibleFields?.core || defaults.visibleFields.core,
    specifications:
      overrides.visibleFields?.specifications ||
      defaults.visibleFields.specifications,
    financial:
      overrides.visibleFields?.financial || defaults.visibleFields.financial,
    amenities:
      overrides.visibleFields?.amenities || defaults.visibleFields.amenities,
    documents:
      overrides.visibleFields?.documents || defaults.visibleFields.documents,
    unit: overrides.visibleFields?.unit || defaults.visibleFields.unit,
  };

  return {
    ...defaults,
    ...overrides,
    visibleFields: mergedVisibleFields,
    helpText: {
      ...defaults.helpText,
      ...overrides.helpText,
    },
  };
};

export const propertyTypeRules: PropertyTypeRules = {
  apartment: createRule({
    minUnits: 2,
    validateBedBath: false,
    isMultiUnit: true,
    defaultUnits: 4,
    visibleFields: {
      core: BASE_FIELDS.core,
      specifications: [
        ...BASE_FIELDS.baseSpecifications,
        ...BASE_FIELDS.residentialSpecifications,
      ],
      financial: BASE_FIELDS.financial,
      amenities: BASE_FIELDS.allAmenities,
      documents: BASE_FIELDS.documents,
      unit: BASE_FIELDS.unitFields.residential,
    },
    requiredFields: [...BASE_FIELDS.requiredBase, "totalUnits"],
    helpText: {
      name: "Name of the apartment building or complex",
      totalUnits:
        "Number of apartment units in the building you manage (typically 2+)",
      floors: "Total number of floors in the apartment building",
      totalArea: "Total area of the entire apartment building",
      address: "Full address of the apartment building",
    },
  }),

  condominium: createRule({
    minUnits: 4,
    defaultUnits: 4,
    isMultiUnit: true,
    validateBedBath: false,
    visibleFields: {
      core: BASE_FIELDS.core,
      specifications: [
        ...BASE_FIELDS.baseSpecifications,
        "maxOccupants",
        "garageSpaces",
      ],
      financial: BASE_FIELDS.financial,
      amenities: BASE_FIELDS.allAmenities,
      documents: BASE_FIELDS.documents,
      unit: BASE_FIELDS.unitFields.residential,
    },
    requiredFields: [...BASE_FIELDS.requiredBase, "totalUnits"],
    helpText: {
      name: "Name of the condominium building or complex",
      totalUnits:
        "For condominium buildings, each unit's details will be managed separately",
      address: "Full address of the condominium building",
    },
  }),

  commercial: createRule({
    minUnits: 4,
    validateBedBath: false,
    isMultiUnit: true,
    defaultUnits: 4,
    visibleFields: {
      core: BASE_FIELDS.core,
      specifications: [
        ...BASE_FIELDS.baseSpecifications,
        ...BASE_FIELDS.residentialSpecifications,
      ],
      financial: BASE_FIELDS.financial,
      amenities: BASE_FIELDS.commercialAmenities,
      documents: BASE_FIELDS.documents,
      unit: BASE_FIELDS.unitFields.commercial,
    },
    requiredFields: [...BASE_FIELDS.requiredBase, "totalUnits"],
    helpText: {
      name: "Name of the commercial property or building",
      totalUnits:
        "For commercial properties, each unit's details will be managed separately",
      address: "Full address of the commercial property",
    },
  }),

  industrial: createRule({
    minUnits: 1,
    validateBedBath: false,
    isMultiUnit: false,
    defaultUnits: 1,
    visibleFields: {
      core: BASE_FIELDS.core,
      specifications: [
        ...BASE_FIELDS.baseSpecifications,
        "lotSize",
        "garageSpaces",
      ],
      financial: BASE_FIELDS.financial,
      amenities: BASE_FIELDS.basicAmenities,
      documents: BASE_FIELDS.documents,
      unit: BASE_FIELDS.unitFields.commercial,
    },
    requiredFields: [...BASE_FIELDS.requiredBase, "totalUnits"],
    helpText: {
      name: "Name of the industrial property or facility",
      totalUnits:
        "For industrial properties, each unit's details will be managed separately",
      address: "Full address of the industrial property",
    },
  }),

  townhouse: createRule({
    minUnits: 1,
    validateBedBath: true,
    isMultiUnit: false,
    defaultUnits: 1,
    visibleFields: {
      core: BASE_FIELDS.core,
      specifications: [
        ...BASE_FIELDS.baseSpecifications,
        ...BASE_FIELDS.residentialSpecifications,
        ...BASE_FIELDS.singleFamilySpecifications,
      ],
      financial: BASE_FIELDS.financial,
      amenities: BASE_FIELDS.allAmenities,
      documents: BASE_FIELDS.documents,
      unit: [],
    },
    requiredFields: [
      ...BASE_FIELDS.requiredBase,
      ...BASE_FIELDS.singleFamilySpecifications,
    ],
    helpText: {
      name: "Name or address identifier for the townhouse",
      totalUnits:
        "Typically 1 for a single townhouse, increase if property contains multiple units",
      bedrooms: "Number of bedrooms in the entire townhouse",
      bathrooms: "Number of bathrooms in the entire townhouse",
      address: "Full address of the townhouse",
    },
  }),

  house: createRule({
    minUnits: 1,
    validateBedBath: true,
    isMultiUnit: false,
    defaultUnits: 1,
    visibleFields: {
      core: BASE_FIELDS.core,
      specifications: [
        ...BASE_FIELDS.baseSpecifications,
        ...BASE_FIELDS.residentialSpecifications,
        ...BASE_FIELDS.singleFamilySpecifications,
      ],
      financial: BASE_FIELDS.financial,
      amenities: BASE_FIELDS.allAmenities,
      documents: BASE_FIELDS.documents,
      unit: [],
    },
    requiredFields: [
      ...BASE_FIELDS.requiredBase,
      ...BASE_FIELDS.singleFamilySpecifications,
    ],
    helpText: {
      name: "Name or address identifier for the house",
      totalUnits: "For single-family homes, this is typically 1",
      bedrooms: "Number of bedrooms in the entire house",
      bathrooms: "Number of bathrooms in the entire house",
      address: "Full address of the house",
    },
  }),

  estate: createRule({
    minUnits: 2,
    validateBedBath: false,
    isMultiUnit: true,
    defaultUnits: 8,
    visibleFields: {
      core: BASE_FIELDS.core,
      specifications: [
        ...BASE_FIELDS.baseSpecifications,
        ...BASE_FIELDS.residentialSpecifications,
      ],
      financial: BASE_FIELDS.financial,
      amenities: BASE_FIELDS.allAmenities,
      documents: BASE_FIELDS.documents,
      unit: BASE_FIELDS.unitFields.residential,
    },
    requiredFields: [...BASE_FIELDS.requiredBase, "totalUnits"],
    helpText: {
      name: "Name of the residential estate or gated community",
      totalUnits: "Number of individual houses in the estate (typically 2+)",
      totalArea: "Total area of the entire estate including common areas",
      lotSize: "Total land size of the estate",
      address: "Main address or entrance of the estate",
      floors: "Number of floors in the estate buildings (if applicable)",
    },
  }),

  mixed: createRule({
    minUnits: 2,
    validateBedBath: false,
    isMultiUnit: true,
    defaultUnits: 6,
    visibleFields: {
      core: BASE_FIELDS.core,
      specifications: [
        ...BASE_FIELDS.baseSpecifications,
        ...BASE_FIELDS.residentialSpecifications,
      ],
      financial: BASE_FIELDS.financial,
      amenities: BASE_FIELDS.allAmenities,
      documents: BASE_FIELDS.documents,
      unit: BASE_FIELDS.unitFields.mixed,
    },
    requiredFields: [...BASE_FIELDS.requiredBase, "totalUnits"],
    helpText: {
      name: "Name of the mixed-use building or development",
      totalUnits: "Total number of residential and commercial units combined",
      totalArea: "Total area of the entire mixed-use building",
      floors: "Number of floors in the mixed-use building",
      address: "Full address of the mixed-use property",
      maxOccupants: "Maximum occupancy for the entire building",
    },
  }),
};

export const defaultPropertyValues: PropertyFormValues = {
  name: "",
  cid: "",
  status: undefined as any,
  managedBy: "",
  yearBuilt: 1800,
  propertyType: undefined as any,
  address: {
    fullAddress: "",
    city: "",
    state: "",
    postCode: "",
    country: "",
    street: "",
    streetNumber: "",
    unitNumber: "",
  },
  financialDetails: {
    purchasePrice: 0,
    purchaseDate: "",
    marketValue: 0,
    propertyTax: 0,
    lastAssessmentDate: "",
  },
  fees: {
    currency: "USD",
    taxAmount: "0.00",
    rentalAmount: "0.00",
    managementFees: "0.00",
    securityDeposit: "0.00",
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
  occupancyStatus: undefined as any,
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

export const PROPERTY_QUERY_KEYS = {
  allProperties: (csub: string, pid: string, pagination: unknown) => [
    "/getProperties",
    csub,
    pagination,
    pid,
  ],
  propertyById: (pid: string, csub: string) => ["/getProperty", csub, pid],
  propertyUnits: (pid: string, uid: string) => ["/getPropertyUnits", pid, uid],
};
export const CURRENT_USER_QUERY_KEY = ["currentUser"];
