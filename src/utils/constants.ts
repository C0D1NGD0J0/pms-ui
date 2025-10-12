import { PropertyTypeRule } from "@interfaces/property.interface";
import { IPaginationQuery, FilterOption } from "@interfaces/index";
import {
  UnitTypeRules,
  UnitTypeEnum,
  UnitTypeRule,
} from "@interfaces/unit.interface";

export const SIGNUP_ACCOUNT_TYPE_OPTIONS = [
  { value: "personal", label: "Personal" },
  { value: "business", label: "Business" },
];

export const ACCOUNT_TYPES = {
  PERSONAL: "personal",
  CORPORATE: "business",
};

export const MAX_TOTAL_UNITS = 250;

// Unit Features Configuration
export const unitFeatures = [
  {
    value: "cooling",
    label: "Air Conditioning",
    amenityKey: "airConditioning",
  },
  {
    value: "heating",
    label: "Heating",
    amenityKey: "heating",
  },
  {
    value: "washer-dryer",
    label: "Washer/Dryer",
    amenityKey: "washerDryer",
  },
  {
    value: "dishwasher",
    label: "Dishwasher",
    amenityKey: "dishwasher",
  },
  {
    value: "parking",
    label: "Parking",
    amenityKey: "parking",
  },
];

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
    "maxAllowedUnits",
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
  documents: ["images", "documents"],
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
    allowedUnitTypes: ["residential", "storage"],
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
    requiredFields: [...BASE_FIELDS.requiredBase, "maxAllowedUnits"],
    helpText: {
      name: "Name of the apartment building or complex",
      maxAllowedUnits:
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
    allowedUnitTypes: ["residential", "storage"],
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
    requiredFields: [...BASE_FIELDS.requiredBase, "maxAllowedUnits"],
    helpText: {
      name: "Name of the condominium building or complex",
      maxAllowedUnits:
        "For condominium buildings, each unit's details will be managed separately",
      address: "Full address of the condominium building",
    },
  }),

  commercial: createRule({
    minUnits: 3,
    validateBedBath: false,
    isMultiUnit: true,
    defaultUnits: 3,
    allowedUnitTypes: ["commercial", "storage"],
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
    requiredFields: [...BASE_FIELDS.requiredBase, "maxAllowedUnits"],
    helpText: {
      name: "Name of the commercial property or building",
      maxAllowedUnits:
        "For commercial properties, each unit's details will be managed separately",
      address: "Full address of the commercial property",
    },
  }),

  industrial: createRule({
    minUnits: 1,
    validateBedBath: false,
    isMultiUnit: true,
    defaultUnits: 2,
    allowedUnitTypes: ["commercial", "storage"],
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
    requiredFields: [...BASE_FIELDS.requiredBase, "maxAllowedUnits"],
    helpText: {
      name: "Name of the industrial property or facility",
      maxAllowedUnits:
        "For industrial properties, each unit's details will be managed separately",
      address: "Full address of the industrial property",
    },
  }),

  townhouse: createRule({
    minUnits: 1,
    validateBedBath: true,
    isMultiUnit: false,
    defaultUnits: 1,
    allowedUnitTypes: ["residential"],
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
      maxAllowedUnits:
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
    allowedUnitTypes: ["residential"],
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
      maxAllowedUnits: "For single-family homes, this is typically 1",
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
    allowedUnitTypes: ["residential"],
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
    requiredFields: [...BASE_FIELDS.requiredBase, "maxAllowedUnits"],
    helpText: {
      name: "Name of the residential estate or gated community",
      maxAllowedUnits:
        "Number of individual houses in the estate (typically 2+)",
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
    allowedUnitTypes: ["residential", "commercial", "mixed_use", "storage"],
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
    requiredFields: [...BASE_FIELDS.requiredBase, "maxAllowedUnits"],
    helpText: {
      name: "Name of the mixed-use building or development",
      maxAllowedUnits:
        "Total number of residential and commercial units combined",
      totalArea: "Total area of the entire mixed-use building",
      floors: "Number of floors in the mixed-use building",
      address: "Full address of the mixed-use property",
      maxOccupants: "Maximum occupancy for the entire building",
    },
  }),
};

const createUnitRule = (overrides: Partial<UnitTypeRule>): UnitTypeRule => {
  const defaults: UnitTypeRule = {
    requiredFields: ["unitNumber", "unitType", "totalArea", "rentAmount"],
    visibleFields: {
      specifications: ["totalArea", "rooms", "bathrooms", "maxOccupants"],
      amenities: ["airConditioning", "washerDryer", "dishwasher", "parking"],
      utilities: ["gas", "trash", "water", "heating", "centralAC"],
      fees: ["rentAmount", "securityDeposit"],
    },
    helpText: {},
  };

  return {
    ...defaults,
    ...overrides,
    visibleFields: {
      specifications:
        overrides.visibleFields?.specifications ||
        defaults.visibleFields.specifications,
      amenities:
        overrides.visibleFields?.amenities || defaults.visibleFields.amenities,
      utilities:
        overrides.visibleFields?.utilities || defaults.visibleFields.utilities,
      fees: overrides.visibleFields?.fees || defaults.visibleFields.fees,
    },
    helpText: {
      ...defaults.helpText,
      ...overrides.helpText,
    },
  };
};

export const unitTypeRules: UnitTypeRules = {
  [UnitTypeEnum.RESIDENTIAL]: createUnitRule({
    requiredFields: [
      "unitNumber",
      "rooms",
      "unitType",
      "totalArea",
      "rentAmount",
    ],
    visibleFields: {
      specifications: ["totalArea", "rooms", "bathrooms", "maxOccupants"],
      amenities: [
        "airConditioning",
        "heating",
        "washerDryer",
        "dishwasher",
        "parking",
      ],
      utilities: ["gas", "trash", "water", "heating", "centralAC"],
      fees: ["rentAmount", "securityDeposit"],
    },
    helpText: {
      bathrooms: "Number of bathrooms in this residential unit",
      rooms: "Number of rooms/bedrooms in this unit",
      maxOccupants: "Maximum number of people allowed in this unit",
    },
  }),

  [UnitTypeEnum.COMMERCIAL]: createUnitRule({
    requiredFields: ["unitNumber", "unitType", "totalArea", "rentAmount"],
    visibleFields: {
      specifications: ["totalArea", "maxOccupants", "rooms"],
      amenities: ["airConditioning", "parking"],
      utilities: ["gas", "trash", "water", "heating", "centralAC"],
      fees: ["rentAmount", "securityDeposit"],
    },
    helpText: {
      totalArea: "Total floor area of this commercial space",
      maxOccupants: "Maximum occupancy for this commercial unit",
    },
  }),

  [UnitTypeEnum.MIXED_USE]: createUnitRule({
    requiredFields: ["unitNumber", "unitType", "totalArea", "rentAmount"],
    visibleFields: {
      specifications: ["totalArea", "rooms", "bathrooms", "maxOccupants"],
      amenities: ["airConditioning", "washerDryer", "dishwasher", "parking"],
      utilities: ["gas", "trash", "water", "heating", "centralAC"],
      fees: ["rentAmount", "securityDeposit"],
    },
    helpText: {
      bathrooms: "Number of bathrooms (if applicable for mixed-use)",
      rooms: "Number of rooms (if residential portion exists)",
    },
  }),

  [UnitTypeEnum.STORAGE]: createUnitRule({
    requiredFields: ["unitNumber", "unitType", "totalArea", "rentAmount"],
    visibleFields: {
      specifications: ["totalArea"],
      amenities: ["parking"],
      utilities: ["heating"],
      fees: ["rentAmount", "securityDeposit"],
    },
    helpText: {
      totalArea: "Total storage area in square feet",
      rentAmount: "Monthly rental fee for this storage unit",
    },
  }),

  [UnitTypeEnum.OTHER]: createUnitRule({
    requiredFields: [
      "unitNumber",
      "unitType",
      "totalArea",
      "rentAmount",
      "rooms",
    ],
    visibleFields: {
      specifications: ["totalArea", "maxOccupants", "rooms"],
      amenities: ["airConditioning", "parking"],
      utilities: ["gas", "trash", "water", "heating"],
      fees: ["rentAmount", "securityDeposit"],
    },
    helpText: {
      totalArea: "Total area of this unit",
    },
  }),
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
    "maxAllowedUnits",
  ],
  condominium: [
    "totalArea",
    "bedrooms",
    "bathrooms",
    "floors",
    "maxOccupants",
    "maxAllowedUnits",
  ],
  commercial: ["totalArea", "floors", "maxAllowedUnits", "maxOccupants"],
  industrial: ["totalArea", "loadingDocks", "ceilingHeight"],
};

export const PROPERTY_QUERY_KEYS = {
  getAllProperties: (
    cuid: string,
    pid: string,
    pagination: IPaginationQuery
  ) => ["/getProperties", cuid, `page=${pagination.page}`, pid],
  getPropertyByPid: (pid: string, cuid: string) => ["/getProperty", cuid, pid],
  getPropertyUnits: (
    pid: string,
    cuid: string,
    pagination: IPaginationQuery
  ) => ["/getPropertyUnits", cuid, pid, `page=${pagination.page}`],
  getPropertyUnitByPuid: (pid: string, cuid: string, puid: string) => [
    "/getPropertyUnit",
    cuid,
    pid,
    puid,
  ],
};
export const CLIENT_QUERY_KEYS = {
  getClientBycuid: (cuid: string) => ["/getClientDetails", cuid],
  getClientProperties: (cuid: string) => ["/getClientProperties", cuid],
};
export const INVITE_QUERY_KEYS = {
  validateInviteToken: (cuid: string, token: string) => [
    "/validateInviteToken",
    cuid,
    token,
  ],
  getInviteByToken: (token: string) => ["/getInviteByToken", token],
  getInviteByCuid: (cuid: string) => ["/getInviteByCuid", cuid],
  getInvites: (cuid: string, pagination: unknown) => [
    "/getInvites",
    cuid,
    pagination,
  ],
};
export const USER_QUERY_KEYS = {
  getClientTenants: (cuid: string, pagination: IPaginationQuery) => [
    `/users/${cuid}/filtered-tenants`,
    `page=${pagination.page}`,
  ],
  getClientUsers: (cuid: string, pagination: IPaginationQuery) => [
    `/users/${cuid}/filtered-users`,
    `page=${pagination.page}`,
  ],
  getUserProfile: (cuid: string, uid: string) => [
    `/users/${cuid}/profile_details/${uid}`,
  ],
  getUserStats: (cuid: string, filters: unknown) => [
    `/users/${cuid}/users/stats`,
    filters,
  ],
  getUserByUid: (cuid: string, uid: string) => [
    `/users/${cuid}/users_details/${uid}`,
    uid,
  ],
};
export const VENDOR_QUERY_KEYS = {
  getClientVendors: (cuid: string, pagination: unknown) => [
    `/vendors/${cuid}/vendors/filteredVendors`,
    pagination,
  ],
  getVendorByUid: (cuid: string, vendorId: string) => [
    `/vendors/${cuid}/vendors/${vendorId}`,
    vendorId,
  ],
  getVendorTeamMembers: (cuid: string, vuid: string, pagination: unknown) => [
    `/vendors/${cuid}/team_members/${vuid}`,
    pagination,
  ],
  getAllClientVendors: (cuid: string) => [`/vendors/${cuid}/vendors`, cuid],
  getVendorStats: (cuid: string, filterParams?: unknown) => [
    `/vendors/${cuid}/vendors/stats`,
    filterParams,
  ],
};
export const CURRENT_USER_QUERY_KEY = ["currentUser"];

export const COMMON_SORT_OPTIONS: FilterOption[] = [
  { label: "All", value: "" },
  { label: "Name", value: "fullName" },
  { label: "Email", value: "email" },
  { label: "Department", value: "department" },
  { label: "Role", value: "role" },
  { label: "Created Date", value: "createdAt" },
];

export const COMMON_DEPARTMENT_OPTIONS: FilterOption[] = [
  { label: "All Departments", value: "" },
  { label: "Management", value: "management" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Operations", value: "operations" },
  { label: "Accounting", value: "accounting" },
  { label: "Leasing", value: "leasing" },
];

export const COMMON_STATUS_OPTIONS: FilterOption[] = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const ALL_ROLE_OPTIONS: FilterOption[] = [
  { label: "All Roles", value: "" },
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Staff", value: "staff" },
  { label: "Tenant", value: "tenant" },
  { label: "Vendor", value: "vendor" },
];

export const EMPLOYEE_ROLE_OPTIONS: FilterOption[] = [
  { label: "All Employee Roles", value: "" },
  { label: "Manager", value: "manager" },
  { label: "Staff", value: "staff" },
];

export const TYPE_OPTIONS: FilterOption[] = [
  { label: "All Types", value: "" },
  { label: "Employee", value: "employee" },
  { label: "Tenant", value: "tenant" },
  { label: "Vendor", value: "vendor" },
];

export const VENDOR_SERVICE_OPTIONS = [
  { label: "HVAC", value: "hvac" },
  { label: "All Services", value: "all" },
  { label: "General", value: "general" },
  { label: "Plumbing", value: "plumbing" },
  { label: "Electrical", value: "electrical" },
];
