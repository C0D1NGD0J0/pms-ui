import axios from "@configs/axios";
import { UpdateClientDetailsFormData } from "@validations/client.validations";
import {
  IListResponseWithPagination,
  IUserRoleType,
} from "@interfaces/user.interface";

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

  async getClientDetails(cuid: string, uid: string) {
    try {
      const result = await axios.get(
        `${this.baseUrl}/${cuid}/user_details/${uid}`,
        this.axiosConfig
      );
      return result.data.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  }

  async updateUser(
    cuid: string,
    uid: string,
    data: UpdateClientDetailsFormData
  ) {
    try {
      const result = await axios.patch(
        `${this.baseUrl}/${cuid}/user_details/${uid}`,
        data,
        this.axiosConfig
      );
      return result.data.data;
    } catch (error) {
      console.error("Error updating user details:", error);
      throw error;
    }
  }

  async getFilteredUsers(
    cuid: string,
    params?: IFilteredUsersParams
  ): Promise<IListResponseWithPagination> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.role) {
        if (Array.isArray(params.role)) {
          params.role = params.role.join(",") as any;
          console.log("Filtered role:", params.role);
          queryParams.append("role", params.role as any);
        } else {
          queryParams.append("role", params.role);
        }
      }
      if (params?.department)
        queryParams.append("department", params.department);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sort) queryParams.append("sort", params.sort);

      let url = `${this.baseUrl}/${cuid}/filtered-users`;
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const result = await axios.get(url, this.axiosConfig);
      return result.data;
    } catch (error) {
      console.error("Error fetching filtered users:", error);
      throw error;
    }
  }
}

export const userService = new UsersService();
