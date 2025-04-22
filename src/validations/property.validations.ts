import { z } from "zod";

export const propertySchema = z.object({
  cid: z.string(),
  name: z.string().min(5, "Property name is required"),
  propertyType: z.enum(
    [
      "apartment",
      "house",
      "condominium",
      "townhouse",
      "commercial",
      "industrial",
    ],
    {
      required_error: "Property type is required",
    }
  ),
  status: z
    .enum(["available", "occupied", "maintenance", "construction", "inactive"])
    .default("available"),
  managedBy: z.string().optional(),
  yearBuilt: z
    .number()
    .min(1800)
    .max(new Date().getFullYear() + 10)
    .optional(),

  address: z
    .string()
    .min(10, "Address is required and must be at least 10 characters"),
  unitApartment: z.string().optional(),
  city: z.string().optional(),
  stateProvince: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default("us"),

  financialDetails: z.object({
    purchasePrice: z.number().min(0).optional(),
    purchaseDate: z.string().optional(),
    marketValue: z.number().min(0).optional(),
    propertyTax: z.number().min(0).optional(),
    lastAssessmentDate: z.string().optional(),
  }),

  specifications: z.object({
    totalArea: z.number().min(0, "Total area is required"),
    lotSize: z.number().min(0).optional(),
    bedrooms: z.number().min(0).default(0),
    bathrooms: z.number().min(0).default(0),
    floors: z.number().min(1).default(1),
    garageSpaces: z.number().min(0).default(0),
    maxOccupants: z.number().min(1).optional(),
  }),
  utilities: z.object({
    water: z.boolean().default(false),
    gas: z.boolean().default(false),
    electricity: z.boolean().default(false),
    internet: z.boolean().default(false),
    trash: z.boolean().default(false),
    cableTV: z.boolean().default(false),
  }),
  description: z.object({
    text: z.string().optional(),
    html: z.string().optional(),
  }),

  occupancyStatus: z
    .enum(["vacant", "occupied", "partially_occupied"])
    .default("vacant"),
  occupancyRate: z.number().min(0).max(100).default(0),

  interiorAmenities: z.object({
    airConditioning: z.boolean().default(false),
    heating: z.boolean().default(false),
    washerDryer: z.boolean().default(false),
    dishwasher: z.boolean().default(false),
    fridge: z.boolean().default(false),
    furnished: z.boolean().default(false),
    storageSpace: z.boolean().default(false),
  }),
  communityAmenities: z.object({
    swimmingPool: z.boolean().default(false),
    fitnessCenter: z.boolean().default(false),
    elevator: z.boolean().default(false),
    parking: z.boolean().default(false),
    securitySystem: z.boolean().default(false),
    petFriendly: z.boolean().default(false),
    laundryFacility: z.boolean().default(false),
    doorman: z.boolean().default(false),
  }),

  // Documents Tab
  documents: z
    .array(
      z.object({
        documentType: z
          .enum(["deed", "tax", "insurance", "inspection", "other", "lease"])
          .optional(),
        description: z.string().optional(),
        externalUrl: z.string().url().optional(),
        file: z.any().optional(),
      })
    )
    .default([]),

  propertyImages: z.array(z.any()).default([]),
});
