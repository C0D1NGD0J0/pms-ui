// Define the Property interface
export interface Property {
  id: string;
  name: string;
  type: string; // apartment, house, condo, townhouse, commercial, industrial
  status: string; // available, occupied, maintenance, construction
  address: {
    street: string;
    unit?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  manager?: string;
  yearBuilt?: number;
  financials?: {
    purchasePrice?: number;
    purchaseDate?: string;
    marketValue?: number;
    rentAmount?: number;
    securityDeposit?: number;
    propertyTax?: number;
  };
  details?: {
    bedrooms?: number;
    bathrooms?: number;
    totalArea?: number;
    lotSize?: number;
    floors?: number;
    garageSpaces?: number;
  };
  amenities?: {
    interiorAmenities?: {
      airConditioning?: boolean;
      heating?: boolean;
      washerDryer?: boolean;
      dishwasher?: boolean;
      fireplace?: boolean;
      hardwoodFloors?: boolean;
      furnished?: boolean;
      storageSpace?: boolean;
      walkInCloset?: boolean;
    };
    exteriorAmenities?: {
      swimmingPool?: boolean;
      fitnessCenter?: boolean;
      elevator?: boolean;
      balconyPatio?: boolean;
      parking?: boolean;
      garden?: boolean;
      securitySystem?: boolean;
      playground?: boolean;
    };
    communityAmenities?: {
      petFriendly?: boolean;
      clubhouse?: boolean;
      bbqArea?: boolean;
      laundryFacility?: boolean;
      doorman?: boolean;
      studyRoom?: boolean;
    };
  };
  images?: string[];
  description?: string;
  dateAdded: string;
  lastUpdated: string;
}

// Create array of 15 properties with varied data
export const properties: Property[] = [
  {
    id: "PROP-0001",
    name: "Sunset Heights Apartment",
    type: "apartment",
    status: "occupied",
    address: {
      street: "123 Sunset Boulevard",
      unit: "4B",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90210",
      country: "us",
    },
    manager: "Jonathan Smith",
    yearBuilt: 2010,
    financials: {
      purchasePrice: 450000,
      purchaseDate: "2019-05-12",
      marketValue: 550000,
      rentAmount: 2200,
      securityDeposit: 4400,
      propertyTax: 6500,
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      totalArea: 1100,
      floors: 1,
      garageSpaces: 1,
    },
    amenities: {
      interiorAmenities: {
        airConditioning: true,
        heating: true,
        washerDryer: true,
        dishwasher: true,
        fireplace: false,
        hardwoodFloors: true,
        furnished: false,
        storageSpace: false,
        walkInCloset: false,
      },
      exteriorAmenities: {
        swimmingPool: true,
        fitnessCenter: false,
        elevator: false,
        balconyPatio: false,
        parking: true,
        garden: false,
        securitySystem: true,
        playground: false,
      },
      communityAmenities: {
        petFriendly: true,
        clubhouse: false,
        bbqArea: true,
        laundryFacility: false,
        doorman: false,
        studyRoom: false,
      },
    },
    dateAdded: "2023-01-15",
    lastUpdated: "2025-03-22",
  },
  {
    id: "PROP-0002",
    name: "Riverfront Condominium",
    type: "condo",
    status: "available",
    address: {
      street: "45 River Drive",
      unit: "12A",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "us",
    },
    manager: "Sarah Johnson",
    yearBuilt: 2015,
    financials: {
      purchasePrice: 625000,
      purchaseDate: "2020-11-05",
      marketValue: 700000,
      rentAmount: 3200,
      securityDeposit: 6400,
      propertyTax: 8200,
    },
    details: {
      bedrooms: 3,
      bathrooms: 2.5,
      totalArea: 1800,
      floors: 1,
      garageSpaces: 2,
    },
    amenities: {
      interiorAmenities: {
        airConditioning: true,
        heating: true,
        washerDryer: true,
        dishwasher: true,
        fireplace: true,
        hardwoodFloors: true,
        furnished: false,
        storageSpace: false,
        walkInCloset: false,
      },
      exteriorAmenities: {
        swimmingPool: false,
        fitnessCenter: false,
        elevator: true,
        balconyPatio: true,
        parking: false,
        garden: false,
        securitySystem: true,
        playground: false,
      },
      communityAmenities: {
        petFriendly: true,
        clubhouse: true,
        bbqArea: false,
        laundryFacility: false,
        doorman: false,
        studyRoom: false,
      },
    },
    dateAdded: "2023-03-10",
    lastUpdated: "2025-04-01",
  },
  {
    id: "PROP-0003",
    name: "Oakwood Family Home",
    type: "house",
    status: "occupied",
    address: {
      street: "789 Oak Street",
      city: "Austin",
      state: "TX",
      postalCode: "78701",
      country: "us",
    },
    manager: "Michael Davis",
    yearBuilt: 2005,
    financials: {
      purchasePrice: 520000,
      purchaseDate: "2018-07-20",
      marketValue: 650000,
      rentAmount: 2900,
      securityDeposit: 5800,
      propertyTax: 7500,
    },
    details: {
      bedrooms: 4,
      bathrooms: 3,
      totalArea: 2400,
      lotSize: 8500,
      floors: 2,
      garageSpaces: 2,
    },
    amenities: {
      interiorAmenities: {
        airConditioning: true,
        heating: false,
        washerDryer: true,
        dishwasher: true,
        fireplace: true,
        hardwoodFloors: false,
        furnished: false,
        storageSpace: false,
        walkInCloset: false,
      },
      exteriorAmenities: {
        swimmingPool: false,
        fitnessCenter: false,
        elevator: false,
        balconyPatio: true,
        parking: false,
        garden: true,
        securitySystem: false,
        playground: false,
      },
      communityAmenities: {
        petFriendly: true,
        clubhouse: false,
        bbqArea: false,
        laundryFacility: false,
        doorman: false,
        studyRoom: false,
      },
    },
    dateAdded: "2023-04-05",
    lastUpdated: "2025-03-15",
  },
  {
    id: "PROP-0004",
    name: "Downtown Retail Space",
    type: "commercial",
    status: "available",
    address: {
      street: "567 Main Street",
      unit: "Suite 101",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "us",
    },
    manager: "Jonathan Smith",
    yearBuilt: 2000,
    financials: {
      purchasePrice: 850000,
      purchaseDate: "2017-03-15",
      marketValue: 920000,
      rentAmount: 5500,
      propertyTax: 12000,
    },
    details: {
      totalArea: 3200,
      floors: 1,
    },
    dateAdded: "2023-05-20",
    lastUpdated: "2025-03-30",
  },
  {
    id: "PROP-0005",
    name: "Parkview Townhouse",
    type: "townhouse",
    status: "maintenance",
    address: {
      street: "321 Park Avenue",
      unit: "5",
      city: "Denver",
      state: "CO",
      postalCode: "80202",
      country: "us",
    },
    manager: "Sarah Johnson",
    yearBuilt: 2012,
    financials: {
      purchasePrice: 380000,
      purchaseDate: "2019-09-10",
      marketValue: 425000,
      rentAmount: 2500,
      securityDeposit: 5000,
      propertyTax: 4800,
    },
    details: {
      bedrooms: 3,
      bathrooms: 2.5,
      totalArea: 1650,
      floors: 3,
      garageSpaces: 1,
    },
    amenities: {
      interiorAmenities: {
        airConditioning: true,
        heating: false,
        washerDryer: true,
        dishwasher: true,
        fireplace: false,
        hardwoodFloors: false,
        furnished: false,
        storageSpace: false,
        walkInCloset: false,
      },
      exteriorAmenities: {
        swimmingPool: false,
        fitnessCenter: false,
        elevator: false,
        balconyPatio: true,
        parking: true,
        garden: false,
        securitySystem: false,
        playground: true,
      },
      communityAmenities: {
        petFriendly: true,
        clubhouse: false,
        bbqArea: false,
        laundryFacility: false,
        doorman: false,
        studyRoom: false,
      },
    },
    dateAdded: "2023-06-12",
    lastUpdated: "2025-03-25",
  },
  {
    id: "PROP-0006",
    name: "Harbor View Penthouse",
    type: "apartment",
    status: "occupied",
    address: {
      street: "100 Harbor View Drive",
      unit: "PH3",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "us",
    },
    manager: "Michael Davis",
    yearBuilt: 2018,
    financials: {
      purchasePrice: 1250000,
      purchaseDate: "2021-02-18",
      marketValue: 1500000,
      rentAmount: 6800,
      securityDeposit: 13600,
      propertyTax: 18000,
    },
    details: {
      bedrooms: 3,
      bathrooms: 3.5,
      totalArea: 2800,
      floors: 1,
      garageSpaces: 2,
    },
    amenities: {
      interiorAmenities: {
        airConditioning: true,
        heating: true,
        washerDryer: true,
        dishwasher: true,
        fireplace: true,
        hardwoodFloors: true,
        furnished: false,
        storageSpace: true,
        walkInCloset: true,
      },
      exteriorAmenities: {
        swimmingPool: true,
        fitnessCenter: true,
        elevator: true,
        balconyPatio: true,
        parking: false,
        garden: false,
        securitySystem: true,
        playground: false,
      },
      communityAmenities: {
        petFriendly: true,
        clubhouse: true,
        bbqArea: false,
        laundryFacility: false,
        doorman: true,
        studyRoom: false,
      },
    },
    dateAdded: "2023-07-05",
    lastUpdated: "2025-03-18",
  },
  {
    id: "PROP-0007",
    name: "Maple Street Duplex",
    type: "house",
    status: "available",
    address: {
      street: "457 Maple Street",
      city: "Portland",
      state: "OR",
      postalCode: "97205",
      country: "us",
    },
    manager: "Sarah Johnson",
    yearBuilt: 1995,
    financials: {
      purchasePrice: 650000,
      purchaseDate: "2018-11-30",
      marketValue: 780000,
      rentAmount: 3600,
      securityDeposit: 7200,
      propertyTax: 8500,
    },
    details: {
      bedrooms: 5,
      bathrooms: 4,
      totalArea: 3200,
      lotSize: 5500,
      floors: 2,
      garageSpaces: 2,
    },
    amenities: {
      interiorAmenities: {
        airConditioning: true,
        heating: true,
        washerDryer: true,
        dishwasher: true,
        fireplace: true,
        hardwoodFloors: false,
        furnished: false,
        storageSpace: false,
        walkInCloset: false,
      },
      exteriorAmenities: {
        swimmingPool: false,
        fitnessCenter: false,
        elevator: false,
        balconyPatio: true,
        parking: false,
        garden: true,
        securitySystem: false,
        playground: false,
      },
      communityAmenities: {
        petFriendly: true,
        clubhouse: false,
        bbqArea: false,
        laundryFacility: false,
        doorman: false,
        studyRoom: false,
      },
    },
    dateAdded: "2023-08-15",
    lastUpdated: "2025-04-02",
  },
  {
    id: "PROP-0008",
    name: "Industrial Warehouse",
    type: "industrial",
    status: "occupied",
    address: {
      street: "1200 Industry Road",
      city: "Dallas",
      state: "TX",
      postalCode: "75247",
      country: "us",
    },
    manager: "Jonathan Smith",
    yearBuilt: 2005,
    financials: {
      purchasePrice: 1850000,
      purchaseDate: "2020-01-15",
      marketValue: 2100000,
      rentAmount: 12500,
      propertyTax: 25000,
    },
    details: {
      totalArea: 15000,
      lotSize: 45000,
    },
    dateAdded: "2023-09-10",
    lastUpdated: "2025-03-20",
  },
  {
    id: "PROP-0009",
    name: "Lakeside Cottage",
    type: "house",
    status: "construction",
    address: {
      street: "25 Lakeview Road",
      city: "Minneapolis",
      state: "MN",
      postalCode: "55401",
      country: "us",
    },
    manager: "Michael Davis",
    yearBuilt: 2025, // Still under construction
    financials: {
      purchasePrice: 350000,
      purchaseDate: "2024-10-05",
      marketValue: 450000,
      propertyTax: 5000,
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      totalArea: 1200,
      lotSize: 9500,
      floors: 1,
      garageSpaces: 1,
    },
    amenities: {
      interiorAmenities: {
        airConditioning: true,
        heating: false,
        washerDryer: false,
        dishwasher: false,
        fireplace: true,
        hardwoodFloors: true,
        furnished: false,
        storageSpace: false,
        walkInCloset: false,
      },
      exteriorAmenities: {
        swimmingPool: false,
        fitnessCenter: false,
        elevator: false,
        balconyPatio: true,
        parking: false,
        garden: true,
        securitySystem: false,
        playground: false,
      },
      communityAmenities: {
        petFriendly: false,
        clubhouse: false,
        bbqArea: false,
        laundryFacility: false,
        doorman: false,
        studyRoom: false,
      },
    },
    dateAdded: "2024-10-20",
    lastUpdated: "2025-03-28",
  },
  {
    id: "PROP-0010",
    name: "City Center Studio",
    type: "apartment",
    status: "available",
    address: {
      street: "555 Downtown Avenue",
      unit: "3C",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "us",
    },
    manager: "Sarah Johnson",
    yearBuilt: 2010,
    financials: {
      purchasePrice: 395000,
      purchaseDate: "2022-04-15",
      marketValue: 420000,
      rentAmount: 2100,
      securityDeposit: 4200,
      propertyTax: 5200,
    },
    details: {
      bedrooms: 0,
      bathrooms: 1,
      totalArea: 550,
      floors: 1,
    },
    amenities: {
      interiorAmenities: {
        airConditioning: true,
        heating: false,
        washerDryer: false,
        dishwasher: true,
        fireplace: false,
        hardwoodFloors: false,
        furnished: false,
        storageSpace: false,
        walkInCloset: false,
      },
      exteriorAmenities: {
        swimmingPool: false,
        fitnessCenter: false,
        elevator: true,
        balconyPatio: false,
        parking: false,
        garden: false,
        securitySystem: true,
        playground: false,
      },
      communityAmenities: {
        petFriendly: false,
        clubhouse: false,
        bbqArea: false,
        laundryFacility: true,
        doorman: false,
        studyRoom: false,
      },
    },
    dateAdded: "2023-11-05",
    lastUpdated: "2025-03-15",
  },
  {
    id: "PROP-0011",
    name: "Palm Beach Vacation Home",
    type: "house",
    status: "occupied",
    address: {
      street: "789 Oceanfront Drive",
      city: "Palm Beach",
      state: "FL",
      postalCode: "33480",
      country: "us",
    },
    manager: "Jonathan Smith",
    yearBuilt: 2008,
    financials: {
      purchasePrice: 980000,
      purchaseDate: "2020-06-30",
      marketValue: 1250000,
      rentAmount: 5500,
      securityDeposit: 11000,
      propertyTax: 14000,
    },
    details: {
      bedrooms: 4,
      bathrooms: 3.5,
      totalArea: 2900,
      lotSize: 12000,
      floors: 2,
      garageSpaces: 2,
    },
    amenities: {
      interiorAmenities: {
        airConditioning: true,
        heating: true,
        washerDryer: true,
        dishwasher: true,
        fireplace: true,
        hardwoodFloors: true,
        furnished: false,
        storageSpace: false,
        walkInCloset: false,
      },
      exteriorAmenities: {
        swimmingPool: true,
        fitnessCenter: false,
        elevator: false,
        balconyPatio: true,
        parking: false,
        garden: true,
        securitySystem: true,
        playground: false,
      },
      communityAmenities: {
        petFriendly: true,
        clubhouse: false,
        bbqArea: true,
        laundryFacility: false,
        doorman: false,
        studyRoom: false,
      },
    },
    dateAdded: "2023-12-15",
    lastUpdated: "2025-03-10",
  },
  {
    id: "PROP-0012",
    name: "Tech Center Office",
    type: "commercial",
    status: "available",
    address: {
      street: "789 Technology Square",
      unit: "Suite 400",
      city: "Boston",
      state: "MA",
      postalCode: "02210",
      country: "us",
    },
    manager: "Michael Davis",
    yearBuilt: 2015,
    financials: {
      purchasePrice: 1450000,
      purchaseDate: "2021-09-15",
      marketValue: 1600000,
      rentAmount: 8500,
      propertyTax: 21000,
    },
    details: {
      totalArea: 4200,
      floors: 1,
    },
    dateAdded: "2024-01-10",
    lastUpdated: "2025-04-01",
  },
  {
    id: "PROP-0013",
    name: "Mountain View Residence",
    type: "house",
    status: "maintenance",
    address: {
      street: "123 Mountain Road",
      city: "Aspen",
      state: "CO",
      postalCode: "81611",
      country: "us",
    },
    manager: "Sarah Johnson",
    yearBuilt: 2000,
    financials: {
      purchasePrice: 1750000,
      purchaseDate: "2019-12-10",
      marketValue: 2300000,
      rentAmount: 9500,
      securityDeposit: 19000,
      propertyTax: 28000,
    },
    details: {
      bedrooms: 5,
      bathrooms: 4.5,
      totalArea: 4500,
      lotSize: 25000,
      floors: 3,
      garageSpaces: 3,
    },
    amenities: {
      interiorAmenities: {
        airConditioning: true,
        heating: true,
        washerDryer: true,
        dishwasher: true,
        fireplace: true,
        hardwoodFloors: true,
        furnished: false,
        storageSpace: true,
        walkInCloset: true,
      },
      exteriorAmenities: {
        swimmingPool: false,
        fitnessCenter: false,
        elevator: false,
        balconyPatio: true,
        parking: false,
        garden: true,
        securitySystem: true,
        playground: false,
      },
      communityAmenities: {
        petFriendly: true,
        clubhouse: false,
        bbqArea: false,
        laundryFacility: false,
        doorman: false,
        studyRoom: false,
      },
    },
    dateAdded: "2024-02-05",
    lastUpdated: "2025-03-25",
  },
  {
    id: "PROP-0014",
    name: "Student Housing Complex",
    type: "apartment",
    status: "occupied",
    address: {
      street: "500 University Drive",
      city: "Ann Arbor",
      state: "MI",
      postalCode: "48109",
      country: "us",
    },
    manager: "Michael Davis",
    yearBuilt: 2016,
    financials: {
      purchasePrice: 3500000,
      purchaseDate: "2019-05-20",
      marketValue: 4200000,
      rentAmount: 850,
      securityDeposit: 1700,
      propertyTax: 45000,
    },
    details: {
      bedrooms: 1,
      bathrooms: 1,
      totalArea: 450,
      floors: 5,
      garageSpaces: 40,
    },
    amenities: {
      interiorAmenities: {
        airConditioning: true,
        heating: false,
        washerDryer: true,
        dishwasher: true,
        fireplace: false,
        hardwoodFloors: false,
        furnished: false,
        storageSpace: false,
        walkInCloset: false,
      },
      exteriorAmenities: {
        swimmingPool: false,
        fitnessCenter: true,
        elevator: true,
        balconyPatio: false,
        parking: false,
        garden: false,
        securitySystem: true,
        playground: false,
      },
      communityAmenities: {
        petFriendly: false,
        clubhouse: false,
        bbqArea: false,
        laundryFacility: true,
        doorman: false,
        studyRoom: true,
      },
    },
    description:
      "Student housing complex with 40 units near university campus. Each unit is a 1 bedroom, 1 bathroom apartment with standard amenities. Property includes study rooms and fitness center.",
    dateAdded: "2024-03-10",
    lastUpdated: "2025-03-15",
  },
  {
    id: "PROP-0015",
    name: "Suburban Strip Mall",
    type: "commercial",
    status: "available",
    address: {
      street: "7890 Retail Road",
      city: "Phoenix",
      state: "AZ",
      postalCode: "85001",
      country: "us",
    },
    manager: "Jonathan Smith",
    yearBuilt: 2010,
    financials: {
      purchasePrice: 2850000,
      purchaseDate: "2020-08-12",
      marketValue: 3100000,
      rentAmount: 18500,
      propertyTax: 38000,
    },
    details: {
      totalArea: 12000,
      lotSize: 35000,
      floors: 1,
    },
    description:
      "Suburban strip mall with 8 retail spaces. Currently at 75% occupancy with stable tenants including a pharmacy, restaurant, and salon. High traffic area with ample parking.",
    dateAdded: "2024-04-01",
    lastUpdated: "2025-04-05",
  },
];

// Column definitions for property table display
export const propertyColumns = [
  { title: "Name", dataIndex: "name" },
  {
    title: "Type",
    dataIndex: "type",
    render: (type: string) => type.charAt(0).toUpperCase() + type.slice(1),
  },
  {
    title: "Address",
    dataIndex: "address",
    render: (address: any) =>
      `${address.street}, ${address.city}, ${address.state}`,
  },
  {
    title: "Details",
    dataIndex: "details",
    render: (details: any, record: Property) => {
      if (record.type === "commercial" || record.type === "industrial") {
        return `${details?.totalArea || 0} sq ft`;
      }
      return `${details?.bedrooms || 0} bed, ${details?.bathrooms || 0} bath, ${
        details?.totalArea || 0
      } sq ft`;
    },
  },
  { title: "Status", dataIndex: "status", isStatus: true },
  {
    title: "Action",
    dataIndex: "id",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render: (_: string) => "View | Edit",
  },
];

export const defaultFormData = {
  // Authentication Forms
  auth: {
    login: {
      email: "zlatan@example.com",
      password: "password",
      rememberMe: false,
      otpCode: "",
    },
    register: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      cpassword: "password123",
      phoneNumber: "+1234567890",
      location: "New York, NY, United States",
      displayName: "JohnDoe",
      accountType: {
        planId: "plan_basic",
        planName: "Basic Plan",
        isCorporate: false,
      },
      companyProfile: {
        tradingName: "Doe Real Estate",
        legalEntityName: "Doe Real Estate LLC",
        website: "https://www.doerealestate.com",
        companyEmail: "info@doerealestate.com",
        companyPhone: "+1234567890",
        companyAddress: "123 Business St, New York, NY 10001",
      },
    },
    forgotPassword: {
      email: "john.doe@example.com",
    },
    resetPassword: {
      password: "newpassword123",
      cpassword: "newpassword123",
      token: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    },
    accountActivation: {
      token: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
      cuid: "123e4567-e89b-12d3-a456-426614174000",
    },
  },

  // Property Forms
  property: {
    basic: {
      name: "Sunset Apartments",
      propertyType: "apartment",
      status: "active",
      yearBuilt: 2015,
      address: {
        unitNumber: "Suite 100",
        street: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        postCode: "90210",
        country: "US",
        coordinates: [-118.2437, 34.0522],
        fullAddress:
          "456 Oak Avenue, Suite 100, Los Angeles, CA 90210, United States",
      },
      financialDetails: {
        purchasePrice: 850000,
        purchaseDate: "2020-03-15",
        marketValue: 950000,
        propertyTax: 8500,
        lastAssessmentDate: "2024-01-15",
      },
      fees: {
        currency: "USD",
        taxAmount: "8500.00",
        rentalAmount: "2500.00",
        managementFees: "250.00",
        securityDeposit: "5000.00",
      },
      specifications: {
        totalArea: 1200,
        lotSize: 5000,
        bedrooms: 2,
        bathrooms: 2,
        floors: 1,
        garageSpaces: 1,
        maxOccupants: 4,
      },
      utilities: {
        water: true,
        gas: true,
        electricity: true,
        internet: true,
        trash: true,
        cableTV: false,
      },
      description: {
        text: "Beautiful apartment complex in prime location with modern amenities and excellent access to public transportation.",
        html: "<p>Beautiful apartment complex in prime location with modern amenities and excellent access to public transportation.</p>",
      },
      occupancyStatus: "occupied",
      maxAllowedUnits: 24,
      interiorAmenities: {
        airConditioning: true,
        heating: true,
        washerDryer: true,
        dishwasher: true,
        fridge: true,
        furnished: false,
        storageSpace: true,
      },
      communityAmenities: {
        swimmingPool: true,
        fitnessCenter: true,
        elevator: true,
        parking: true,
        securitySystem: true,
        petFriendly: true,
        laundryFacility: true,
        doorman: false,
      },
      documents: [],
      images: [],
    },
    commercial: {
      name: "Downtown Business Center",
      propertyType: "commercial",
      status: "active",
      yearBuilt: 2010,
      address: {
        unitNumber: "Floor 5",
        street: "789 Business Boulevard",
        city: "San Francisco",
        state: "CA",
        postCode: "94102",
        country: "US",
        coordinates: [-122.4194, 37.7749],
        fullAddress:
          "789 Business Boulevard, Floor 5, San Francisco, CA 94102, United States",
      },
      financialDetails: {
        purchasePrice: 2500000,
        purchaseDate: "2018-06-01",
        marketValue: 2800000,
        propertyTax: 28000,
        lastAssessmentDate: "2024-01-15",
      },
      fees: {
        currency: "USD",
        taxAmount: "28000.00",
        rentalAmount: "8000.00",
        managementFees: "800.00",
        securityDeposit: "16000.00",
      },
      specifications: {
        totalArea: 5000,
        lotSize: 0,
        bedrooms: 0,
        bathrooms: 4,
        floors: 2,
        garageSpaces: 20,
        maxOccupants: 100,
      },
      utilities: {
        water: true,
        gas: true,
        electricity: true,
        internet: true,
        trash: true,
        cableTV: false,
      },
      description: {
        text: "Premium commercial space in the heart of downtown with modern facilities and excellent accessibility.",
        html: "<p>Premium commercial space in the heart of downtown with modern facilities and excellent accessibility.</p>",
      },
      occupancyStatus: "occupied",
      maxAllowedUnits: 1,
      interiorAmenities: {
        airConditioning: true,
        heating: true,
        washerDryer: false,
        dishwasher: false,
        fridge: false,
        furnished: false,
        storageSpace: true,
      },
      communityAmenities: {
        swimmingPool: false,
        fitnessCenter: false,
        elevator: true,
        parking: true,
        securitySystem: true,
        petFriendly: false,
        laundryFacility: false,
        doorman: true,
      },
      documents: [],
      images: [],
    },
  },

  // Unit Forms
  unit: {
    residential: {
      unitNumber: "A101",
      unitType: "residential",
      status: "available",
      floor: 1,
      isActive: true,
      puid: "prop_123456789012345678901234567890",
      specifications: {
        totalArea: 850,
        rooms: 2,
        bathrooms: 1,
        maxOccupants: 3,
      },
      amenities: {
        airConditioning: true,
        heating: true,
        washerDryer: true,
        dishwasher: true,
        parking: true,
        storage: true,
        cableTV: false,
        internet: true,
      },
      utilities: {
        gas: true,
        trash: true,
        water: true,
        heating: true,
        centralAC: true,
      },
      fees: {
        currency: "USD",
        rentAmount: 1800,
        securityDeposit: 3600,
      },
      description:
        "Modern residential unit with updated appliances and beautiful city views.",
    },
    commercial: {
      unitNumber: "B201",
      unitType: "commercial",
      status: "available",
      floor: 2,
      isActive: true,
      puid: "prop_123456789012345678901234567890",
      specifications: {
        totalArea: 1200,
        rooms: 4,
        bathrooms: 2,
        maxOccupants: 20,
      },
      amenities: {
        airConditioning: true,
        heating: true,
        washerDryer: false,
        dishwasher: false,
        parking: true,
        storage: true,
        cableTV: true,
        internet: true,
      },
      utilities: {
        gas: true,
        trash: true,
        water: true,
        heating: true,
        centralAC: true,
      },
      fees: {
        currency: "USD",
        rentAmount: 3500,
        securityDeposit: 7000,
      },
      description: "Prime commercial space ideal for office or retail use.",
    },
    studio: {
      unitNumber: "S305",
      unitType: "studio",
      status: "available",
      floor: 3,
      isActive: true,
      puid: "prop_123456789012345678901234567890",
      specifications: {
        totalArea: 450,
        rooms: 1,
        bathrooms: 1,
        maxOccupants: 2,
      },
      amenities: {
        airConditioning: true,
        heating: true,
        washerDryer: false,
        dishwasher: true,
        parking: false,
        storage: false,
        cableTV: false,
        internet: true,
      },
      utilities: {
        gas: true,
        trash: true,
        water: true,
        heating: true,
        centralAC: true,
      },
      fees: {
        currency: "USD",
        rentAmount: 1200,
        securityDeposit: 2400,
      },
      description:
        "Cozy studio apartment perfect for single professionals or couples.",
    },
  },

  // Client Forms
  client: {
    individual: {
      displayName: "John Doe Properties",
      identification: {
        idType: "driverLicense",
        idNumber: "DL123456789",
        authority: "California DMV",
        issuingState: "CA",
        issueDate: "2020-01-15",
        expiryDate: "2025-01-15",
        dataProcessingConsent: true,
        processingConsentDate: "2024-01-01",
      },
      settings: {
        notificationPreferences: {
          email: true,
          sms: true,
          inApp: true,
        },
        timeZone: "America/Los_Angeles",
        lang: "en",
      },
    },
    corporate: {
      displayName: "Sunrise Properties Inc",
      identification: {
        idType: "businessRegistration",
        idNumber: "BR987654321",
        authority: "California Secretary of State",
        issuingState: "CA",
        issueDate: "2018-03-01",
        expiryDate: "2028-03-01",
        dataProcessingConsent: true,
        processingConsentDate: "2024-01-01",
      },
      companyProfile: {
        legalEntityName: "Sunrise Properties Incorporated",
        tradingName: "Sunrise Properties",
        companyEmail: "info@sunriseproperties.com",
        registrationNumber: "C3456789",
        website: "https://www.sunriseproperties.com",
        companyPhone: "+1555123456",
        contactInfo: {
          email: "contact@sunriseproperties.com",
          phoneNumber: "+1555123456",
          contactPerson: "Sarah Johnson",
        },
      },
      settings: {
        notificationPreferences: {
          email: true,
          sms: false,
          inApp: true,
        },
        timeZone: "America/Los_Angeles",
        lang: "en",
      },
    },
  },

  // Invitation Forms
  invitation: {
    employees: [
      {
        personalInfo: {
          firstName: "Michael",
          lastName: "Johnson",
          phoneNumber: "+1555234567",
        },
        inviteeEmail: "michael.johnson@example.com",
        role: "staff",
        employeeInfo: {
          jobTitle: "Property Manager",
          department: "Operations",
          permissions: [
            "view_properties",
            "manage_tenants",
            "generate_reports",
          ],
          employeeId: "EMP001",
          reportsTo: "Sarah Wilson",
          startDate: new Date("2024-02-01"),
        },
        status: "draft",
        metadata: {
          inviteMessage:
            "Welcome to our property management team! We're excited to have you join us.",
          expectedStartDate: new Date("2024-02-01"),
        },
      },
      {
        personalInfo: {
          firstName: "Emily",
          lastName: "Chen",
          phoneNumber: "+1555345678",
        },
        inviteeEmail: "emily.chen@example.com",
        role: "staff",
        status: "draft",
        employeeInfo: {
          jobTitle: "Maintenance Coordinator",
          department: "Maintenance",
          permissions: [
            "view_properties",
            "manage_maintenance",
            "schedule_repairs",
          ],
          employeeId: "EMP002",
          reportsTo: "David Rodriguez",
          startDate: new Date("2024-02-15"),
        },
        metadata: {
          inviteMessage:
            "Join our maintenance team and help keep our properties in top condition.",
          expectedStartDate: new Date("2024-02-15"),
        },
      },
      {
        personalInfo: {
          firstName: "David",
          lastName: "Rodriguez",
          phoneNumber: "+1555456789",
        },
        inviteeEmail: "david.rodriguez@example.com",
        role: "manager",
        status: "pending",
        employeeInfo: {
          jobTitle: "Maintenance Supervisor",
          department: "Maintenance",
          permissions: [
            "view_properties",
            "manage_maintenance",
            "approve_repairs",
            "manage_vendors",
          ],
          employeeId: "EMP003",
          reportsTo: "Sarah Wilson",
          startDate: new Date("2024-01-15"),
        },
        metadata: {
          inviteMessage:
            "Lead our maintenance operations and ensure excellent service delivery.",
          expectedStartDate: new Date("2024-01-15"),
        },
      },
      {
        personalInfo: {
          firstName: "Lisa",
          lastName: "Thompson",
          phoneNumber: "+1555567890",
        },
        status: "pending",
        inviteeEmail: "lisa.thompson@example.com",
        role: "staff",
        employeeInfo: {
          jobTitle: "Leasing Agent",
          department: "Leasing",
          permissions: [
            "view_properties",
            "manage_tenants",
            "process_applications",
          ],
          employeeId: "EMP004",
          reportsTo: "Michael Johnson",
          startDate: new Date("2024-03-01"),
        },
        metadata: {
          inviteMessage:
            "Help us find great tenants for our properties and provide excellent customer service.",
          expectedStartDate: new Date("2024-03-01"),
        },
      },
      {
        personalInfo: {
          firstName: "Robert",
          lastName: "Kim",
          phoneNumber: "+1555678901",
        },
        status: "draft",
        inviteeEmail: "robert.kim@example.com",
        role: "staff",
        employeeInfo: {
          jobTitle: "Financial Analyst",
          department: "Finance",
          permissions: [
            "view_properties",
            "manage_finances",
            "generate_reports",
          ],
          employeeId: "EMP005",
          reportsTo: "Sarah Wilson",
          startDate: new Date("2024-02-20"),
        },
        metadata: {
          inviteMessage:
            "Analyze our property financials and help optimize our investment returns.",
          expectedStartDate: new Date("2024-02-20"),
        },
      },
    ],
    vendors: [
      {
        personalInfo: {
          firstName: "James",
          lastName: "Miller",
          phoneNumber: "+1555789012",
        },
        inviteeEmail: "james@reliableplumbing.com",
        role: "vendor",
        vendorInfo: {
          companyName: "Reliable Plumbing Services",
          businessType: "llc",
          primaryService: "plumbing",
          contactPerson: {
            name: "James Miller",
            jobTitle: "Owner",
            email: "james@reliableplumbing.com",
            phone: "+1555789012",
          },
        },
        status: "draft",
        metadata: {
          inviteMessage:
            "We'd like to add your plumbing services to our preferred vendor network.",
          expectedStartDate: new Date("2024-02-01"),
        },
      },
      {
        personalInfo: {
          firstName: "Maria",
          lastName: "Garcia",
          phoneNumber: "+1555890123",
        },
        inviteeEmail: "maria@sparklingclean.com",
        role: "vendor",
        vendorInfo: {
          companyName: "Sparkling Clean Services",
          businessType: "corporation",
          primaryService: "cleaning",
          contactPerson: {
            name: "Maria Garcia",
            jobTitle: "Operations Manager",
            email: "maria@sparklingclean.com",
            phone: "+1555890123",
          },
        },
        status: "pending",
        metadata: {
          inviteMessage:
            "Join our network of cleaning professionals and help maintain our properties.",
          expectedStartDate: new Date("2024-02-10"),
        },
      },
      {
        personalInfo: {
          firstName: "Thomas",
          lastName: "Wilson",
          phoneNumber: "+1555901234",
        },
        inviteeEmail: "tom@wilsonelectric.com",
        role: "vendor",
        vendorInfo: {
          companyName: "Wilson Electrical Solutions",
          businessType: "partnership",
          primaryService: "electrical",
          contactPerson: {
            name: "Thomas Wilson",
            jobTitle: "Lead Electrician",
            email: "tom@wilsonelectric.com",
            phone: "+1555901234",
          },
        },
        status: "pending",
        metadata: {
          inviteMessage:
            "We need reliable electrical services for our property portfolio.",
          expectedStartDate: new Date("2024-02-05"),
        },
      },
      {
        personalInfo: {
          firstName: "Jennifer",
          lastName: "Brown",
          phoneNumber: "+1555012345",
        },
        inviteeEmail: "jennifer@greenlawncare.com",
        role: "vendor",
        status: "draft",
        vendorInfo: {
          companyName: "Green Lawn Care & Landscaping",
          businessType: "llc",
          primaryService: "landscaping",
          contactPerson: {
            name: "Jennifer Brown",
            jobTitle: "General Manager",
            email: "jennifer@greenlawncare.com",
            phone: "+1555012345",
          },
        },
        metadata: {
          inviteMessage:
            "Help us maintain beautiful outdoor spaces at our properties.",
          expectedStartDate: new Date("2024-03-01"),
        },
      },
      {
        personalInfo: {
          firstName: "Carlos",
          lastName: "Rodriguez",
          phoneNumber: "+1555123456",
        },
        inviteeEmail: "carlos@hvacpros.com",
        role: "vendor",
        status: "draft",
        vendorInfo: {
          companyName: "HVAC Professionals Inc",
          businessType: "corporation",
          primaryService: "hvac",
          contactPerson: {
            name: "Carlos Rodriguez",
            jobTitle: "Service Manager",
            email: "carlos@hvacpros.com",
            phone: "+1555123456",
          },
        },
        metadata: {
          inviteMessage:
            "We need skilled HVAC technicians for our property maintenance needs.",
          expectedStartDate: new Date("2024-02-12"),
        },
      },
    ],
  },

  csvUpload: {
    property: {
      cuid: "123e4567-e89b-12d3-a456-426614174000",
      csvFile: null,
    },
  },
};

// Helper function to get default data by path
export const getDefaultData = (path: string): any => {
  const keys = path.split(".");
  let current: any = defaultFormData;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }

  return current;
};

// Helper function to get random item from array (useful for multiple datasets)
export const getRandomDefault = (path: string): any => {
  const data = getDefaultData(path);
  if (Array.isArray(data)) {
    return data[Math.floor(Math.random() * data.length)];
  }
  return data;
};

// Environment check - only use in development
export const shouldUseDefaultData = () => {
  return process.env.NODE_ENV === "development";
};
