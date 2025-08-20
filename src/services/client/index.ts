import axios from "@configs/axios";
import { UpdateClientDetailsFormData } from "@validations/client.validations";

class ClientService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/clients`;

  constructor() {}

  async getClientDetails(cuid: string) {
    try {
      const result = await axios.get(
        `${this.baseUrl}/${cuid}/client_details`,
        this.axiosConfig
      );
      return result.data.data;
    } catch (error) {
      console.error("Error fetching client details:", error);
      throw error;
    }
  }

  async updateClient(cuid: string, data: UpdateClientDetailsFormData) {
    try {
      const result = await axios.patch(
        `${this.baseUrl}/${cuid}/client_details`,
        data,
        this.axiosConfig
      );
      return result.data.data;
    } catch (error) {
      console.error("Error updating client details:", error);
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
}

export const clientService = new ClientService();
