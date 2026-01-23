import axios from "@configs/axios";
import { buildNestedQuery } from "@utils/helpers";
import { ISubscriptionPlan, NestedQueryParams } from "@src/interfaces";

class SubscriptionService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/subscriptions`;

  constructor() {}

  async getSubscriptionPlans(params?: NestedQueryParams) {
    try {
      const queryString = buildNestedQuery(params || {});
      let url = `${this.baseUrl}/plans`;
      if (queryString) {
        url += `?${queryString}`;
      }

      const result = await axios.get<{ data: ISubscriptionPlan[] }>(
        url,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      throw error;
    }
  }

  async initSubscriptionPayment(
    cuid: string,
    data: {
      priceId?: string;
      lookupKey?: string;
      billingInterval?: "monthly" | "annual";
      successUrl: string;
      cancelUrl: string;
    }
  ) {
    try {
      const result = await axios.post<{
        success: boolean;
        message: string;
        data: {
          checkoutUrl: string;
          sessionId: string;
        };
      }>(
        `${this.baseUrl}/${cuid}/init-subscription-payment`,
        data,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error initializing subscription payment:", error);
      throw error;
    }
  }

  async downgradeToEssential(cuid: string) {
    try {
      const result = await axios.post<{
        success: boolean;
        message: string;
        data: {
          subscription: {
            planName: string;
            status: string;
          };
        };
      }>(
        `${this.baseUrl}/${cuid}/downgrade-to-essential`,
        {},
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error downgrading subscription:", error);
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();
