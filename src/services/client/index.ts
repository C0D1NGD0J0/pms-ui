import axios from "@configs/axios";

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
      return result.data;
    } catch (error) {
      console.error("Error fetching client details:", error);
      throw error;
    }
  }
}

export const clientService = new ClientService();
