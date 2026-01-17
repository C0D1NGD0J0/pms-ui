import axios from "@configs/axios";
import { buildNestedQuery } from "@utils/helpers";
import {
  IServerResponseWithPagination,
  ISubscriptionPlan,
  NestedQueryParams,
} from "@src/interfaces";

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

      const result = await axios.get<
        IServerResponseWithPagination<ISubscriptionPlan[]>
      >(url, this.axiosConfig);
      return result.data;
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();
