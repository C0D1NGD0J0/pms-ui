import axios from "@configs/axios";
import { VendorQueryParams } from "@src/interfaces";
import { IListResponseWithPagination } from "@interfaces/user.interface";

export interface IFilteredVendorsParams {
  status?: "active" | "inactive";
  businessType?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}

class VendorService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/vendors`;

  constructor() {}

  async getVendorDetails(cuid: string, vuid: string) {
    try {
      const result = await axios.get(
        `${this.baseUrl}/${cuid}/vendor_details/${vuid}`,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      throw error;
    }
  }

  async getFilteredVendors(
    cuid: string,
    params?: IFilteredVendorsParams
  ): Promise<IListResponseWithPagination> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.status) queryParams.append("status", params.status);
      if (params?.businessType)
        queryParams.append("businessType", params.businessType);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sort) queryParams.append("sort", params.sort);

      let url = `${this.baseUrl}/${cuid}/filteredVendors`;
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const result = await axios.get(url, this.axiosConfig);
      return result.data;
    } catch (error) {
      console.error("Error fetching filtered vendors:", error);
      throw error;
    }
  }

  async getClientVendors(cuid: string): Promise<any> {
    try {
      const result = await axios.get(
        `${this.baseUrl}/${cuid}`,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching client vendors:", error);
      throw error;
    }
  }

  async getVendorStats(
    cuid: string,
    params?: { status?: "active" | "inactive" }
  ): Promise<any> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.status) {
        queryParams.append("status", params.status);
      }

      let url = `${this.baseUrl}/${cuid}/vendors/stats`;
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const result = await axios.get(url, this.axiosConfig);
      return result.data;
    } catch (error) {
      console.error("Error fetching vendor stats:", error);
      throw error;
    }
  }

  async getVendorTeamMembers(
    cuid: string,
    vuid: string,
    pagination?: VendorQueryParams
  ) {
    try {
      const q = new URLSearchParams();

      if (pagination?.status) q.append("status", pagination.status);
      if (pagination?.page) q.append("page", pagination.page.toString());
      if (pagination?.limit) q.append("limit", pagination.limit.toString());
      if (pagination?.sortBy) q.append("sortBy", pagination.sortBy);
      if (pagination?.sort) q.append("sort", pagination.sort);

      let url = `${this.baseUrl}/${cuid}/team_members/${vuid}`;
      if (q.toString()) {
        url += `?${q.toString()}`;
      }

      const result = await axios.get(url);
      return result.data;
    } catch (error) {
      console.error("Error fetching vendor team members:", error);
      throw error;
    }
  }
}

export const vendorService = new VendorService();
