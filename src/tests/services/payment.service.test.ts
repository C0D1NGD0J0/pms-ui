import { axiosAuth } from "@configs/axios";
import { paymentService } from "@services/payment";

jest.mock("@configs/axios");

const mockAxiosAuth = axiosAuth as jest.Mocked<typeof axiosAuth>;

describe("Payment Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createConnectAccount", () => {
    it("should create a connect account successfully", async () => {
      const mockResponse = {
        success: true,
        data: {
          accountId: "acct_123456",
          message: "Connect account created successfully",
        },
      };

      mockAxiosAuth.post.mockResolvedValue(mockResponse);

      const result = await paymentService.createConnectAccount("test-cuid", {
        email: "test@example.com",
        country: "US",
        businessType: "company",
      });

      expect(mockAxiosAuth.post).toHaveBeenCalledWith(
        "/subscriptions/test-cuid/payment/connect-account",
        {
          email: "test@example.com",
          country: "US",
          businessType: "company",
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle individual business type", async () => {
      const mockResponse = {
        success: true,
        data: {
          accountId: "acct_789",
          message: "Connect account created successfully",
        },
      };

      mockAxiosAuth.post.mockResolvedValue(mockResponse);

      await paymentService.createConnectAccount("test-cuid", {
        email: "individual@example.com",
        country: "US",
        businessType: "individual",
      });

      expect(mockAxiosAuth.post).toHaveBeenCalledWith(
        "/subscriptions/test-cuid/payment/connect-account",
        {
          email: "individual@example.com",
          country: "US",
          businessType: "individual",
        }
      );
    });

    it("should throw error when account creation fails", async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: "Failed to create account",
          },
        },
      };

      mockAxiosAuth.post.mockRejectedValue(mockError);

      await expect(
        paymentService.createConnectAccount("test-cuid", {
          email: "test@example.com",
          country: "US",
          businessType: "company",
        })
      ).rejects.toEqual(mockError);
    });
  });

  describe("getOnboardingLink", () => {
    it("should get onboarding link successfully", async () => {
      const mockResponse = {
        success: true,
        data: {
          url: "https://connect.stripe.com/setup/s/123456",
        },
      };

      mockAxiosAuth.post.mockResolvedValue(mockResponse);

      const result = await paymentService.getOnboardingLink("test-cuid");

      expect(mockAxiosAuth.post).toHaveBeenCalledWith(
        "/subscriptions/test-cuid/payment/onboarding-link"
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle onboarding link error", async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: "Account not found",
          },
        },
      };

      mockAxiosAuth.post.mockRejectedValue(mockError);

      await expect(
        paymentService.getOnboardingLink("test-cuid")
      ).rejects.toEqual(mockError);
    });

    it("should work with different cuids", async () => {
      const mockResponse = {
        success: true,
        data: {
          url: "https://connect.stripe.com/setup/s/different",
        },
      };

      mockAxiosAuth.post.mockResolvedValue(mockResponse);

      await paymentService.getOnboardingLink("different-cuid");

      expect(mockAxiosAuth.post).toHaveBeenCalledWith(
        "/subscriptions/different-cuid/payment/onboarding-link"
      );
    });
  });

  describe("getDashboardLink", () => {
    it("should get dashboard link successfully", async () => {
      const mockResponse = {
        success: true,
        data: {
          url: "https://connect.stripe.com/express/acct_123456",
        },
      };

      mockAxiosAuth.get.mockResolvedValue(mockResponse);

      const result = await paymentService.getDashboardLink("test-cuid");

      expect(mockAxiosAuth.get).toHaveBeenCalledWith(
        "/subscriptions/test-cuid/payment/dashboard-link"
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle dashboard link error", async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: "Dashboard access denied",
          },
        },
      };

      mockAxiosAuth.get.mockRejectedValue(mockError);

      await expect(
        paymentService.getDashboardLink("test-cuid")
      ).rejects.toEqual(mockError);
    });

    it("should handle unauthorized access", async () => {
      const mockError = {
        response: {
          status: 403,
          data: {
            success: false,
            message: "Forbidden",
          },
        },
      };

      mockAxiosAuth.get.mockRejectedValue(mockError);

      await expect(
        paymentService.getDashboardLink("test-cuid")
      ).rejects.toEqual(mockError);
    });
  });

  describe("Error handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network Error");
      mockAxiosAuth.post.mockRejectedValue(networkError);

      await expect(
        paymentService.createConnectAccount("test-cuid", {
          email: "test@example.com",
          country: "US",
          businessType: "company",
        })
      ).rejects.toThrow("Network Error");
    });

    it("should handle timeout errors", async () => {
      const timeoutError = {
        code: "ECONNABORTED",
        message: "timeout of 10000ms exceeded",
      };
      mockAxiosAuth.post.mockRejectedValue(timeoutError);

      await expect(
        paymentService.getOnboardingLink("test-cuid")
      ).rejects.toEqual(timeoutError);
    });
  });
});
