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
}

export const clientService = new ClientService();
