import axios from "@configs/axios";
import { IListResponseWithPagination } from "@interfaces/user.interface";

export interface IFilteredTenantsParams {
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

class TenantsService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/tenants`;

  constructor() {}

  async getTenants(
    cuid: string,
    params?: IFilteredTenantsParams
  ): Promise<IListResponseWithPagination> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.status) queryParams.append("status", params.status);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sort) queryParams.append("sort", params.sort);

      let url = `${this.baseUrl}/${cuid}/filtered-tenants`;
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const result = await axios.get(url, this.axiosConfig);
      return result.data;
    } catch (error) {
      console.error("Error fetching filtered tenants:", error);
      throw error;
    }
  }
}

export const tenantService = new TenantsService();
