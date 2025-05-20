import axios from "@configs/axios";

class UtilityService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/properties`;

  constructor() {}

  async validateAddress(cid: string, address: string) {
    try {
      const result = await axios.post(
        `${this.baseUrl}/${cid}/generate_address`,
        { address }
      );
      return result;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }
}

export const utilsService = new UtilityService();
