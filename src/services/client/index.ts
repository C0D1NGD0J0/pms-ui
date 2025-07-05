import axios from "@configs/axios";
import { UpdateClientDetailsFormData } from "@validations/client.validations";

class ClientService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/clients`;

  constructor() {}

  async getClientDetails(cid: string) {
    try {
      const result = await axios.get(
        `${this.baseUrl}/${cid}/client_details`,
        undefined,
        this.axiosConfig
      );
      return result.data.data;
    } catch (error) {
      console.error("Error fetching client details:", error);
      throw error;
    }
  }

  async updateClient(cid: string, data: UpdateClientDetailsFormData) {
    try {
      const result = await axios.patch(
        `${this.baseUrl}/${cid}/client_details`,
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
