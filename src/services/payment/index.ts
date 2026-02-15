import axios from "@configs/axios";

class PaymentService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/payments`;

  constructor() {}

  /**
   * Create Stripe Connect account for property manager
   * @param cuid - Client unique identifier
   * @param data - Account creation data (email, country, businessType)
   */
  async createConnectAccount(
    cuid: string,
    data: {
      email: string;
      country: string;
      businessType: "individual" | "company";
    }
  ): Promise<{
    success: boolean;
    data: {
      accountId: string;
      chargesEnabled: boolean;
      payoutsEnabled: boolean;
      detailsSubmitted: boolean;
    };
  }> {
    try {
      const result = await axios.post<{
        success: boolean;
        data: {
          accountId: string;
          chargesEnabled: boolean;
          payoutsEnabled: boolean;
          detailsSubmitted: boolean;
        };
      }>(`${this.baseUrl}/${cuid}/onboard`, data, this.axiosConfig);
      return result;
    } catch (error) {
      console.error("Error creating Stripe Connect account:", error);
      throw error;
    }
  }

  /**
   * Get Stripe onboarding link for KYC completion
   * @param cuid - Client unique identifier
   */
  async getOnboardingLink(cuid: string): Promise<{
    success: boolean;
    data: {
      url: string;
      expiresAt: number;
    };
  }> {
    try {
      const result = await axios.get<{
        success: boolean;
        data: {
          url: string;
          expiresAt: number;
        };
      }>(`${this.baseUrl}/${cuid}/onboarding-link`, this.axiosConfig);
      return result;
    } catch (error) {
      console.error("Error getting onboarding link:", error);
      throw error;
    }
  }

  /**
   * Get Stripe Express dashboard login link
   * @param cuid - Client unique identifier
   */
  async getDashboardLink(cuid: string): Promise<{
    success: boolean;
    data: {
      url: string;
      expiresAt: number;
    };
  }> {
    try {
      const result = await axios.get<{
        success: boolean;
        data: {
          url: string;
          expiresAt: number;
        };
      }>(`${this.baseUrl}/${cuid}/dashboard-login-link`, this.axiosConfig);
      return result;
    } catch (error) {
      console.error("Error getting dashboard link:", error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
