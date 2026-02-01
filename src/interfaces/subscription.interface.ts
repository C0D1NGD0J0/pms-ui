export interface ISubscriptionPlan {
  seatPricing: {
    includedSeats: number;
    additionalSeatPriceCents: number;
    maxAdditionalSeats: number;
  };
  limits: {
    maxProperties: number;
    maxUnits: number;
    maxVendors: number;
  };
  pricing: {
    monthly: {
      priceId: any;
      lookUpKey: any;
      priceInCents: number;
      displayPrice: string;
    };
    annual: {
      priceId: any;
      lookUpKey: any;
      priceInCents: number;
      displayPrice: string;
      savings: number;
    };
  };
  transactionFeePercent: number;
  disabledFeatures?: string[];
  isCustomPricing: boolean;
  featuredBadge?: string;
  featureList: string[];
  displayOrder: number;
  description: string;
  isFeatured: boolean;
  planName: PlanName;
  trialDays: number;
  ctaText: string;
  name: string;
}

export interface ISubscription {
  paymentGateway: string;
  additionalSeatsCount: number;
  status: "active" | "inactive";
  customPriceInCents?: number;
  additionalSeatsCost: number;
  paymentGatewayId?: string;
  totalMonthlyPrice: number;
  currentProperties: number;
  client: string;
  currentSeats: number;
  currentUnits: number;
  planName: PlanName;
  canceledAt?: Date;
  startDate: Date;
  planId: string;
  endDate: Date;
  cuid: string;

  suid: string;
}

export type PlanName = "essential" | "growth" | "portfolio";

// Actual API response structure (what server currently sends)
export interface IServerSubscriptionPlan {
  planName: string;
  name: string;
  description: string;
  trialDays: number;
  ctaText: string;
  isFeatured: boolean;
  featuredBadge?: string;
  displayOrder: number;
  priceInCents: number;
  transactionFeePercent: number;
  isCustomPricing: boolean;
  seatPricing: {
    includedSeats: number;
    additionalSeatPriceCents: number;
    maxAdditionalSeats: number;
  };
  limits: {
    maxProperties: number;
    maxUnits: number;
    maxVendors: number;
  };
  entitlements: Record<string, boolean>;
  featureList: string[];
  disabledFeatures?: string[];
  pricing: {
    monthly: {
      priceId: string | null;
      priceInCents: number;
      displayPrice: string;
      lookUpKey: string | null;
    };
    annual: {
      priceId: string | null;
      priceInCents: number;
      displayPrice: string;
      savingsPercent: number;
      savingsDisplay: string;
      lookUpKey: string | null;
    };
  };
}
