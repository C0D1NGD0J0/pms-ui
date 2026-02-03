import axios from "@configs/axios";
import { subscriptionService } from "@services/subscription";
import { ISubscriptionPlan } from "@interfaces/subscription.interface";

jest.mock("@configs/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("SubscriptionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getSubscriptionPlans", () => {
    it("should fetch subscription plans successfully", async () => {
      const mockPlansData: ISubscriptionPlan[] = [
        {
          planName: "personal",
          name: "Personal",
          description: "Perfect for individual landlords",
          displayOrder: 1,
          isFeatured: false,
          ctaText: "Get Started Free",
          featureList: ["Up to 1 property", "Basic tenant screening"],
          trialDays: 0,
          priceInCents: 0,
          transactionFeePercent: 0,
          isCustomPricing: false,
          seatPricing: {
            includedSeats: 1,
            additionalSeatPriceCents: 0,
            maxAdditionalSeats: 0,
          },
          limits: {
            maxProperties: 1,
            maxUnits: 1,
            maxVendors: 5,
          },
          entitlements: {
            tenantScreening: true,
            RepairRequestService: false,
          },
          pricing: {
            monthly: {
              priceId: null,
              priceInCents: 0,
              displayPrice: "$0",
              lookUpKey: null,
            },
            annual: {
              priceId: null,
              priceInCents: 0,
              displayPrice: "$0",
              savingsPercent: 0,
              savingsDisplay: "Save 0%",
              lookUpKey: null,
            },
          },
        },
        {
          planName: "growth",
          name: "Growth",
          description: "For growing landlords",
          displayOrder: 2,
          isFeatured: false,
          ctaText: "Get Started",
          featureList: ["Up to 5 properties", "2 team members", "Basic reporting"],
          trialDays: 0,
          priceInCents: 799,
          transactionFeePercent: 0,
          isCustomPricing: false,
          seatPricing: {
            includedSeats: 2,
            additionalSeatPriceCents: 500,
            maxAdditionalSeats: 5,
          },
          limits: {
            maxProperties: 5,
            maxUnits: 20,
            maxVendors: 10,
          },
          entitlements: {
            tenantScreening: true,
            RepairRequestService: false,
          },
          pricing: {
            monthly: {
              priceId: "price_growth_monthly",
              priceInCents: 799,
              displayPrice: "$7.99",
              lookUpKey: "growth_monthly",
            },
            annual: {
              priceId: "price_growth_annual",
              priceInCents: 7680,
              displayPrice: "$7.68",
              savingsPercent: 20,
              savingsDisplay: "Save 20%",
              lookUpKey: "growth_annual",
            },
          },
        },
        {
          planName: "portfolio",
          name: "Portfolio",
          description: "Most popular choice",
          displayOrder: 3,
          isFeatured: true,
          featuredBadge: "Most Popular",
          ctaText: "Start Trial",
          featureList: [
            "Up to 25 properties",
            "10 team members",
            "Advanced reporting",
            "Priority support",
          ],
          disabledFeatures: ["White-label branding"],
          trialDays: 14,
          priceInCents: 599,
          transactionFeePercent: 0,
          isCustomPricing: false,
          seatPricing: {
            includedSeats: 10,
            additionalSeatPriceCents: 800,
            maxAdditionalSeats: 50,
          },
          limits: {
            maxProperties: 25,
            maxUnits: 100,
            maxVendors: 50,
          },
          entitlements: {
            tenantScreening: true,
            RepairRequestService: true,
          },
          pricing: {
            monthly: {
              priceId: "price_portfolio_monthly",
              priceInCents: 599,
              displayPrice: "$5.99",
              lookUpKey: "portfolio_monthly",
            },
            annual: {
              priceId: "price_portfolio_annual",
              priceInCents: 14400,
              displayPrice: "$14.40",
              savingsPercent: 20,
              savingsDisplay: "Save 20%",
              lookUpKey: "portfolio_annual",
            },
          },
        },
      ];

      const mockResponse = {
        data: {
          success: true,
          data: mockPlansData,
          pagination: {
            total: 2,
            page: 1,
            limit: 10,
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await subscriptionService.getSubscriptionPlans();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/api/v1/subscriptions/plans",
        {}
      );
      expect(result.data).toEqual(mockPlansData);
      expect(result.pagination?.total).toBe(2);
    });

    it("should call API without query string when no params provided", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await subscriptionService.getSubscriptionPlans();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/api/v1/subscriptions/plans",
        {}
      );
    });

    it("should handle errors when fetching subscription plans fails", async () => {
      const mockError = new Error("Network error");
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(
        subscriptionService.getSubscriptionPlans()
      ).rejects.toThrow("Network error");

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching subscription plans:",
        mockError
      );
    });
  });

  describe("manageSeats", () => {
    it("should successfully purchase additional seats", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            additionalSeatsCount: 5,
            currentSeats: 15,
            additionalSeatsCost: 5000,
            totalMonthlyPrice: 9900,
            billingInterval: "monthly" as const,
            paymentGateway: {
              seatItemId: "item_123",
            },
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await subscriptionService.manageSeats("test-cuid", 5);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/subscriptions/test-cuid/seats",
        { seatDelta: 5 },
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should successfully remove seats", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            additionalSeatsCount: 0,
            currentSeats: 10,
            additionalSeatsCost: 0,
            totalMonthlyPrice: 4900,
            billingInterval: "monthly" as const,
            paymentGateway: {
              seatItemId: "item_123",
            },
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await subscriptionService.manageSeats("test-cuid", -3);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/subscriptions/test-cuid/seats",
        { seatDelta: -3 },
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle zero seat delta", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            additionalSeatsCount: 2,
            currentSeats: 12,
            additionalSeatsCost: 2000,
            totalMonthlyPrice: 6900,
            billingInterval: "monthly" as const,
            paymentGateway: {
              seatItemId: "item_123",
            },
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await subscriptionService.manageSeats("test-cuid", 0);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/subscriptions/test-cuid/seats",
        { seatDelta: 0 },
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle errors when managing seats fails", async () => {
      const mockError = new Error("Insufficient seats available");
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(
        subscriptionService.manageSeats("test-cuid", 100)
      ).rejects.toThrow("Insufficient seats available");

      expect(console.error).toHaveBeenCalledWith(
        "Error managing seats:",
        mockError
      );
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network timeout");
      mockedAxios.post.mockRejectedValue(networkError);

      await expect(
        subscriptionService.manageSeats("test-cuid", 1)
      ).rejects.toThrow("Network timeout");
    });

    it("should call API with correct endpoint for different cuids", async () => {
      const mockResponse = {
        data: { success: true, data: {} },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await subscriptionService.manageSeats("client-123", 2);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/subscriptions/client-123/seats",
        { seatDelta: 2 },
        {}
      );

      await subscriptionService.manageSeats("client-456", -1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/subscriptions/client-456/seats",
        { seatDelta: -1 },
        {}
      );
    });
  });
});
