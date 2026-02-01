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
          planName: "starter",
          name: "Starter",
          description: "For growing property managers",
          displayOrder: 2,
          isFeatured: true,
          featuredBadge: "Most Popular",
          ctaText: "Start Free Trial",
          featureList: [
            "Up to 25 properties",
            "Advanced tenant screening",
            "Maintenance tracking",
          ],
          trialDays: 14,
          priceInCents: 4900,
          transactionFeePercent: 0,
          isCustomPricing: false,
          seatPricing: {
            includedSeats: 3,
            additionalSeatPriceCents: 1000,
            maxAdditionalSeats: 10,
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
              priceId: "price_starter_monthly",
              priceInCents: 4900,
              displayPrice: "$49",
              lookUpKey: "starter_monthly",
            },
            annual: {
              priceId: "price_starter_annual",
              priceInCents: 46800,
              displayPrice: "$468",
              savingsPercent: 20,
              savingsDisplay: "Save 20%",
              lookUpKey: "starter_annual",
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
            additionalSeats: 5,
            totalSeats: 15,
            additionalSeatsCost: 5000,
            totalMonthlyPrice: 9900,
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await subscriptionService.manageSeats("test-cuid", 5);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/subscription/test-cuid/seats",
        { seatDelta: 5 },
        {}
      );
      expect(result.data).toEqual(mockResponse.data);
    });

    it("should successfully remove seats", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            additionalSeats: 0,
            totalSeats: 10,
            additionalSeatsCost: 0,
            totalMonthlyPrice: 4900,
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await subscriptionService.manageSeats("test-cuid", -3);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/subscription/test-cuid/seats",
        { seatDelta: -3 },
        {}
      );
      expect(result.data).toEqual(mockResponse.data);
    });

    it("should handle zero seat delta", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            additionalSeats: 2,
            totalSeats: 12,
            additionalSeatsCost: 2000,
            totalMonthlyPrice: 6900,
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await subscriptionService.manageSeats("test-cuid", 0);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/subscription/test-cuid/seats",
        { seatDelta: 0 },
        {}
      );
      expect(result.data).toEqual(mockResponse.data);
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
        "/api/v1/subscription/client-123/seats",
        { seatDelta: 2 },
        {}
      );

      await subscriptionService.manageSeats("client-456", -1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/subscription/client-456/seats",
        { seatDelta: -1 },
        {}
      );
    });
  });
});
