import axios from "@configs/axios";
import { buildNestedQuery } from "@utils/helpers";
import { prepareRequestData } from "@utils/formDataTransformer";
import { NestedQueryParams } from "@interfaces/common.interface";
import { UpdateClientDetailsFormData } from "@validations/client.validations";
import {
  IListResponseWithPagination,
  IFilteredTenantsParams,
  IUserRoleType,
} from "@interfaces/user.interface";

/**
 * @deprecated Use NestedQueryParams with filter.role instead
 * Kept for backward compatibility
 */
export interface IFilteredUsersParams {
  type?: "employee" | "tenant" | "vendor";
  role?: IUserRoleType | IUserRoleType[];
  department?: string;
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

class UsersService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/users`;

  constructor() {}

  async getUserEmployeeDetails(cuid: string, uid: string) {
    try {
      const result = await axios.get(
        `${this.baseUrl}/${cuid}/user_details/${uid}`,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  }

  async getFilteredUsers(
    cuid: string,
    params?: NestedQueryParams
  ): Promise<IListResponseWithPagination> {
    try {
      // Handle role array specially - backend expects comma-separated string
      let processedParams = params;
      if (params?.filter?.role && Array.isArray(params.filter.role)) {
        processedParams = {
          ...params,
          filter: {
            ...params.filter,
            role: params.filter.role.join(","),
          },
        };
      }

      const queryString = buildNestedQuery(processedParams || {});
      let url = `${this.baseUrl}/${cuid}/filtered-users`;
      if (queryString) {
        url += `?${queryString}`;
      }

      const result = await axios.get(url, this.axiosConfig);
      return result.data;
    } catch (error) {
      console.error("Error fetching filtered users:", error);
      throw error;
    }
  }

  async getUserStats(
    cuid: string,
    params?: NestedQueryParams
  ): Promise<any> {
    try {
      // Handle role array specially - backend expects comma-separated string
      let processedParams = params;
      if (params?.filter?.role && Array.isArray(params.filter.role)) {
        processedParams = {
          ...params,
          filter: {
            ...params.filter,
            role: params.filter.role.join(","),
          },
        };
      }

      const queryString = buildNestedQuery(processedParams || {});
      let url = `${this.baseUrl}/${cuid}/users/stats`;
      if (queryString) {
        url += `?${queryString}`;
      }

      const result = await axios.get(url, this.axiosConfig);
      return result.data;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  }

  async getClientPropertyManagers(
    cuid: string,
    params?: {
      role?: "admin" | "staff" | "manager" | "all";
      department?: "maintenance" | "operations" | "accounting" | "management";
      search?: string;
      page?: number;
      limit?: number;
    }
  ) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.role) queryParams.append("role", params.role);
      if (params?.department)
        queryParams.append("department", params.department);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      let url = `${this.baseUrl}/${cuid}/property_managers`;
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      const result = await axios.get(url, this.axiosConfig);
      return result.data;
    } catch (error) {
      console.error("Error fetching property managers:", error);
      throw error;
    }
  }

  async getProfileDetails(cuid: string, uid: string | undefined) {
    try {
      const queryParams = new URLSearchParams();
      if (uid) queryParams.append("uid", uid);

      let url = `${this.baseUrl}/${cuid}/profile_details/`;
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const result = await axios.get(url, {
        ...this.axiosConfig,
      });
      return result.data;
    } catch (error) {
      console.error("Error fetching user - profile details:", error);
      throw error;
    }
  }

  async updateUserProfile(
    cuid: string,
    uid: string,
    data: UpdateClientDetailsFormData | any
  ) {
    try {
      const { data: requestData, headers } = prepareRequestData(data);

      const config = {
        ...this.axiosConfig,
        headers: {
          ...headers,
        },
      };

      const queryParams = new URLSearchParams();
      if (uid) queryParams.append("uid", uid);

      let url = `${this.baseUrl}/${cuid}/update_profile/`;
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const result = await axios.patch(url, requestData, config);
      return result.data.data;
    } catch (error) {
      console.error("Error updating user details:", error);
      throw error;
    }
  }

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

  async getClientTenantDetails(cuid: string, uid: string, include?: string[]) {
    try {
      const queryParams = new URLSearchParams();
      if (include && include.length > 0) {
        queryParams.append("include", include.join(","));
      }

      let url = `${this.baseUrl}/${cuid}/client_tenant/${uid}`;
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const result = await axios.get(url, this.axiosConfig);
      return result.data;
    } catch (error) {
      console.error("Error fetching tenant:", error);
      throw error;
    }
  }

  async updateTenant(cuid: string, uid: string, data: any) {
    try {
      const result = await axios.patch(
        `${this.baseUrl}/${cuid}/tenant_details/${uid}`,
        data,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error updating tenant:", error);
      throw error;
    }
  }

  async deactivateTenant(cuid: string, uid: string) {
    try {
      const result = await axios.delete(
        `${this.baseUrl}/${cuid}/tenant_details/${uid}`,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error deactivating tenant:", error);
      throw error;
    }
  }

  async getAvailableTenants(cuid: string) {
    try {
      const result = await axios.get(
        `${this.baseUrl}/${cuid}/available-tenants`,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching available tenants:", error);
      throw error;
    }
  }
}

export const userService = new UsersService();
