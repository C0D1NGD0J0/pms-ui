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
